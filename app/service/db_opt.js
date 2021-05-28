'use strict';
const Service = require('egg').Service;

class Db_optService extends Service {
  async addBook(item) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.insert('lab5_Books', { BookNo: item.BookNo, BookType: item.BookType, BookName: item.BookName, Publisher: item.Publisher, Year: item.Year, Author: item.Author, Price: item.Price, Total: item.Total, Storage: item.Storage, UpdateTime: this.app.mysql.literals.now });
      const Total_book = await conn.select('lab5_Books', { where: { BookName: item.BookName, Author: item.Author } });
      for (let i = 0; i < Total_book.length; i++) { await conn.update('lab5_Books', { Total: Total_book.length, Storage: Total_book[i].Storage == null ? 1 : Total_book[i].Storage + 1 }, { where: { BookNo: Total_book[i].BookNo } }); }
      const res = await conn.select('lab5_Books');
      await conn.commit();
      console.log('restotal', res);
      return { status: 200, res };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }
  async addBooks(list) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      list.map(item => {
        this.addBook(item);
        return item;
      });
      await conn.commit();
      return { status: 200 };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }
  async addCard(item) {
    const res = await this.ctx.db.query('insert into card_tb valus (?,?,?)', item.s_id, item.name, item.grade);
    return res;
  }
  async findBooks() {
    const res = await this.app.mysql.select('lab5_Books');
    return res;
  }
  async findCards() {
    const res = await this.app.mysql.select('lab5_librarycard');
    return res;
  }
  async findRecords() {
    const res = await this.app.mysql.select('lab5_libraryrecords');
    return res;
  }
  async deleteBook(uid) {
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.delete('lab5_Books', {
        BookNo: uid,
      });
      const item = await conn.select('lab5_Books', { where: { BookNo: uid } });
      const Total_book = await conn.select('lab5_Books', { where: { BookName: item.BookName, Author: item.Author } });
      for (let i = 0; i < Total_book.length; i++) { await conn.update('lab5_Books', { Total: Total_book.length, Storage: Total_book[i].Storage - 1 }, { where: { BookNo: Total_book[i].BookNo } }); }

      const res = await conn.select('lab5_Books');
      await conn.commit();
      return { status: 200, res };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }
  async deleteCard(uid) {
    const res = await this.ctx.db.query('delete from card_tb where s_id = ?', uid);
    return res;
  }
  async updateBook(item) {

    const conn = await this.app.mysql.beginTransaction();
    const options = {
      where: {
        BookNo: item.oldid,
      },
    };
    try {
      await conn.update('lab5_Books', { BookNo: item.BookNo, BookType: item.BookType, BookName: item.BookName, Publisher: item.Publisher, Year: item.Year, Author: item.Author, Price: item.Price, Total: item.Total, Storage: item.Storage, UpdateTime: this.app.mysql.literals.now }, options);
      const Total_book = await conn.select('lab5_Books', { where: { BookName: item.BookName, Author: item.Author } });
      for (let i = 0; i < Total_book.length; i++) { await conn.update('lab5_Books', { Total: Total_book.length, Storage: Total_book[i].Storage == null ? 1 : Total_book[i].Storage + 1 }, { where: { BookNo: Total_book[i].BookNo } }); }
      const res = await conn.select('lab5_Books');
      await conn.commit();
      return { status: 200, res };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }
  async updateCard(item) {
    const res = await this.ctx.db.query('delete from card_tb where s_id = ?', item.s_id, item.name, item.grade);
    return res;
  }

  async borrowBook(item) {
    const book_info = await this.app.mysql.select('lab5_Books', { where: { BookNo: item.BookNo } });
    if (book_info[0].length === 0) {
      return 300;
    }
    if (book_info[0].Storage === null || book_info[0].Storage <= 0) {
      return 301;
    }
    // update Total for all the same books;
    const options = {
      where: {
        BookName: book_info[0].BookName,
        Author: book_info[0].Author,
      },
    };
    const row = {
      Total: book_info[0].Storage - 1,
    };
    const conn = await this.app.mysql.beginTransaction();
    try {
      await conn.update('lab5_Books', row, options);
      // build new record for record table;
      const user_info = await conn.select('lab5_librarycard', { where: { CardNo: item.CardNo } });
      console.log(user_info);
      const res = await conn.insert('lab5_libraryrecords', { FID: null, CardNo: item.CardNo, BookNo: item.BookNo, LentDate: this.app.mysql.literals.now, Operator: user_info[0].UserID });
      await conn.commit();
      return { status: 200, res };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }

  async returnBook(item) {
    console.log('item', item);
    const record_data = await this.app.mysql.select('lab5_libraryrecords', { where: { BookNo: item.BookNo } });
    console.log('record', record_data);
    if (record_data.length <= 0) {
      return 300;
    }
    let hasRecord = 0;
    record_data.map(i => {
      if (i.ReturnDate == null) {
        hasRecord = 1;
      }
      return i;
    });
    if (hasRecord === 0) {
      return 301;
    }
    const conn = await this.app.mysql.beginTransaction();
    try {
      const book_info = await this.app.mysql.select('lab5_Books', { where: { BookNo: item.BookNo } });
      await conn.update('lab5_libraryrecords', { ReturnDate: this.app.mysql.literals.now }, { where: { BookNo: item.BookNo, ReturnDate: null } });
      await conn.update('lab5_Books', { Storage: book_info[0].Storage + 1 }, { where: { BookName: book_info[0].BookName, Author: book_info[0].Author } });
      await conn.commit();
      return { status: 200 };
    } catch (e) {
      console.log(e);
      await conn.rollback();
      throw e;
    }
  }
}

module.exports = Db_optService;

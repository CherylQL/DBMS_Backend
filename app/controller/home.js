'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async login() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const res = await ctx.service.login.login(ctx.request.body);
    console.log('login', res);
    ctx.body = {
      res,
    };
  }
  async add() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.addBooks(ctx.request.body);
    if (res.status === 200) {
      ctx.body = res;
    } else {
      ctx.body = { status: 500, errMsg: res };
    }
  }

  async find() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.findBooks();
    ctx.body = { res };
    ctx.status = 200;
  }
  async findRecords() {
    const { ctx } = this;
    console.log(ctx.request);
    const res = await ctx.service.dbOpt.findRecords();
    ctx.body = { res };
    ctx.status = 200;
  }
  async deleteBook() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.deleteBook(ctx.request.body.b_id);
    console.log(this.request);
    if (res.status === 200) {
      ctx.body = res;
    } else {
      ctx.body = { status: 500, errMsg: res };
    }
  }

  async updateBook() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.updateBook(ctx.request.body);
    console.log(ctx.request.body);
    if (res.status === 200) {
      ctx.body = res;
    } else {
      ctx.body = { status: 500, errMsg: res };
    }
  }

  async borrowBook() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.borrowBook(ctx.request.body);
    console.log(ctx.request.body);
    if (res.status === 200) {
      console.log(res);
      ctx.body = { status: 200 };
    } else if (res === 300) {
      ctx.body = { status: 300, errMsg: "There's no such books" };
    } else if (res === 301) {
      ctx.body = { status: 301, errMsg: "There's no sufficient books" };
    } else {
      return res;
    }
  }

  async returnBook() {
    const { ctx } = this;
    const res = await ctx.service.dbOpt.returnBook(ctx.request.body);
    console.log(ctx.request.body);
    if (res.status === 200) {
      console.log(res);
      ctx.body = { status: 200 };
    } else if (res === 300) {
      ctx.body = { status: 300, errMsg: "There's no such record" };
    } else if (res === 301) {
      ctx.body = { status: 300, errMsg: 'The book has been returned' };
    } else {
      return res;
    }
  }
}
module.exports = HomeController;

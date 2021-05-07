'use strict';
const Service = require('egg').Service;

class LoginService extends Service {
  async login(item) {
    console.log(item);
    try {
      const user_data = await this.app.mysql.select('lab5_users', { where: { UserID: item.UserID } });
      console.log(user_data);
      if (user_data.length <= 0) return 300;
      if (item.Password === user_data[0].Password) {
        const token = await this.app.jwt.sign({
          UserID: user_data.UserID,
        }, this.app.config.jwt.secret);
        console.log('token', token);
        return { status: 200, token };
      }
    } catch (e) {
      console.log(e);
      return { status: 500, errMsg: e };
    }
  }
}
module.exports = LoginService;

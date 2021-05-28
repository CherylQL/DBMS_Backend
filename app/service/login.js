'use strict';
const Service = require('egg').Service;

class LoginService extends Service {
  async login(item) {
    try {
      const user_data = await this.app.mysql.select('lab5_users', { where: { UserID: item.UserID } });
      if (user_data.length <= 0) return { status: 300 };
      if (item.Password === user_data[0].Password && item.UserID === 'admin') {
        const token = await this.app.jwt.sign({
          UserID: user_data.UserID,
        }, this.app.config.jwt.secret);
        return { status: 200, token };
      }
      return { status: 301, name: user_data[0].Name };
    } catch (e) {
      console.log(e);
      return { status: 500, errMsg: e };
    }
  }
}
module.exports = LoginService;

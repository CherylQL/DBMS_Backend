'use strict';
module.exports = (options, app) => {
  return async (ctx, next) => {
    const { token } = ctx.header;
    console.log(token);
    if (!token) {
      ctx.throw(400, '没有权限');
    }
    // 2根据token，换取用户信息
    let user = {};
    try {
      user = ctx.checkToken(token);
    } catch (error) {
      const fail = error.name === 'TokenExpiredError' ? 'token 已过期! 请重新获取令牌' : 'Token 令牌不合法!';
      ctx.throw(400, fail);
    }
    // 3判断当前用户是否登陆
    const t = await ctx.service.cache.get('user_' + user.id);
    if (!t || t !== token) {
      ctx.throw(400, 'token不合法');
    }
    // 4,判断用户的状态
    user = await app.model.User.findByPk(user.id);
    if (!user || user.status === 0) {
      ctx.throw(400, '用户不存在或已经被禁用');
    }
    // 5，把user信息挂载到全局ctx
    ctx.authUser = user;
    await next();
  };
};

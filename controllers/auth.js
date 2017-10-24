const jwt = require('jwt-simple');
const fs = require('fs');
const yaml = require('js-yaml');
const User = require('../models/user');
const passport = require('../services/passport');

const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf-8'));

function tokenForUser(user) {
  return jwt.encode({
    sub: user.id,
    iat: Date.now()
  }, config.secret);
}

// 注册
module.exports.register = async(ctx, next) => {
  const {
    username,
    password
  } = ctx.request.body;
  // 查询是否存在当前用户名
  const member = await User.findOne({
    username
  });
  // 用户名已经占用
  if (member) {
    return ctx.body = {
      status: 422,
      message: '用户已经存在'
    };
  }
  const user = new User({
    username,
    password
  });
  await user.save();
  ctx.body = {
    status: 0,
    message: '注册成功',
    token: tokenForUser(user)
  };
};

// 登录
module.exports.login = (ctx, next) => {
  return passport.authenticate('local', function(err, user, info, status) {
    if (err) {
      return ctx.body = {
        status: -10000,
        message: err.message
      };
    }

    if (!user) {
      return ctx.body = {
        status: -10000,
        message: '密码错误！'
      };
    }
    ctx.body = {
      status: 0,
      message: '登录成功',
      token: tokenForUser(user)
    };
  })(ctx);
};

module.exports.profile = (ctx, next) => {
  return passport.authenticate('jwt', function(err, user, info, status) {
    if (err) {
      return ctx.body = {
        status: -10000,
        message: err.message
      };
    }

    if (!user) {
      return ctx.body = {
        status: -10000,
        message: 'token错误！'
      };
    }
    ctx.body = {
      status: 0,
      message: 'ok',
      results: user
    };
  })(ctx);
};

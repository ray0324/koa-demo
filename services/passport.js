const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const yaml = require('js-yaml');
const User = require('../models/user');
const config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf-8'));

/**
 *
 * 本地用户名密码登录授权
 * 回调函数格式 done(err, user, info)
 * return done(null, false, { message: 'Incorrect username.' });
 * 回调格式说明参考官方文档 http://www.passportjs.org/docs/overview
 */
const localOptions = {
  usernameField: 'username'
};
passport.use(new LocalStrategy(localOptions, async(username, password, done) => {
  try {
    // 查询用户
    const user = await User.findOne({
      username
    });
    if (!user) {
      throw new Error('用户不存在!');
    };
    // 比较密码
    user.comparePwd(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  } catch (err) {
    done(err);
  }
}));

/**
 * Json Web Token 形式授权
 * 回调函数格式 done(err, user, info)
 * 回调格式说明参考官方文档 http://www.passportjs.org/docs/overview
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKey: config.secret
};
passport.use(new JwtStrategy(jwtOptions, async(payload, done) => {
  const user = await User.findById(payload.sub);
  if (user) return done(null, user);
  done(null, false);
}));

module.exports = passport;

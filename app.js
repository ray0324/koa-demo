const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');

const mongoose = require('mongoose');

// ruoters
const index = require('./routes/index');
const users = require('./routes/users');
mongoose.connect('mongodb://localhost/Hello', { useMongoClient: true });
mongoose.Promise = global.Promise;

// error handler
onerror(app);

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            status: err.statusCode || err.status,
            message: err.message
        };
    }
});

// middlewares
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }));

app.use(json());

app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', { extension: 'pug' }));

app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;

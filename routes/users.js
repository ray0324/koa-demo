const router = require('koa-router')();
const auth = require('../controllers/auth');

router.prefix('/users');

router.get('/', ctx => {
    ctx.body= 'users!';
});

router.post('/login', auth.login);
router.post('/register', auth.register);
router.post('/profile', auth.profile);

module.exports = router;

const express = require('express');
const router = express.Router();
const { signup, login } = require('./controllers/authentication');
const passport = require('passport');
const passportConfig = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
// const requireLogin = passport.authenticate('local', { session: false });

router.get('/', (req, res) => {
    res.send({ message: 'welcome to the api' });
});

router.get('/auth', requireAuth, (req, res) => {
    res.send({ message: 'protected route' });
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;

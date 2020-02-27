const express = require('express');
const router = express.Router();
const { signup, login } = require('./controllers/authentication');

router.get('/', (req, res) => {
    res.send({ message: 'welcome to the api' });
});

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;

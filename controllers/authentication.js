const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { SECRET_JWT } = require('../keys');

function userToken(user) {
    return jwt.encode({ sub: user.id, iat: Date.now() }, SECRET_JWT);
}

module.exports = {
    signup: (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(422)
                .send({ error: 'email and password required' });
        User.findOne({ email }, (err, existingUser) => {
            if (err) return next(err);

            if (existingUser) {
                return res.status(422).send({ error: 'Email in use!' });
            }

            bcrypt.genSalt(10, (err, salt) => {
                if (err) return next(err);

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return next(err);

                    User.create({
                        email: email,
                        password: hash
                    })
                        .then(user => res.json({ token: userToken(user) }))
                        .catch(e => console.log(e));
                });
            });
        });
    },
    login: (req, res, next) => {
        next();
    }
};

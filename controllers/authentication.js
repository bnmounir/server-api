const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jwt-simple');

function userToken(user) {
    return jwt.encode(
        { sub: user.id, iat: Date.now() },
        process.env.SECRET_JWT
    );
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
        const { email, password } = req.body;
        if (!email) {
            return res.status(422).json({
                error: 'email is required'
            });
        }

        if (!password) {
            return res.status(422).json({
                error: 'password is required'
            });
        }

        passport.authenticate(
            'local',
            { session: false },
            (err, passportUser, info) => {
                if (err) return next(err);
                if (!passportUser) {
                    return res
                        .status(401)
                        .json({ error: 'email or password is incorrect' });
                }
                if (passportUser) {
                    return res.json({ token: userToken(passportUser) });
                }
                return res.status(404).json(info);
            }
        )(req, res, next);
    }
};

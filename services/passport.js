const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { Strategy, ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const { SECRET_JWT } = require('../keys');

const localLogin = new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);

            user.comparePassword(password, function(err, isMatch) {
                if (err) return done(err);

                if (!isMatch) return done(null, false);

                return done(null, user);
            });
        });
    }
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: SECRET_JWT
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);

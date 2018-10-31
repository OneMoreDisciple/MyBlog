const bcrypt = require('bcryptjs')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport) => {

    passport.use(new LocalStrategy({ usernameField: 'pseudo' },
        (pseudo, password, done) => {
          User.findOne({ pseudo: pseudo }, (err, user) => {
            if (err) { return done(err) }
            if (!user) {
              return done(null, false, { message: 'Le pseudo n\'existe pas.' })
            }
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Le mot de passe est incorrect.' })
            }

            return done(null, user)
            
          })
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
    })
}
'use strict'

const 
    express = require('express'),
    app = express(),
    mustacheExpress = require('mustache-express'),
    MongoClient = require("mongodb").MongoClient,
    bcrypt = require('bcryptjs'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash'),

// Config

    config = require('./config/config')

// Options

mongoose.connect(config.paths.db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })

let db = mongoose.connection

db.once('open', () => {
    // Check connection to MongoDB 
    console.log('Connected to MongoDB')
})

db.on('error', (err) => {
    console.log(err)
})

require('./config/passport')(passport)

app.engine('mst', mustacheExpress())
app.set('view engine', 'mst')

app.use(express.static(config.paths.assets));
app.set('views', config.paths.views)

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('keyboard cat'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes

const users = require('./routes/users')
const articles = require('./routes/articles')

// Routing

app.use('/users', users)
app.use('/articles', articles)
app.use('/', articles)

app.use( (req, res, next) => {
    res.status(404)

    res.render('404', { title: 'Page introuvable !', logged: (req.user != null) })
})



// Server
 
app.listen(8080, () => {
    console.log('Server ON')
})
  
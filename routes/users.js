const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const register = require('../middlewares/register')
const passport = require('passport')

const User = require('../models/user')
const Article = require('../models/article')

require('../config/passport')(passport)

router.get('/register', csrfProtection, (req, res) => {
    if (req.user == null)
        res.render('register', { title : 'Inscription', csrfToken: req.csrfToken() })
    else
        res.redirect('/home')
})

router.post('/register', csrfProtection, register, (req, res) => {
    req.user.save ((err, user) => {
        if (err) {
            req.flash('error', 'Une erreur est survenue lors de la sauvegarde.')
        } else {
            req.flash('success', 'Vous êtes bien inscrit !')
        }

    })
    res.redirect('/users/login')
})

router.get('/login', csrfProtection, (req, res) => {

    if (req.user == null)
        res.render('login', { title: 'Connexion', csrfToken: req.csrfToken(), error: req.flash('error') })
    else 
        res.redirect('/home')
})

router.post('/login', csrfProtection, passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/users/login', failureFlash: true }), (req, res) => {

})

router.get('/logout', (req, res) => {


    if (req.session != null) {
        req.logout()
        req.flash('success', 'Vous êtes bien déconnecté !')
    }

    res.redirect('/')
})

router.get('/profile', (req, res) => {
    if (req.user != null) {

        let articles = Article.find({ author: req.user.pseudo }, (err, articles) => {
            res.render('profile', { title: 'Profil de ' + req.user.pseudo, user: req.user, logged: (req.user != null), articles: articles })
        })
        
    } else {
        res.redirect('/home')
    }

})

router.get('/profile/:pseudo', (req, res) => {
    if (req.user != null) {
        if (req.params.pseudo == req.user) {
            res.redirect('/profile')
        } 
    }

    let user = User.findOne({ pseudo: req.params.pseudo }, (err, user) => {
        if (user == null) {
            res.redirect('/')
        } else {
            let articles = Article.find({ author: req.params.pseudo }, (err, articles) => {
                res.render('profile', { title: 'Profil de ' + user.pseudo, user: user, logged : (req.user != null), articles: articles })
            })
        }


    })

    
    
})

module.exports = router
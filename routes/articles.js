const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const article = require('../middlewares/article')
const slugify = require('slugify')

const User = require('../models/user')
const Article = require('../models/article')

const dateFormat = require('../app/date')

router.get(['/', '/home'], (req, res) => {



    Article.find({}, (err, articles) => {
        console.log(articles[0].created_at, typeof articles[0].created_at)
        if (err) console.log(err)
        User.find({}, (err, users) => {
            if (err) console.log(err)
            res.render('index', { title: 'Accueil', logged : (req.user != null), success: req.flash('success'), error: req.flash('error'), articles: articles, users: users})
        })
        
    })
    
})

router.get('/create', csrfProtection, (req, res) => {

    if (req.user != null) 
        res.render('create', { title: 'Création', logged: true, csrfToken: req.csrfToken(), success: req.flash('success'), error: req.flash('error') })
    else 
        res.redirect('/')
    
})

router.post('/create', csrfProtection, article, (req, res) => {

    req.article.save((err, article) => { console.log(err) })
    req.flash('success', 'L\'article a bien été créé !')   
    res.redirect('/show/' + req.article.slug)

})

router.get('/show/:slug', csrfProtection, (req, res) => {
    let article = Article.findOne({ slug: req.params.slug }, (err, article) => {
        if (err) console.log(err)
        let isAuthor = false
        if (req.user) isAuthor = (req.user.pseudo == article.author)

        let created_at = dateFormat(article.created_at)
        let updated_at 
        if (article.updated_at == undefined) {
            updated_at = null
        } else {
            updated_at = dateFormat(article.updated_at)
        }
        

        res.render('show', { title: article.title, logged: (req.user != null), article: article, created_at: created_at, updated_at: updated_at, isAuthor: isAuthor, csrfToken: req.csrfToken(), success: req.flash('success'), error: req.flash('error') })
    })
})

router.post('/delete/:slug', csrfProtection, (req, res) => {
    Article.findOneAndDelete({ slug: req.params.slug }, (err, article) => {
        req.flash('success', 'L\'article a bien été supprimé !')
        res.redirect('/')
    })
})

router.get('/edit/:slug', csrfProtection, (req, res) => {
    if (req.user != null) {
        let article = Article.findOne({ slug: req.params.slug }, (err, article) => {
            req.flash('author', article.author)
            if (req.user.pseudo == article.author)
                res.render('edit', { title: 'Modification', logged: true, article: article, csrfToken: req.csrfToken(), success: req.flash('success'), error: req.flash('error')})
            else
                res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

router.post('/edit/:slug', csrfProtection, (req, res) => {
    console.log(req.user.pseudo, req.flash('author'))
    if (req.user != null && req.user.pseudo == req.flash('author')) {
        Article.findOneAndUpdate({ slug: req.params.slug }, { $set: { slug: slugify(req.body.title), title: req.body.title, content: req.body.content, updated_at: new Date().toISOString(), author: req.user.pseudo}}, {new: true}, (err, article) => {
            req.flash('success', 'L\'article a bien été édité !')
            res.redirect('/edit/' + article.slug)
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router 
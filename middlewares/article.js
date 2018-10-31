const Article = require('../models/article.js')
const slugify = require('slugify')

let validation = (form, pseudo) => {
    return new Promise((resolve, reject) => {
        
        Article.findOne({ title: form.title }, (err, results) => {
            if (err) {
               reject('Une erreur est survenue lors de la recherche d\'article.' )
            }
                    

            if (results == null) {
                let slug = slugify(form.title)
                let article = new Article({ title: form.title, slug: slug, created_at: new Date().toISOString(), content: form.content, author: pseudo })
            
                resolve(article)

            } else {
                reject('Cet article existe déjà !')
            }

        })

   
    })
}



module.exports = (req, res, next) => {

    let validated = async () => {
        return await validation(req.body, req.user.pseudo)
    }

    validated().then((article) => {
        req.article = article
        next()
    }).catch ((error) => {
        req.flash('error', error)
        res.redirect('/articles/create')
    })

}
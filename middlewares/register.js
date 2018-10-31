const User = require('../models/user.js')

let validation = (form) => {
    return new Promise((resolve, reject) => {

        if (form.pseudo.length < 3 || form.pseudo.length > 10) {
            reject('Le pseudo doit être constitué de 3 à 10 caractères.')
    
        }
    
        if (form.password != form.password_confirm) {
            reject('Le mot de passe est incorrect.')
        }
        
    
        User.findOne({ pseudo: form.pseudo }, (err, results) => {
            if (err) {
               reject('Une erreur est survenue lors de la recherche d\'utilisateurs.' )
            }
                    

            if (results == null) {
        
                let user = new User({ pseudo: form.pseudo })
            
                user.password = user.generateHash(form.password)

                resolve(user)

            } else {
                reject('Ce pseudo existe déjà !')
            }

        })

   
    })
}



module.exports = (req, res, next) => {

    let registration = async () => {
        return await validation(req.body)
    }

    registration().then((user) => {
        req.user = user
        next()
    }).catch ((error) => {
        res.render('register', { title: 'Inscription', error: error, csrfToken: req.csrfToken() })
    })

}
const path = require("path")

const dir = path.resolve(__dirname, '..', '..')

const config = {

    db: {
        name: 'users'
    }, 
    paths: {
        views: dir + '\\src\\views', 
        assets: dir + '\\src\\assets', 
        db: 'mongodb://localhost/users'
    }
}

module.exports = config 
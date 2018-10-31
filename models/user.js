const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String, 
        required: true
    }

})

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


module.exports = mongoose.model('User', userSchema)
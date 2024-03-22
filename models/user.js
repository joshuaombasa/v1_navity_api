const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    vans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Van' }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._i_v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)
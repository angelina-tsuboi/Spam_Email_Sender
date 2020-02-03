var mongoose = require('mongoose')

let Mail = mongoose.model('Mail', {
    email: {
        type: String, 
        required: true
    }, 
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    }
})

module.exports = {
    Mail :Mail
}
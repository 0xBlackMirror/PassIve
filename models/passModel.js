const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PassSchema = mongoose.Schema({
    user: {
        required: true,
        type: String
    },
    service: {
        required: true,
        type: String
    },
    servicePassword: {
        required: true,
        type: String
    }
});

const Pass = module.exports = mongoose.model('servicePassword', PassSchema);

module.exports.getUserPasswords = function(username, callback){
    Pass.find({user: username}, callback);
}

module.exports.addServicePassword = function(newPass, callback){
    newPass.save(callback);
}
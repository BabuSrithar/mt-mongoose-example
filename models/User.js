var mongoose = require('mongoose');
var mt_mongoose = require("mt-mongoose");
User = {
    schema: new mongoose.Schema({
            userid: String,
            firstName: String,
            lastName: String
        }
    ),
    name: "users"
};

module.exports = function () {
    return mt_mongoose.getModel(User);
};
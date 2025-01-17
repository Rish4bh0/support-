const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique: true
    },
    phone: String,
},{timestamps:true});

module.exports = mongoose.model("Client",clientSchema,"Clients");
//post_model.js
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const postSchema = new schema({
}); 
module.exports = mongoose.model('login',postSchema);
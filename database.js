var mongo = require('mongoskin');




var MONGO_URL = 'mongodb://localhost/';
var DB_NAME = 'maize';

module.exports = mongo.db(MONGO_URL + DB_NAME);
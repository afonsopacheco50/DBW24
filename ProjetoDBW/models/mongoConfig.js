const mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var db;

module.exports = {
    connect: function (callback) {
        MongoClient.connect('mongodb+srv://DBW24:OQdmPqIvHEXTM2UF@clusterdbw.1dbjr.mongodb.net/DBW24?authSource=admin&replicaSet=atlas-bek8xj-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', { useNewUrlParser: true, useUnifiedTopology: true },function (err, database) {
            db = database.db('DBW24');
            callback(err);
        })},
    getDB:function(){
        return db;
    }

}

// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto');
// define the schema for our user model
var IndexCounterSchema = mongoose.Schema({
	_id : String,
	seq : Number,
	prefix : String
});

// Static Methods
IndexCounterSchema.static.saveDepartment = function(department){
	var deferred = Q.defer();
    department.save(function(error){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(department);
    });
    return deferred.promise;
}


module.exports = mongoose.model('IndexCounter', IndexCounterSchema);
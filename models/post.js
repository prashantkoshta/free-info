var mongoose = require('mongoose');
var crypto   = require('crypto');
var Q = require("q");
var PostSchema = mongoose.Schema({
	"_id" : String,
	"fullname" : String,
	"userid" : String,
	"departments" : {
			"_id":String,
			"deptname":String,
			"address":{
					"country":String,
					"state":String,
					"city":String,
					"zipcode":Number
			}
	},
	"post" : {
		"startdate" : Date,
		"enddate" : Date,
		"validupto" : String,
		"title" : String,
		"desc" : String,
		"published" : String,
		"createddate" : Date
	},
	"publishtracker" : [
		{
			"publisheddate" : Date
		}
	]
});


// Static Methods
PostSchema.statics.getAllPost = function(){
	var deferred = Q.defer();
    this.find({}, function(error, post){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(post);
    }).sort({"deptname":1});
    return deferred.promise;
};




module.exports = mongoose.model('post', PostSchema);
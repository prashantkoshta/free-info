var mongoose = require('mongoose');
var crypto   = require('crypto');
var Q = require("q");
var PostSchema = mongoose.Schema({
	"_id" :  { type: String, index: { unique: true } },
	"fullname" : String,
	"userid" : String,
	"createddate" :  {
            type: Date,
            default: Date.now
    },
	"departments" : {
			"_id":String,
			"deptname":{ type: String, index: true },
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
	},
	"publishreminder" : [
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
    }).sort({"departments.deptname":1});
    return deferred.promise;
};

PostSchema.statics.createPost = function(post){
	var deferred = Q.defer();
    post.save(function(error){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(post);
    });
    return deferred.promise;
};




module.exports = mongoose.model('post', PostSchema);
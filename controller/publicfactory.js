// load up the user model
var async    = require('async');
var config = require('../config/config');
var indexcounter  = require('../models/indexcounter');
var genrateKey = require('../config/genratekey');

var factory = function(){};

factory.prototype.deleteProjectTeamMember = function(data,user,done){
	async.waterfall([
		function(callback){
			/*Projects.findOne({"_id":data.projectid,"projectteam":{$elemMatch:{"userid":user._id,"projectrole" : "projectadmin"}}},{},function(err,project){
				if(err)throw err;
				if(!project) callback(new Error(true),"You are not Authenticated to update Team Details.",null);
				callback();
			}).sort({'projectname': 1});*/
		},
		function(callback){
			/*Projects.findOneAndUpdate({"_id": data.projectid},{$pull: {"projectteam":{"userid":data.userid,"projectrole":data.projectrole}}},
			{ multi: false },function(err, obj) {
				if(err) throw err;
				callback(null,obj);
			});*/
		}
	],function(err,data){
		if(err) return done(true,data,null);
		done(false,"",data);			
	});
	
};

factory.prototype.getBatchList = function(user,done){
	Batchs.find({},{buildtype:1,desc:1},function(err,batchList){
		if(err)throw err;
		done(false,"",batchList);
	}).sort({'desc': 1});
};

module.exports = factory;
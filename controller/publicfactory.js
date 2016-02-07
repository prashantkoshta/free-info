// load up the user model
var async    = require('async');
var config = require('../config/config');
var genrateKey = require('../config/genratekey');
var Department  = require('../models/department');
var Post  = require('../models/post');
var genrateKey = require('../config/genratekey');

var factory = function(){};

//Department
factory.prototype.getAllDepartment = function(done){
	Department.getAllDepartment()
	.then(function(result){done(false,"",result);})
	.catch(function(error){done(true,data,null);});
};

factory.prototype.addDepartment = function(data,done){
	async.waterfall([
	    function(callback){
			Department.getDepartmentByName(data.deptname)
				.then(function(result){
					if(!result) {
						callback();
					}else{
						callback(new Error(true),"Duplicate Entry",null);
					}
				})
				.catch(function(error){
					 callback(new Error(true),"",error);
				});
			
		},
		function(callback){
			genrateKey.genrateNewIndexId("dept",function(arg){
				callback(null,arg);
			});
		},
		function(deptId,callback){
				var d = new Department();
				d._id = deptId;
				d.deptname = data.deptname;
				Department.createDepartment(d)
				.then(function(result){callback(null,result);})
				.catch(function(error){
					callback(new Error(true),"",error);
				});
		}
	],function(err,data){
		if(err) done(true,data,null);
		done(false,"",data);
	});
	
	

};



// Posts
factory.prototype.getPost = function(done){
	Post.getAllPost()
	.then(function(result){done(false,"",result);})
	.catch(function(error){done(true,data,null);});
};

factory.prototype.createPost = function(data,done){
	async.waterfall([
		function(callback){
			genrateKey.genrateNewIndexId("post",function(arg){
				callback(null,arg);
			});
		},
		function(postid,callback){
				var p = new Post();
				p._id = postid;
				p.fullname = "Prashant K";
				p.userid = "prashantkoshta@gmail.com";
				p.departments = {
					"_id":data._id,
					"deptname" : data.deptname,
					"address":{
							"country": data.country,
							"state":data.state,
							"city":data.city,
							"zipcode":data.zipcode
					}
				},
				p.post = {
					"startdate" : data.startdate,
					"enddate" : new Date(data.enddate),
					"validupto" : data.validupto,
					"title" : data.title,
					"desc" : data.desc,
					"published" : "no"
				}
				Post.createPost(p)
				.then(function(result){callback(null,result);})
				.catch(function(error){
					callback(new Error(true),"",error);
				});
		}
	],function(err,data){
		if(err) done(true,data,null);
		done(false,"",data);
	});
};

module.exports = factory;
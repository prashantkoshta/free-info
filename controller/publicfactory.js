// load up the user model
var async    = require('async');
var config = require('../config/config');
var genrateKey = require('../config/genratekey');
var Department  = require('../models/department');
var genrateKey = require('../config/genratekey');

var factory = function(){};

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

module.exports = factory;
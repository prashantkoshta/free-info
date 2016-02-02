var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require("q");

var DepartmentSchema = mongoose.Schema({
	"_id" : String,
	'deptname' : String
});

// Static Methods
DepartmentSchema.statics.getAllDepartment = function(){
	var deferred = Q.defer();
    this.find({}, function(error, departments){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(departments);
    }).sort({"deptname":1});
    return deferred.promise;
};

DepartmentSchema.statics.getDepartmentByName = function(name){
	var deferred = Q.defer();
    this.findOne({"deptname":name}, function(error, departments){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(departments);
    });
    return deferred.promise;
};

DepartmentSchema.statics.getDepartmentById = function(id){
	var deferred = Q.defer();
    this.findOne({"_id":id}, function(error, departments){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(departments);
    });
    return deferred.promise;
};

DepartmentSchema.statics.createDepartment = function(department){
	var deferred = Q.defer();
    department.save(function(error){
        if (error) deferred.reject(new Error(error));
        else deferred.resolve(department);
    });
    return deferred.promise;
};

module.exports = mongoose.model('department', DepartmentSchema);
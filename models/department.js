var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var departmentSchema = mongoose.Schema({
	"deptid" : String,
	'deptname' : String
});
module.exports = mongoose.model('department', departmentSchema);
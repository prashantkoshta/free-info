var mongoose = require('mongoose');
var crypto   = require('crypto');
var viewerSchema = mongoose.Schema({
	"_id" : String,
	"vinkey" : String,
	"mobiletoken" : String,
	"address" : [{"country":String,"state":String,"city":String,"zipcode":Number}],
	"departments" : [{"_id":String,"deptname":String,"address":{"country":String,"state":String,"city":String,"zipcode":Number}}],
	"feedback" : [{"email":String,"date":{ type: Date, default: Date.now },"rating":Number,"desc":String}]
});






module.exports = mongoose.model('Viewer', viewerSchema);
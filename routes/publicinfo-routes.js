/**
 * New node file
 */
var express = require('express');
var config = require('../config/config');
var AppRule = require('../config/apprule-engine');
var AppGcm = require('../config/app-gcm');
var ReqJsonValidator = require('../src/validator/request-json-validator');
var AppServiceAccessValidator  = require('../src/validator/service-access-validator');
var PublicFactory = require('../controller/publicfactory');
/* GET users listing. */

var router = express.Router();
// Public view page
router.get('/sitemap', function(req, res) {
	res.render('public/sitemap.ejs');
});

router.get('/contactus', function(req, res) {
	res.render('public/contactus.ejs');
});

router.get('/termsconditions', function(req, res) {
	res.render('public/terms-coditions.ejs');
});

router.get('/faq', function(req, res) {
	res.render('public/faq.ejs');
});

router.get('/getDept', function (req, res) {
	var factory = new PublicFactory();
	factory.getAllDepartment(function(errorFlag,erroType,result){
		res.json({'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

router.post('/addDept', ReqJsonValidator.addDepartmentSchema, function (req, res) {
	var factory = new PublicFactory();
	factory.addDepartment(req.body,function(errorFlag,erroType,result){
		res.json({'error': errorFlag, 'errorType': erroType, "data": result});
	});
});


module.exports = router;
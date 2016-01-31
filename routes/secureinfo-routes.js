/**
 * New node file
 */
var express = require('express');
var config = require('../config/config');
var AppRule = require('../config/apprule-engine');
var AppGcm = require('../config/app-gcm');
var ReqJsonValidator = require('../src/validator/request-json-validator');
var AppServiceAccessValidator  = require('../src/validator/service-access-validator');
var SecureFactory = require('../controller/securefactory');

var router = express.Router();
/* GET users listing. */
router.get('/', AppRule.validateToken, function(req, res, next) {
	next();
});

router.post('/', AppRule.validateToken,function(req, res, next) {
	next();
});

router.post('/deleteProject', AppRule.validateToken, AppServiceAccessValidator.validateServiceAccess, ReqJsonValidator.deleteProjectSchema, function (req, res) {
	var factory = new SecureFactory();
	factory.deleteProject(req.body, req.user, function(errorFlag,erroType,result){
		res.json({ 'error': errorFlag, 'errorType': erroType, "data": result});
	});
});

module.exports = router;
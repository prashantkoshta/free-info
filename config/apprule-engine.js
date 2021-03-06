/**
 * Error Code for application
 */
'use strict';
var config = require('./config');
var jwt    = require('jsonwebtoken');
var User   = require('../models/user');
var ms = require('ms');
var AppRule = function(){ };

/*
AppRule.prototype.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
    res.end();
}*/

AppRule.prototype.getNewToken = function(user,res){
	var userInfo = {
        _id: user._id,
        role: user.role,
		tokencreatedtime:new Date()
    };
	var token = jwt.sign(userInfo,config.sessionSecret,{expiresIn:ms(1000 * 60 * 10)});
	return token;
}

AppRule.prototype.validateToken = function (req, res, next){
	var token = req.headers['token'] || req.body.token || req.query.token;
		 if (token) {
			jwt.verify(token,config.sessionSecret, function(err, decoded) {
			  if (err) {
				 if(err.name === "TokenExpiredError") return res.json({ 'auth-error': true, 'errorType': "Token has expired.", "data": null});
				 return res.json({ 'auth-error': true, 'errorType': "Failed to authenticate token.", "data": null});
			  } else {
				// if everything is good, save to request for use in other routes
				var new_decoded = jwt.decode(token,{complete: true});
				User.findOne({"_id":new_decoded.payload._id,"sessioninfo.islogin":1},function(err,user){
					if(err) throw err;
					if(!user) return res.json({ 'auth-error': true, 'errorType': 'Failed to authenticate token.',"data": null}); 
				    //if((new Date(user.lastlogouttime) > new Date(new_decoded.payload.tokencreatedtime))){
						//return res.json({ 'auth-error': true, 'errorType': 'Failed to authenticate token.',"data": null}); 
					//}
					req.user = user;
					var ntoken = new AppRule().getNewToken(user);
					res.setHeader("token", ntoken);
					return next();
					
				});
			  }
			});

		  } else {
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
		
		  }
}


AppRule.prototype.validateTokenBeforeOnPage = function (req, res, next){
	var token = req.headers['token'] || req.body.token || req.query.token;
		 if (token) {
			jwt.verify(token,config.sessionSecret, function(err, decoded) {
			  if (err) {
				 if(err.name === "TokenExpiredError") {
					 //return res.json({ 'auth-error': true, 'errorType': "Token has expired.", "data": null});
					 res.render('public/error.ejs');
				 }
					res.render('public/error.ejs');
				 //return res.json({ 'auth-error': true, 'errorType': "Failed to authenticate token.", "data": null});
			  } else {
				// if everything is good, save to request for use in other routes
				var new_decoded = jwt.decode(token,{complete: true});
				User.findOne({"_id":new_decoded.payload._id,"sessioninfo.islogin":1},function(err,user){
					if(err) throw err;
					if(!user) {
						return res.render('public/error.ejs');
						//return res.json({ 'auth-error': true, 'errorType': 'Failed to authenticate token.',"data": null}); 
					}
				    //if((new Date(user.lastlogouttime) > new Date(new_decoded.payload.tokencreatedtime))){
						//res.render('error.ejs');
						//return res.json({ 'auth-error': true, 'errorType': 'Failed to authenticate token.',"data": null}); 
					//}
					req.user = user;
					var ntoken = new AppRule().getNewToken(user);
					res.setHeader("token", ntoken);
					return next();
					
				});
			  }
			});

		  } else {
			 //throw error;
			res.render('public/error.ejs');
			/**/
		  }
}
module.exports = new AppRule();
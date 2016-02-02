// config/passport.js
var async            	= require('async');
// load all the things we need
var LocalStrategy       = require('passport-local').Strategy;
var User            = require('../models/user');
var indexcounter    = require('../models/indexcounter');

// load the auth variables
var configAuth = require('./config');
var genrateKey = require('./genratekey');
var errorMap = require('./errormap');



// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });





    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'loginid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, loginid, password,done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
	   if(configAuth.environment === "production"){
		   if(!req.validnocaptcha) { return done(null, false, req.flash = {'signupMessage': errorMap.getError("0001")});}
	   }
	  /* if(isNaN(loginid)){
		   // validate by emailid
	   }else{
		   // validate by phonenumber
	   }*/
       User.findOne({'email' : loginid},{'email':1,'password':1,'hash':1,'firstname':1,'middlename':1,'lastname':1,'role':1}, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash= {'signupMessage': errorMap.getError("0002")});
            } else {

                // if there is no user with that email
                // create the user
            	var newUser = new User();
            	var hash = newUser.generateHash();
            	var encryptedPwd = newUser.generatePassword(hash,password);
                // set the user's local credentials
                newUser.email    = email;
				newUser.fullname = req.body.firstname+" "+req.body.middlename+" "+req.body.lastname;
                newUser.firstname = req.body.firstname;
                newUser.middlename = req.body.middlename;
                newUser.lastname = req.body.lastname;
                newUser.hash = hash;
				newUser.authrizationstatus = "pending";
				newUser.status = "active";
                newUser.password = encryptedPwd;
                newUser.role = "user";
				
				
				async.waterfall([
					function(callback){
						var tid = genrateKey.genrateNewIndexId("userid",function(arg){
							callback(null,arg);
						});
					}
			    ],function(err,_id){
						newUser._id = _id;
						newUser.uinkey = 'uin_'+_id;
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
				});	

            }

        });

        });

    }));




    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'loginid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, loginid, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  loginid },{"auth_token":0}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash = {'loginMessage': errorMap.getError("0003")}); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password) && !user.validateAuthStatusAndStatus()){
                return done(null, false,req.flash = {'loginMessage': errorMap.getError("0004")}); // create the loginMessage and save it to session as flashdata
            }
			return done(null, user);
        });

    }));




};

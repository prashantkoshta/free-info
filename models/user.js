var mongoose = require('mongoose');
var crypto   = require('crypto');
// define the schema for our user model
var userSchema = mongoose.Schema({
	_id : String,
	uinkey : String,
	fullname : String,
	phonenumber: Number,
	email : String,
	department : {
		deptid : String,
		deptname : String,
		address	: {
			city : String,
			state : String,
			country : String,
			zipcode : String
		}
	},
	designation : String,
	password : String,
	hash : String,
	authrizationstatus : String,
	status : String,
	passcode : Number,
	mobiletoken : String,
	lastlogouttime : Date,
	sessioninfo:  {
				useragent : String,
				ip : String,
				islogin : Number
	},
	securityqustion : [{"question" :String,"answer" :String}],
	role : String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function() {
    var hash = this.getRandomPwd(8,'qwertyuiopasdfgsdfgsdfg@!hjklzxcv#%bnmQW121231ERTYUIOrtewrtsd$P34534ASDFGHJKLZX334543CVBNM12345*?67890');
	return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	var hash = crypto.createHmac("sha512",this.hash);
	hash.update(password);
	var val = hash.digest("base64");
	return (val === this.password) ? true : false;
};

userSchema.methods.generatePassword = function(ahash,password) {
	var hash = crypto.createHmac("sha512",ahash);
	hash.update(password);
	return hash.digest("base64");
};

userSchema.methods.getRandomPwd = function(n, a) {
  var index = (Math.random() * (a.length - 1)).toFixed(0);
  return n > 0 ? a[index] + this.getRandomPwd(n - 1, a) : '';
};

// checking if password is valid
userSchema.methods.validateAuthStatusAndStatus = function() {
	if(this.authrizationstatus === "approved" && this.status === "ative"){
		return true;
	}else{
		return false;
	}
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
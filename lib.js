var CryptoJS = CryptoJS || {};
var aes = CryptoJS.AES || {};
var sha256 = CryptoJS.SHA256 || {};

if (typeof(require) !== "undefined") {
    CryptoJS = require("crypto-js");
    aes = require("crypto-js/aes");
    sha256 = require("crypto-js/sha256");
}

var DEFAULT_HASH_ITERATIONS = 4000;

var SALT_SIZE = 192/8;

var KEY_SIZE = 768/32;

/**
 * Convenience wrapper around CryptoJS.lib.WordArray.random to grab a new salt value.
 * Treat this value as opaque, as it captures iterations.
 *
 * @param {number} explicitIterations An integer
 * @return {string} Return iterations and salt together as one string ({hex-iterations}.{base64-salt})
*/
function generateSalt(explicitIterations){
    var defaultHashIterations = DEFAULT_HASH_ITERATIONS;

    if(explicitIterations !== null && explicitIterations !== undefined){
        // make sure explicitIterations is an integer
        if( parseInt(explicitIterations, 10) === explicitIterations ){
            throw new Error("explicitIterations must be an integer");
        }
        // and that it is smaller than our default hash iterations
        if( explicitIterations < DEFAULT_HASH_ITERATIONS){
            throw new Error("explicitIterations cannot be less than " + DEFAULT_HASH_ITERATIONS);
        }
    }

    // get some random bytes
    var bytes = CryptoJS.lib.WordArray.random(SALT_SIZE);

    // convert iterations to Hexadecimal
    var iterations = (explicitIterations || defaultHashIterations).toString(16);

    // concat the iterations and random bytes together.
    return iterations + "." + bytes.toString(CryptoJS.enc.Base64);
}

function hashPassword(value, salt){
    var i = salt.indexOf(".");
    var iters = parseInt(salt.substring(0, i), 16);
    var key = CryptoJS.PBKDF2(value, salt, { "keySize": KEY_SIZE, "iterations": iters });

    return key.toString(CryptoJS.enc.Base64);
}

function checkPassword(candidate, salt, hashed){
    return hashPassword( candidate, salt ) === hashed;
}

function encryptString(inputString, password) {
  return aes.encrypt(inputString, password).toString();
}

function decryptString(inputString, password) {
  return aes.decrypt(inputString, password).toString(CryptoJS.enc.Utf8);
}

function hashString(inputString) {
  return sha256(inputString).toString();
}

function hmacString(inputString, password) {
  return CryptoJS.HmacSHA256(inputString, CryptoJS.SHA256(password)).toString();
}

/* Save BOTH the salt and the hashedPassword to your database so you can validate the password later */
//var salt = generateSalt();
//console.log("Salt is:", salt);
//var hashedPassword = hashPassword("password", salt);
//console.log("Hashed password is", hashedPassword);
//var isPassword = checkPassword("password", salt, hashedPassword); // true

if (typeof(exports) === "undefined") {
   window.lib = {
      generateSalt: generateSalt,
      hashPassword: hashPassword,
      checkPassword: checkPassword,
      encryptString: encryptString,
      decryptString: decryptString,
      hashString: hashString,
      hmacString: hmacString,
   };
} else {
   exports.generateSalt = generateSalt;
   exports.hashPassword = hashPassword;
   exports.checkPassword = checkPassword;
   exports.encryptString = encryptString;
   exports.decryptString = decryptString;
   exports.hashString = hashString;
   exports.hmacString = hmacString;
}

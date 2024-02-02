import config from 'config'
const crypto = require('crypto');

var Crypto = require('crypto'); // add / import crypto mdule
var secret_key = 'fd85b494-aaaa'; // define secret key
var secret_iv = 'smslt'; // define secret IV
var encryptionMethod = 'AES-256-CBC'; // this is our encryption method
var key = Crypto.createHash('sha512').update(secret_key, 'utf-8').digest('hex').substr(0, 32); // create key
var iv = Crypto.createHash('sha512').update(secret_iv, 'utf-8').digest('hex').substr(0, 16); // same create iv


export const encryptData = (otp) => {
    const message = otp.toString();
    const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    
    return encryptedData
}

export const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    return decryptedData
}
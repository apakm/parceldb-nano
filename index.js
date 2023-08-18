const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let encryptkey;
let initivector;

class ParcelTypeError extends TypeError {
    constructor(expectedType, actualType) {
        super('Expected type ' + expectedType + ' but got ' + actualType);
    }
}

function init(encryptionkey, iv) {
    initivector = iv;
    encryptkey = encryptionkey
}

async function newDoc(name, data, key) {
    key = encryptkey;
    
    if (!data) {
        throw new Error('No data provided');
    } else if (!name) {
        throw new Error('No name provided');
    } else if (typeof name !== 'string') {
        throw new ParcelTypeError('string', typeof name);
    } else if (typeof data !== 'object') {
        throw new ParcelTypeError('object', typeof data);
    }

    let iv = initivector;
    const encryptedData = {};

    for (const datakey in data) {
        if (data.hasOwnProperty(datakey)) {
            const value = data[datakey];
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encryptedValue = cipher.update(value.toString(), 'utf8', 'base64');
            encryptedValue += cipher.final('base64');
            encryptedData[datakey] = encryptedValue;
        }
    }

    fs.writeFileSync(path.join(__dirname, name + '.json'), JSON.stringify(encryptedData));
}


async function readDoc(name) {
    let key = encryptkey;

    try {
        if (!name) {
            throw new Error('No name provided');
        } else if (typeof name !== 'string') {
            throw new NanoTypeError('string', typeof name);
        }

        let data = fs.readFileSync(path.join(__dirname, name + '.json'), 'utf8');
        data = JSON.parse(data); // Parse the JSON string into an object

        const iv = initivector; // Use the same iv used for encryption
        const decrypted = {};

        for (const datakey in data) {
            if (data.hasOwnProperty(datakey)) {
                const encryptedValue = data[datakey];
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                let decryptedValue = decipher.update(encryptedValue, 'base64', 'utf8');
                decryptedValue += decipher.final('utf8');
                decrypted[datakey] = decryptedValue;
            }
        }

        return decrypted;

    } catch (err) {
        throw new Error(err.message)
    }
}


async function appendData(name, newData) {
    let encryptKey = encryptkey;
    let initIVector = initivector;
    if (!newData) {
        throw new Error('No data provided');
    } else if (!name) {
        throw new Error('No name provided');
    } else if (typeof name !== 'string') {
        throw new Error('Name must be a string');
    } else if (typeof newData !== 'object') {
        throw new Error('New data must be an object');
    }

    // Read the existing encrypted JSON file
    let encryptedData = {};
    try {
        const existingData = fs.readFileSync(path.join(__dirname, name + '.json'), 'utf8');
        encryptedData = JSON.parse(existingData);
    } catch (error) {
        // File might not exist yet, that's okay
    }

    // Encrypt and append new data
    const iv = initIVector;
    for (const dataKey in newData) {
        if (newData.hasOwnProperty(dataKey)) {
            const value = newData[dataKey];
            const cipher = crypto.createCipheriv('aes-256-cbc', encryptKey, iv);
            let encryptedValue = cipher.update(value.toString(), 'utf8', 'base64');
            encryptedValue += cipher.final('base64');
            encryptedData[dataKey] = encryptedValue;
        }
    }

    // Write the updated encrypted JSON back to the file
    fs.writeFileSync(path.join(__dirname, name + '.json'), JSON.stringify(encryptedData));
}

async function find(name, field ) {
    try {
        const document = name + '.json';
        let key = encryptkey;
        let iv = initivector;
        let lookfor = field;
        let data = fs.readFileSync(path.join(__dirname, document), 'utf8');
        data = JSON.parse(data); // Parse the JSON string into an object
        const decrypted = {};

        if (!name) {
            throw new Error('No name provided');
        } else if (typeof name !== 'string') {
            throw new ParcelTypeError('string', typeof name);
        }

        for (const datakey in data) {
            if (data.hasOwnProperty(datakey)) {
                const encryptedValue = data[datakey];
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                let decryptedValue = decipher.update(encryptedValue, 'base64', 'utf8');
                decryptedValue += decipher.final('utf8');
                decrypted[datakey] = decryptedValue;
            }
        }

        // get field value
        for (const datakey in decrypted) {
            if (decrypted.hasOwnProperty(datakey)) {
                if (datakey === lookfor) {
                    return decrypted[datakey]
                }
            }
        }

        return null
    } catch (e) { throw new Error(e.message) }

}

module.exports = {
    init,
    newDoc,
    readDoc
}
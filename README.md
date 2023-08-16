# parceldb-nano

## About
parceldb-nano is an extremely lightweight document oriented json database. It literally has three methods: 
| Method Name | Description | arguments |
| ----------- | ----------- | ----------- |
| init | init will initialize your database by providing encryption keys. | encryption_key initialization_vector |
| newDoc | newDoc will create a new encrypted json document | name data |
| readDoc | readDoc will decrypt the contents of a document and return them | name |

## Usage
nanodb is extremely easy to use, just import it into your code, and run on of the methods.
Here's the recommended way of creating your encryption key and initialization vector.
```
{
    // Encryption key creation
    const base64key = crypto.randomBytes(32).toString('base64');
    fs.writeFileSync('.env', `ENCRYPTION_KEY_BASE64=${base64key}\n`);

    // Initialization vector creation
    const base64iv = crypto.randomBytes(16).toString('base64');
    fs.writeFileSync('.env', `INITIALIZATION_VECTOR_BASE64=${base64key}\n`);
}
``` 

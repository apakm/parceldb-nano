# nanodb

## About
nanodb is an extremely lightweight document oriented json database. It literally has three methods: 
| Method Name | Description | arguments |
| ----------- | ----------- | ----------- |
| init | init will initialize your database by providing encryption keys. | encryption_key, initialization_vector |
| newDoc | newDoc will create a new encrypted json document | name, data |
| readDoc | readDoc will decrypt the contents of a document and return them | name |

## Usage
nanodb is extremely easy to use, just import it into your code, and run on of the methods.

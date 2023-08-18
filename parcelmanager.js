const fs = require('fs');

class ParcelInvalidFormatError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParcelInvalidFormatError';
    }
}

function parseParcel(path) {
    const docs = []
    let doc = {}
    let lines = fs.readFileSync(path, 'utf8').split('\n')

    lines.forEach(function (line) {
        line = line.trim()
        if (line.startsWith('-- newParcel')) {
            doc = {}
        } else if (line === '-- end') {
            if (Object.keys(doc).length > 0) {
                docs.push(doc)
            }
            doc = {}
        } else {
            const parts = line.split(':');
            if (parts.length === 2) {
                const key = parts[0].trim();
                let value = parts[1].trim();

                // array
                if (value.startsWith('<') && value.endsWith('>') && !value.includes(':')) {
                    // array
                    value = value.substring(1, value.length - 1)
                    doc[key] = value.split(',')
                }
                if (value.includes(';;')) {
                    if (value.includes('int')) {
                        let parsable = value.replace('int;;', '').trim();
                        value = parseInt(parsable)
                    } else if (value.includes('double')) {
                        let parsable = value.replace('double;;', '').trim();
                        value = parseFloat(parsable)
                    } else if (value.includes('bool')) {
                        let parsable = value.replace('bool;;', '').trim();
                        value = parsable === 'true'
                    }
                }




                doc[key] = value;
            } else {

            }

        }
    })

    return docs
}

const filepath = './doc.parcel';
const parsedDocs = parseParcel(filepath)
console.log(parsedDocs)
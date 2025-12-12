import { PDFDocument } from 'pdf-lib';

async function testencryption() {
    try {
        const doc = await PDFDocument.create();
        if (typeof doc.encrypt === 'function') {
            console.log('Encrypt method exists!');
        } else {
            console.log('Encrypt method does NOT exist!');
            console.log('Available methods:', Object.keys(doc));
            console.log('Available methods (proto):', Object.keys(Object.getPrototypeOf(doc)));
        }
    } catch (e) {
        console.error(e);
    }
}

testencryption();

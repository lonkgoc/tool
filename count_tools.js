import fs from 'fs';

const content = fs.readFileSync('src/data/tools.ts', 'utf8');
const count = (content.match(/id:\s*"[^"]+"/g) || []).length;
fs.writeFileSync('count_output.txt', `Total tools: ${count}`);

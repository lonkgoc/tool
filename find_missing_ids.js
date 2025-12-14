import fs from 'fs';

const content = fs.readFileSync('src/data/tools.ts', 'utf8');
const idMatches = content.match(/id:\s*"(\d+)"/g);
const ids = idMatches ? idMatches.map(m => parseInt(m.match(/"(\d+)"/)[1])) : [];
const sortedIds = ids.sort((a, b) => a - b);

const maxId = sortedIds[sortedIds.length - 1];
const missingIds = [];
for (let i = 1; i <= 266; i++) {
    if (!ids.includes(i)) {
        missingIds.push(i);
    }
}

const result = {
    maxId,
    totalCount: ids.length,
    missingIds
};

fs.writeFileSync('missing_ids.json', JSON.stringify(result, null, 2));

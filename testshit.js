const fs = require('fs');
const yamlFront = require('yaml-front-matter');
const content = fs.readFileSync('./drafts/sample_draft_post.md');
const input = `
---
name: Derek Worthen
age: young
contact:
 email: hrishikesh@domain.com
 address: some location
pets:
 - cat
 - dog
 - bat
match: !!js/regexp /pattern/gim
run: !!js/function function() { }
---
Some Other content
`;
console.log(JSON.stringify(yamlFront.loadFront(content),null,2));

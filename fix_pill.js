const fs = require('fs');
const file = 'c:\\Users\\MR.VISHNU\\OneDrive\\Desktop\\boba-bliss\\menu.html';
let content = fs.readFileSync(file, 'utf-8');

// Remove transform from .filter-pill.active
content = content.replace(
  '.filter-pill.active { background: var(--ink); color: #fff; border-color: var(--ink); transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }',
  '.filter-pill.active { background: var(--ink); color: #fff; border-color: var(--ink); box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }' // Optional: changed to inset shadow to look pressed instead of floating
);

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed pill height');

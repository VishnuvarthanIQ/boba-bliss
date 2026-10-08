const fs = require('fs');
const file = 'c:\\Users\\MR.VISHNU\\OneDrive\\Desktop\\boba-bliss\\index2.html';
let content = fs.readFileSync(file, 'utf-8');

// Fix the ? icons in the trust bar
content = content.replace(/<div style="font-size: 2.2rem; margin-bottom: 12px; color: var\(--accent\);">\?<\/div>/, '<div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--accent);"><i class="fa-solid fa-leaf"></i></div>');
content = content.replace(/<div style="font-size: 2.2rem; margin-bottom: 12px; color: var\(--accent\);">\?<\/div>/, '<div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--accent);"><i class="fa-solid fa-mug-hot"></i></div>');
content = content.replace(/<div style="font-size: 2.2rem; margin-bottom: 12px; color: var\(--accent\);">\?<\/div>/, '<div style="font-size: 2.2rem; margin-bottom: 12px; color: var(--accent);"><i class="fa-solid fa-sliders"></i></div>');

// Fix the ? checkmarks
content = content.replace(/<span style="color: var\(--accent\); font-weight: bold;">\?<\/span>/g, '<span style="color: var(--accent); font-weight: bold;"><i class="fa-solid fa-check"></i></span>');

// Fix the ? currency symbols
// Actually, I can just replace `,1` with `$` or `?` (rupee). The original used `?`. Since encoding is tricky, I'll use `&#8377;`
content = content.replace(/,1/g, '&#8377;');

// Fix the hero buttons so they pop perfectly over the image
const btnPrimaryTarget = `<a href="menu.html" class="btn btn-primary" style="padding: 16px 36px; font-size: 1.05rem;">Explore Menu</a>`;
const btnPrimaryReplacement = `<a href="menu.html" class="btn" style="padding: 16px 36px; font-size: 1.05rem; background: #C1793B; color: #fff; border: 2px solid #C1793B;">Explore Menu</a>`;
content = content.replace(btnPrimaryTarget, btnPrimaryReplacement);

const btnOutlineTarget = `<a href="customize.html" class="btn btn-outline" style="padding: 16px 36px; font-size: 1.05rem; background: transparent;">Build Your Drink</a>`;
const btnOutlineReplacement = `<a href="customize.html" class="btn" style="padding: 16px 36px; font-size: 1.05rem; background: transparent; color: #fff; border: 2px solid #fff;">Build Your Drink</a>`;
content = content.replace(btnOutlineTarget, btnOutlineReplacement);

// Make sure the typography of the hero has strong white color so it doesn't inherit dark color in light mode
content = content.replace('<h1 style="font-size: clamp(3rem, 6vw, 4.5rem); margin: 20px auto; max-width: 14ch; line-height: 1.05;">', '<h1 style="font-size: clamp(3rem, 6vw, 4.5rem); margin: 20px auto; max-width: 14ch; line-height: 1.05; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">');
content = content.replace('<p style="color: var(--text-soft); font-size: 1.15rem; max-width: 45ch; margin: 0 auto 32px auto;">', '<p style="color: rgba(255,255,255,0.9); text-shadow: 0 1px 3px rgba(0,0,0,0.5); font-size: 1.15rem; max-width: 45ch; margin: 0 auto 32px auto;">');
content = content.replace('<p class="eyebrow" style="justify-content: center; font-size: 1.1rem; letter-spacing: 0.15em;">', '<p class="eyebrow" style="justify-content: center; font-size: 1.1rem; letter-spacing: 0.15em; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">');

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed index2 styles and icons.');

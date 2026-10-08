const fs = require('fs');
const file = 'c:\\Users\\MR.VISHNU\\OneDrive\\Desktop\\boba-bliss\\blog.html';
let content = fs.readFileSync(file, 'utf-8');

// The block to move starts with <div style="margin-top: 32px; text-align: left; background: var(--bg-raised);
// and ends 23 lines later (up to </div> </div> </section>).
// Let's use string manipulation to carefully move it.

const startDiv = '<div style="margin-top: 32px; text-align: left; background: var(--bg-raised); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">';
const endDiv = '</div>\r\n  </div>\r\n</section>'; // This is the end of the page-hero section container

const index = content.indexOf(startDiv);
if (index !== -1) {
  // Extract everything from startDiv to the closing of the section
  // Wait, let's just do regex replacing to be clean.
}

const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'app');
const dest = path.join(base, '(storefront)');

if (!fs.existsSync(dest)) fs.mkdirSync(dest);

const foldersToMove = [
  '(auth)', 'account', 'category', 'checkout', 'product', 'cart', 'contact', 'search', 'shop', 'track-order', 'page.tsx'
];

for (const f of foldersToMove) {
  const src = path.join(base, f);
  const dst = path.join(dest, f);
  if (fs.existsSync(src)) {
    try {
      fs.renameSync(src, dst);
      console.log('Moved', f);
    } catch (e) {
      console.log('Failed to move', f, e.message);
    }
  } else {
    console.log('Does not exist:', f);
  }
}

const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'app/about/page.tsx', title: 'About Us' },
  { path: 'app/contact/page.tsx', title: 'Contact Us' },
  { path: 'app/privacy-policy/page.tsx', title: 'Privacy Policy' },
  { path: 'app/terms-conditions/page.tsx', title: 'Terms & Conditions' },
  { path: 'app/returns/page.tsx', title: 'Returns' },
  { path: 'app/track-order/page.tsx', title: 'Track Order' },
  { path: 'app/sale/page.tsx', title: 'Sale' }
];

pages.forEach(page => {
  const fullPath = path.join(__dirname, page.path);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('export const metadata')) {
      const metadata = `export const metadata = {\n  title: "${page.title} - Laural Clothing",\n  description: "${page.title} page for Laural Clothing."\n};\n\n`;
      // Insert after imports if possible, or at the top
      if (content.startsWith('import')) {
        const lines = content.split('\n');
        const lastImportIndex = lines.findLastIndex(line => line.startsWith('import'));
        lines.splice(lastImportIndex + 1, 0, '\n' + metadata);
        content = lines.join('\n');
      } else {
        content = metadata + content;
      }
      fs.writeFileSync(fullPath, content);
      console.log(`Added metadata to ${page.path}`);
    }
  }
});

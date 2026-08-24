const https = require('https');

https.get('https://laural-clothing-api-production.up.railway.app/api/v1/categories', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const categories = JSON.parse(data).data;
    const firstUrl = categories.find(c => c.imageUrl && c.imageUrl.includes('t3.storageapi.dev')).imageUrl;
    console.log("Original URL:", firstUrl);
    
    const encodedUrl = encodeURIComponent(firstUrl);
    const nextUrl = `https://laural-clothing-frontend-production.up.railway.app/_next/image?url=${encodedUrl}&w=1080&q=75`;
    console.log("Next.js URL:", nextUrl);
    
    https.get(nextUrl, (res2) => {
      console.log("Next.js Status:", res2.statusCode);
      res2.on('data', () => {}); // consume
    });
  });
});

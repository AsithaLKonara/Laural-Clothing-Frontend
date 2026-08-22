const dotenv = require('dotenv');
const fs = require('fs');
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
console.log(envConfig.NEXT_PUBLIC_API_URL);

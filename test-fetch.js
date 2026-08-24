const axios = require('axios');
axios.get('http://localhost:5000/api/v1/products')
  .then(res => console.log('Products:', res.data.data.length))
  .catch(err => console.error('Products Error:', err.message));

axios.get('http://localhost:5000/api/v1/categories')
  .then(res => console.log('Categories:', res.data.data.length))
  .catch(err => console.error('Categories Error:', err.message));

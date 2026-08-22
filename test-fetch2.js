const axios = require('axios');
axios.get('http://localhost:5000/api/v1/products?skip=0&take=12')
  .then(res => console.log('Products:', res.data.data.length))
  .catch(err => console.error('Products Error:', err.message));

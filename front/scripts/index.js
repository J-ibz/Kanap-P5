import Product from './Classes/Product.js'

fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
        data.forEach(el => {
            const product = new Product(el);
            document.getElementById('items').append(product.element)
        });
    });

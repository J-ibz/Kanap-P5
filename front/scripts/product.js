import Product from './Classes/Product.js';

//get the search parameter in the url
const searchParams = new URLSearchParams(window.location.search).get('id');

//fetch the product with the id
fetch('http://localhost:3000/api/products/' + searchParams)
    .then(res => res.json())
    .then(data => {
        //render html elements
        const product = new Product(data);
        document.querySelector('.item__img').append(product.htmlImg);
        title.textContent = product.name; // Syntactic sugar for document.getElementById('title').textContent == product.name
        description.textContent = product.description;
        price.textContent = product.price;
        product.htmlOptions.forEach(el => colors.append(el));

        addToCart.addEventListener('click', (e) => {
            //display err on inputs
            colors.reportValidity();
            quantity.reportValidity();
            //check validity & push item in cart
            if (colors.value && quantity.value > 0) {
                const item = {
                    _id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    altText: product.altTxt,
                    price: product.price,
                    qty: quantity.valueAsNumber,
                    selectedColor: colors.value,
                };
                //check if Cart already exists in localStorage, if not, create empty arr
                let cart = JSON.parse(localStorage.getItem('Cart'));
                if (!cart) cart = [];
                let duplicate = false;
                cart.forEach(el => {
                    if (el._id == item._id && el.selectedColor == item.selectedColor) {
                        el.qty += item.qty;
                        localStorage.setItem('Cart', JSON.stringify(cart));
                        duplicate = true;
                    }
                });
                if (!duplicate) {
                    cart.push(item);
                    localStorage.setItem('Cart', JSON.stringify(cart));
                }

                function createHtmlToast() {
                    const toast = document.createElement('div');
                    toast.id = 'toast';
                    toast.textContent = 'Article(s) ajouté au panier';
                    document.querySelector('.item__content__addButton').append(toast);
                    setInterval(() => {
                        toast.remove();
                    }, 1500);
                }
                if (document.getElementById('toast')) {
                    document.getElementById('toast').remove();
                    setTimeout(() => {
                        createHtmlToast();
                    }, 50);
                } else createHtmlToast();
            }
        });
    });

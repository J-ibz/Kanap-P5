import Product from './Classes/Product.js';

if (localStorage.getItem('Cart')) {
    //get Cart from localstorage
    const cart = JSON.parse(localStorage.getItem('Cart'));

    //render html elements
    cart.forEach((el) => {
        const product = new Product(el);
        cart__items.append(product.elementInCart);
    });

    //render totals on load of page
    function renderTotals() {
        totalQuantity.textContent = Product.calcTotalQty();
        totalPrice.textContent = Product.calcTotalPrice();
    }

    renderTotals();

    function updateLocalStorage(action, itemID, qty) {
        const itemInCart = cart.find(el => el._id == itemID);
        if (action === 'update') itemInCart.qty = qty;
        if (action === 'delete') cart.splice(cart.indexOf(itemInCart), 1);
        localStorage.setItem('Cart', JSON.stringify(cart));
    }

    cart__items.addEventListener('input', e => {
        if (e.target.classList.contains('itemQuantity')) {
            //target the product in our list of products
            const id = e.target.closest('.cart__item').dataset.id;
            const product = Product.Get(id);
            //update DOM
            const newQty = e.target.valueAsNumber;
            product.qty = newQty;
            e.target.previousElementSibling.textContent = 'Qté : ' + newQty;
            renderTotals();
            //update item in localstorage
            updateLocalStorage('update', id, newQty);
        }
    });

    document.querySelector('.cart').addEventListener('click', e => {
        if (e.target.classList.contains('deleteItem')) {
            const id = e.target.closest('.cart__item').dataset.id;
            const product = Product.Get(id);
            product.Destroy();
            renderTotals();
            updateLocalStorage('delete', id);
        }

        if (e.target.id === 'order') {
            e.preventDefault();
            if (cart__order__form.reportValidity() && cart.length > 0) {
                const order = {
                    contact: {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        address: address.value,
                        city: city.value,
                        email: email.value,
                    },
                    products: cart.map((el) => el._id),
                };

                const options = {
                    method: 'POST',
                    body: JSON.stringify(order),
                    headers: { 'Content-Type': 'application/json' },
                };

                fetch('http://localhost:3000/api/products/order', options)
                    .then((res) => res.json())
                    .then((data) => {
                        window.location.href = 'http://localhost:5500/front/html/confirmation.html?id=' + data.orderId;
                        localStorage.removeItem('Cart');
                    });
            } else if (cart__order__form.reportValidity() && cart.length < 1){
                function createHtmlToast() {
                    const toast = document.createElement('div');
                    toast.id = 'toast-err';
                    toast.textContent = 'Panier vide !';
                    document.querySelector('.cart__order__form__submit').append(toast);
                    setInterval(() => {
                        toast.remove();
                    }, 1500);
                }
                if (document.getElementById('toast-err')) {
                    document.getElementById('toast-err').remove();
                    setTimeout(() => {
                        createHtmlToast();
                    }, 50);
                } else createHtmlToast();
            }
        }
    });
}

// * Expects request to contain:
// * contact: {
// *   firstName: string,
// *   lastName: string,
// *   address: string,
// *   city: string,
// *   email: string
// * }
// * products: [string] <-- array of product _id

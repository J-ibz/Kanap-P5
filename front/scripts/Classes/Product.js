export default class Product {
    static List = [];

    constructor(data) {
        this.name = data.name;
        this.price = Number(data.price);
        this.id = data._id;
        this.colors = data.colors;
        this.selectedColor = data.selectedColor;
        this.qty = Number(data.qty);
        this.altTxt = data.altTxt;
        this.description = data.description;
        this.imageUrl = data.imageUrl;
        this.createElement();
        Product.List.push(this);
    }

    static Get(id) {
        return this.List.find((product) => product.id == id);
    }

    createElement() {
        this.element = document.createElement('a');
        this.element.href = './product.html?id=' + this.id;

        this.htmlArticle = document.createElement('article');

        this.htmlImg = document.createElement('img');
        this.htmlImg.src = this.imageUrl;
        this.htmlImg.alt = this.altTxt;

        this.htmlName = document.createElement('h3');
        this.htmlName.classList.add('productName');
        this.htmlName.textContent = this.name;

        this.htmlDesc = document.createElement('p');
        this.htmlDesc.classList.add('productDescription');
        this.htmlDesc.textContent = this.description;

        this.htmlOptions = [];
        if (this.colors) {
            this.colors.forEach((color) => {
                let option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                this.htmlOptions.push(option);
            });
        }

        this.htmlArticle.append(this.htmlImg, this.htmlName, this.htmlDesc);
        this.element.append(this.htmlArticle);

        //i'm lazy to write this down with createElement()
        this.elementInCart = document.createElement('article');
        this.elementInCart.dataset.id = this.id;
        this.elementInCart.classList.add('cart__item')
        this.elementInCart.innerHTML = `                
        <div class="cart__item__img">
            <img src="${this.imageUrl}" alt="${this.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${this.name}</h2>
                <p>${this.selectedColor}</p>
                <p>${this.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p class="cart__item__qty">Qté : ${this.qty}</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${this.qty}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
        `;
    }

    static calcTotalQty() {
        const total = this.List.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.qty;
        }, 0);
        return total
    }

    static calcTotalPrice() {
        let total = 0
        this.List.forEach(el => {
            const qty = el.qty;
            const price = el.price;
            total += qty * price;
        })
        return total
    }

    Destroy () {
        Product.List.splice(Product.List.indexOf(this), 1);
        if (this.elementInCart) this.elementInCart.remove();
    }
}

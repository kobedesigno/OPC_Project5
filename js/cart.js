// Récupération sous forme de variable des données du localStorage sous une forme directement utilisable pour le code
let productNumbers = parseInt(localStorage.getItem('cartNumbers'));
let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
let cartCost = parseInt(localStorage.getItem("totalCost"));

// Fonction qui va dans le cas d'un panier vide, afficher la section caché et enlevé le formulaire et le panier
function emptyCart() {
    if (cartCost === 0 || cartCost === NaN || cartCost === undefined || localStorage.getItem("totalCost") === null) {
        const productPage = document.getElementById('productPage');
        productPage.setAttribute('hidden', true);
        const emptyCart = document.getElementById('emptyCart');
        emptyCart.removeAttribute('hidden');
    }
}

// permet de mettre à jour l'icone cart du header même au refresh de la page
function onLoadCartNumbers() {
    if (productNumbers) {
        document.querySelector('.cart .product-numbers').textContent = productNumbers;
    } else {
        document.querySelector('.cart .product-numbers').textContent = '';
    }
}

function updateTotalCost() { // Fonction qui va mettre à jour le prix Total du panier et l'afficher
    const TotalPrice = document.getElementById('totalPrice');
    TotalPrice.textContent = 'Prix total: $' + (cartCost / 100).toFixed(2);
};

function displayCart() { // Récuperer les données du localStorage pour les afficher
    const productContainer = document.getElementById("poduct-table-container");
    if (cartItems && productContainer) {
        productContainer.textContent = '';
        Object.values(cartItems).map(camerasData => {
            productContainer.innerHTML += `
            <tr>
                <td><img class="product-cart" src="${camerasData.imageUrl}" alt="product">${camerasData.name}</td>
                <td>$${(camerasData.price / 100).toFixed(2)}</td>
                <td>
                    <button id="${camerasData.name}-minus" class="btn minus-btn btn-info btn-lg" type="button">-</button>
                    ${camerasData.inCart}
                    <button id="${camerasData.name}-plus" class="btn plus-btn btn-info btn-lg" type="button">+</button>  
                </td>
                <td>$${((camerasData.price / 100) * camerasData.inCart).toFixed(2)}</td>
                <td>
                    <button id="${camerasData.name}-delete"  class="btn btn-lg btn-danger">Supprimer 
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                    </button>
                </td>
            </tr>
            `
        });
    }
}
displayCart();

document.addEventListener('click', function (e) { // Event sur ce que l'on click
    let array = e.target['id'].split('-'); // tableau de l'id séparer par le -
    let camerasData = array[0]; // variable camerasData va nous donner le nom du produit de l'objet clické
    let cameraOption = array[1]; // variable cameraOption va nous donner le nom du button (plus, minus ou delete)
    if (cameraOption === "minus" || cameraOption === "plus" || cameraOption === "delete") {
        option(camerasData, cameraOption)
        onLoadCartNumbers();
        updateTotalCost();
        emptyCart()
    }
}, false);

function option(camerasData, cameraOption) { // Ensemble de fonction appelé lors du click sur un button
    console.log(camerasData);
    cartNumbers(camerasData, cameraOption);
    totalCost(camerasData, cameraOption);
    removeProduct(camerasData, cameraOption);
    displayCart(camerasData, cameraOption);
}

function cartNumbers(camerasData, cameraOption) { // valeur de la clé(cartNumbers) du localStorage, du produit séléctionné (clické (btn supprimer))
    console.log(cameraOption)
    if (cameraOption === 'minus') {
        cartItems[camerasData].inCart -= 1;
        productNumbers -= 1;
    } else if (cameraOption === 'plus') {
        cartItems[camerasData].inCart += 1;
        productNumbers += 1;
    } else if (cameraOption === 'delete') {
        let deleteCartNumbers = cartItems[camerasData].inCart;
        productNumbers -= deleteCartNumbers;
    }
    console.log(productNumbers);
    if (productNumbers !== 0) {
        localStorage.setItem('cartNumbers', productNumbers);
        document.querySelector('.cart .product-numbers').textContent = productNumbers;
    } else {
        localStorage.setItem('cartNumbers', 0);
        document.querySelector('.cart .product-numbers').textContent = 0;
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
}

function totalCost(camerasData, cameraOption) { //valeur de la clé(totalCost) dans le localStorage, du produit séléctionné (clické (btn supprimer)) 
    if (cameraOption === 'minus') {
        let cartItemsPrice = cartItems[camerasData].price;
        cartCost -= cartItemsPrice;
    } else if (cameraOption === 'plus') {
        let cartItemsPrice = cartItems[camerasData].price;
        cartCost += cartItemsPrice;
    } else if (cameraOption === 'delete') {
        let cartItemsPrice = cartItems[camerasData].inCart * cartItems[camerasData].price;
        cartCost -= cartItemsPrice;
    }
    console.log("My cartCost is ", cartCost);
    console.log(typeof cartCost); // à la sortie d'un local storage c'est une string, il faut le convertir
    if (cartCost != null) {
        localStorage.setItem('totalCost', cartCost);
    } else {
        localStorage.setItem("totalCost", 0);
    }
}

function removeProduct(camerasData, cameraOption) { // Delete le produit dans le localStorage
    if (cameraOption === 'minus') {
        if (cartItems[camerasData].inCart === 0) {
            delete cartItems[camerasData];
        }
    } else if (cameraOption === 'delete') {
        delete cartItems[camerasData];
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

onLoadCartNumbers();
updateTotalCost();
emptyCart();

// FORMS

// Validation du formulaire

const inputs = document.querySelectorAll("input")
const textarea = document.querySelectorAll("textarea")

const checkValidity = (input) => {
    // Pour l'invalidation des input, ajout de la class error
    input.addEventListener('invalid', (e) => {
        e.preventDefault()
        if (!e.target.validity.valid) {
            e.target.parentElement.classList.add('error')
        }
    })
    // Pour la validation des input, on enléve la class error
    input.addEventListener('input', (e) => {
        if (e.target.validity.valid) {
            e.target.parentElement.classList.remove('error')
        }
    })
}
// Fait des tableaux de input et textarea pour pouvoir y soumettre la fonction checkValidity à chaque élément
Array.from(inputs).forEach(checkValidity);
Array.from(textarea).forEach(checkValidity);

// ENVOIS DU FORMULAIRE 



// var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const form = document.querySelector('form');
// lors de l'envois du formulaire
form.addEventListener('submit', async function (e) {
    const lastName = document.getElementById('last_name');
    const firstName = document.getElementById('first_name');
    const adress = document.getElementById('adress');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
    const button = form.querySelector('button[type=submit]');
    // bouton submit rendu non accéssible et remplacer par chargement
    button.disable = true;
    button.textContent = 'Chargement...';
    let errorElements = form.querySelectorAll('has-error');
    // on recherche les élements ayant la class boostrap has-error pour les enlever
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].classList.remove('has-error');
        // On remove aussi l'élément parent de l'élément avec la class help-block
        let span = errorElement[i].querySelector('.help-block');
        if (span) {
            span.parentElement.removeChild(span);
        }
    }
    // Eviter le comportement par défaut = Evite au formulaire de se soumettre correctement
    e.preventDefault();
    // Tableau des id des produits du panier
    let dataProduct = [];
    let table = Object.entries(cartItems);
    console.log(table);
    for (value of table) {
        for (let i = 0; i < value[1].inCart; i++) {
            dataProduct.push(value[1]._id);
        }
    }
    console.log(dataProduct)
    const Data = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: adress.value,
            city: city.value,
            email: email.value
        },
        products: dataProduct
    };
    const theData = JSON.stringify(Data);
    const myInit = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: theData
    };
    try { // on POST le formulaire à l'url de l'action définit dans la page HTML
        let response = await fetch('http://localhost:3000/api/cameras/order', myInit);
        let responseData = await response.json();
        if (response.ok === false) { // on fait un tableau des différentes erreurs de la responseData
            let errors = responseData;
            let errorsKey = Object.keys(errors);
            // pour les erreurs on les affiche dans le input
            for (let i = 0; i < errorsKey.length; i++) {
                let key = errorsKey[i];
                let error = errorsKey[key];
                let input = document.querySelector('[name=' + key + ']');
                let span = document.createElement('span');
                span.className = 'help-block';
                span.innerHTML = error;
                input.parentNode.classList.add('has-error');
                input.parentNode.appendChild(span);
            }
        } else {
            console.log(responseData);
            const panier = document.getElementById('productPage');
            panier.textContent = "";
            const confirmationPage = document.getElementById('confirmation');
            confirmationPage.removeAttribute('hidden');
            const idOrder = responseData.orderId;
            const name = responseData.contact.firstName
            console.log(idOrder);
            console.log(name);
            console.log(cartCost);
            // Affichage de la commande
            document.querySelector('.Ncommande').textContent += idOrder;
            document.querySelector('.prenom').textContent += name;
            document.querySelector('.prixTotal').textContent += (cartCost/100).toFixed(2);
            // Suppression du localStorage apès la commande et mis a jour de l'icone cart du header
            localStorage.removeItem('cartNumbers');
            localStorage.removeItem('productsInCart', );
            localStorage.removeItem('totalCost');
            document.querySelector('.cart .product-numbers').textContent = ''
        }
    } catch (e) {
        alert(e);
    }
})
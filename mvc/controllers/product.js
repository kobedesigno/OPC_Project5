// Récupération de l'url id produit sur lequel on a clické pour l'appel de l'api
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('product_id');
console.log(product);
const api = "http://localhost:3000/api/cameras/" + product;
console.log(api);

const getCameras = async function () { // fonction qui affiche le produit
    try {
        let response = await fetch(api)
        if (response.ok) {
            let camerasData = await response.json();

            // UTILISTION DU DOM :
            let cameras = document.getElementById('cameras');
            let image = document.createElement('img');
            cameras.appendChild(image);
            image.src = camerasData.imageUrl;
            image.classList.add('product-image');

            let name = document.createElement('div');
            let cameraName = document.createTextNode(camerasData.name);
            name.appendChild(cameraName);
            cameras.appendChild(name);
            name.classList.add('product-name');

            let description = document.createElement('div');
            let cameraDescription = document.createTextNode(camerasData.description);
            description.appendChild(cameraDescription);
            cameras.appendChild(description);
            description.classList.add('product-description');

            let price = document.createElement('div');
            let cameraPrice = document.createTextNode('$ ' + camerasData.price);
            price.appendChild(cameraPrice);
            cameras.appendChild(price);
            price.classList.add('product-price');

            let lensesText = document.createTextNode('Selectionnez votre taille d\'appareil :  ')
            cameras.appendChild(lensesText);
            let lenses = document.createElement('select');
            for (let i = 0; i < camerasData.lenses.length; i++) { // Ajout dynamique des différentes lenses
                let lensesMesure = document.createTextNode(camerasData.lenses[i]);
                let selectLenses = document.createElement('option');
                lenses.appendChild(selectLenses);
                selectLenses.appendChild(lensesMesure);
            }
            cameras.appendChild(lenses);

            let carts = document.getElementById("btn");
            carts.addEventListener('click', function () { // Ajout de l'élement au panier lors du click sur le bouton (ajouter au panier(btn))
                displayInCartMessage();
                cartNumbers(camerasData);
                setItems(camerasData)
                totalCost(camerasData);
                onLoadCartNumbers()
            })
            // UTILISATION DE TEXT.CONTENT pour l'affichage du nom et du prix sur la page :
            document.getElementById("name").textContent = camerasData.name;
            document.getElementById("price").textContent = camerasData.price.toFixed(2);

        } else {
            console.error('Retour du serveur : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}
getCameras();


function displayInCartMessage() { // Affiche le message lors du click sur le boutton (ajouter au panier(btn))
    const inCartMessage = document.getElementById('message');
    if (inCartMessage.hasAttribute('hidden')) {
        inCartMessage.removeAttribute('hidden');
    }
}

function onLoadCartNumbers() { // permet de mettre a jour l'icone cart du header même au refresh de la page
    const productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart .product-numbers').textContent = productNumbers;
        document.getElementById('messageProductNumbers').textContent = productNumbers;
    } else {
        document.querySelector('.cart .product-numbers').textContent = '';
    }
}

function cartNumbers(camerasData) { // Création ou incrémentation de la paire clé/valeur du nombre de produit (cartNumbers) dans le localStorage au click sur le bouton (ajouter au panier(btn))
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    console.log(productNumbers);
    console.log(typeof productNumbers);
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart .product-numbers').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart .product-numbers').textContent = 1;
    }
}

function setItems(camerasData) { // Création ou Incrémentation de 1 du nombre du produit (propriété inCart incrémentée de 1) de la paire clé/valeur du produit (productsInCart) dans le localStarage au click sur le bouton (ajouter au panier(btn))
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems !== null) {
        if (cartItems[camerasData.name] == undefined) {
            cartItems = {
                ...cartItems,
                [camerasData.name]: camerasData
            }
            cartItems[camerasData.name].inCart = 0;
        }
        cartItems[camerasData.name].inCart += 1;
    } else {
        cartItems = {
            [camerasData.name]: camerasData
        }
        cartItems[camerasData.name].inCart = 1;

    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    console.log(cartItems);
}

function totalCost(camerasData) { // Création ou Incrémentation du prix total de la paire clé/valeur du prix total (totalCost) dans le localStarage au click sur le bouton (ajouter au panier(btn))
    console.log("The product price is", camerasData.price);
    let cartCost = localStorage.getItem("totalCost");
    console.log("My cartCost is ", cartCost);
    console.log(typeof cartCost); // à la sortie d'un local storage c'est une string, il faut le convertir
    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        console.log(cartCost);
        localStorage.setItem('totalCost', cartCost + camerasData.price);
    } else {
        localStorage.setItem("totalCost", camerasData.price);
    }
}
onLoadCartNumbers();
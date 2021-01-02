const getCameras = async function () { // Fonction qui permet de récupérer les données de l'api
    try {
        let response = await fetch("http://localhost:3000/api/cameras")
        if (response.ok) {
            let camerasData = await response.json()
            console.log(camerasData);
            function cameraTemplate(camera) { // fonction qui return le HTML que l'on va insérer dans la page web couplé aux données de l'api recupérées
                return `
                    <div class="col col-lg-6 col-xl-4 border-bottom">
                        <a href="../public/views/product.html?product_id=${camera._id}">    
                            <img class="product-image" src="${camera.imageUrl}" alt="product">
                            <div class="product-name">${camera.name}</div>
                        </a>
                        <div class="product-description">Description : ${camera.description}</div>
                        <div class="product-price">Price : $ ${(camera.price / 100).toFixed(2)}</div>
                    </div>
                    </div>
                    `
            } // Ajout des différents produits sous forme de tableau les un à la suite des autres une fois transformés en string
            document.querySelector('.row2').innerHTML = ` 
            ${camerasData.map(cameraTemplate).join('')}
                `;
        } else {
            console.error('Retour du serveur : ', response.status)
        }
    } catch (e) {
        console.log(e)
    }
}
function onLoadCartNumbers() { // permet de mettre a jour l'icone cart du header même au refresh de la page
    const productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart .product-numbers').textContent = productNumbers;
    } else {
        document.querySelector('.cart .product-numbers').textContent = '';
    }
}
onLoadCartNumbers();
getCameras();
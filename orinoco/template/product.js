

// Récupération de l'url id produit sur lequel on a clické pour l'appel de l'api
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get('product_id');
console.log(product); // voir https://www.sitepoint.com/get-url-parameters-with-javascript/
var api = "http://localhost:3000/api/cameras/" + product;
console.log(api);



const getCameras = async function() { // fonction qui affiche le produit
    try  {
        let response = await fetch(api)
        if (response.ok) {
            let camerasData = await response.json()
                            // Utilisation du innerHTML :
            // document.getElementById('cameras').innerHTML =  `
            //                 <img class="product-image" src="${camerasData.imageUrl}" alt="product">
            //                 <div class="product-name">${camerasData.name}</div>
            //                 <div class="product-description">${camerasData.description}</div>
            //                 <div class="product-price">${camerasData.price} $</div>
            //                 <p>Select your lense :</p>
            //                 <select name="product-lenses">
            //                     <option value="1">${camerasData.lenses[0]}</option>
            //                     <option value="2">${camerasData.lenses[1]}</option>
            //                     <option value="3">${camerasData.lenses[2]}</option>
            //                 </select>
            //     `
            
            
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
            for(let i=0; i < camerasData.lenses.length; i++) { // Ajout dynamique des différentes lenses
                let lensesMesure = document.createTextNode(camerasData.lenses[i]);
                let selectLenses = document.createElement('option');
                lenses.appendChild(selectLenses);
                selectLenses.appendChild(lensesMesure);
            }
            cameras.appendChild(lenses);



            let carts = document.getElementById("btn");
            carts.addEventListener('click', function() { // Ajout de l'élement au panier lors du click sur le bouton (ajouter au panier(btn))
                        DisplayInCartMessage();    
                        cartNumbers(camerasData);
                        setItems(camerasData)
                        totalCost(camerasData);
                        onLoadCartNumbers()
                    })
            
            function DisplayInCartMessage() { // Affiche le message lors du click sur le boutton (ajouter au panier(btn))
                let inCartMessage = document.getElementById('message');
                if (inCartMessage.hasAttribute('hidden')) {
                    inCartMessage.removeAttribute('hidden');
                }
            }

            function onLoadCartNumbers() { // permet de mettre a jour l'icone cart du header même au refresh de la page
                let productNumbers = localStorage.getItem('cartNumbers');
                if(productNumbers) {
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
                if( productNumbers ) {
                    localStorage.setItem('cartNumbers', productNumbers + 1);
                    document.querySelector('.cart .product-numbers').textContent = productNumbers + 1;
                }else {
                    localStorage.setItem('cartNumbers', 1);
                    document.querySelector('.cart .product-numbers').textContent = 1;
                }
            }
            
            function setItems(camerasData) { // Création ou Incrémentation du nombre du produit (propriété inCart incrémentée) de la paire clé/valeur du produit (productsInCart) dans le localStarage au click sur le bouton (ajouter au panier(btn))
                let cartItems = localStorage.getItem('productsInCart');
                cartItems = JSON.parse(cartItems);
                if(cartItems !== null) {
                    if(cartItems[camerasData.name] == undefined) {
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

                if(cartCost != null) {
                    cartCost = parseInt(cartCost);
                    localStorage.setItem('totalCost', cartCost + camerasData.price);
                } else {
                localStorage.setItem("totalCost", camerasData.price);
                }
            }
            onLoadCartNumbers();

            // UTILISATION DE TEXT.CONTENT pour l'affichage du prix sur le site :
            document.getElementById("name").textContent = camerasData.name;
            document.getElementById("price").textContent = camerasData.price;
        } else {
            console.error('Retour du serveur : ', response.status)
        }
        } catch (e) {
            console.log(e)
        } 
    }

getCameras();







// IMPLEMENTER PANIER HTML5






// function LignePanier (code, qte, prix)
//     {
//         this.codeArticle = code;
//         this.qteArticle = qte;
//         this.prixArticle = prix;
//         this.ajouterQte = function(qte)
//         {
//             this.qteArticle += qte;
//         }
//         this.getPrixLigne = function()
//         {
//             var resultat = this.prixArticle * this.qteArticle;
//             return resultat;
//         }
//         this.getCode = function() 
//         {
//             return this.codeArticle;
//         }
//     }
//     function Panier()
//     {
//         this.liste = [];
//         this.ajouterArticle = function(code, qte, prix)
//         { 
//             var index = this.getArticle(code);
//             if (index == -1) this.liste.push(new LignePanier(code, qte, prix));
//             else this.liste[index].ajouterQte(qte);
//         }
//         this.getPrixPanier = function()
//         {
//             var total = 0;
//             for(var i = 0 ; i < this.liste.length ; i++)
//                 total += this.liste[i].getPrixLigne();
//             return total;
//         }
//         this.getArticle = function(code)
//         {
//             for(var i = 0 ; i <this.liste.length ; i++)
//                 if (code == this.liste[i].getCode()) return i;
//             return -1;
//         }
//         this.supprimerArticle = function(code)
//         {
//             var index = this.getArticle(code);
//             if (index > -1) this.liste.splice(index, 1);
//         }
//     }

//             function ajouter()
//             {
//                 var code = parseInt(document.getElementById("id").value);
//                 var qte = parseInt(document.getElementById("qte").value);
//                 var prix = parseInt(document.getElementById("prix").value);
//                 var monPanier = new Panier();
//                 monPanier.ajouterArticle(code, qte, prix);
//                 var tableau = document.getElementById("tableau");
//                 var longueurTab = parseInt(document.getElementById("nbreLignes").innerHTML);
//                 if (longueurTab > 0)
//                 {
//                     for(var i = longueurTab ; i > 0  ; i--)
//                     {
//                         monPanier.ajouterArticle(parseInt(tableau.rows[i].cells[0].innerHTML), parseInt(tableau.rows[i].cells[1].innerHTML), parseInt(tableau.rows[i].cells[2].innerHTML));
//                         tableau.deleteRow(i);
//                     }
//                 }
//                 var longueur = monPanier.liste.length;
//                 for(var i = 0 ; i < longueur ; i++)
//                 {
//                     var ligne = monPanier.liste[i];
//                     var ligneTableau = tableau.insertRow(-1);
//                     var colonne1 = ligneTableau.insertCell(0);
//                     colonne1.innerHTML += ligne.getCode();
//                     var colonne2 = ligneTableau.insertCell(1);
//                     colonne2.innerHTML += ligne.qteArticle;
//                     var colonne3 = ligneTableau.insertCell(2);
//                     colonne3.innerHTML += ligne.prixArticle;
//                     var colonne4 = ligneTableau.insertCell(3);
//                     colonne4.innerHTML += ligne.getPrixLigne();
//                     var colonne5 = ligneTableau.insertCell(4);
//                     colonne5.innerHTML += "<button class=\"btn btn-primary\" type=\"submit\" onclick=\"supprimer(this.parentNode.parentNode.cells[0].innerHTML)\"><span class=\"glyphicon glyphicon-remove\"></span> Retirer</button>";
//                 }
//                 document.getElementById("prixTotal").innerHTML = monPanier.getPrixPanier();
//                 document.getElementById("nbreLignes").innerHTML = longueur;
//             }
            
//             function supprimer(code)
//             {
//                 var monPanier = new Panier();
//                 var tableau = document.getElementById("tableau");
//                 var longueurTab = parseInt(document.getElementById("nbreLignes").innerHTML);
//                 if (longueurTab > 0)
//                 {
//                     for(var i = longueurTab ; i > 0  ; i--)
//                     {
//                         monPanier.ajouterArticle(parseInt(tableau.rows[i].cells[0].innerHTML), parseInt(tableau.rows[i].cells[1].innerHTML), parseInt(tableau.rows[i].cells[2].innerHTML));
//                         tableau.deleteRow(i);
//                     }
//                 }
//                 monPanier.supprimerArticle(code);
//                 var longueur = monPanier.liste.length;
//                 for(var i = 0 ; i < longueur ; i++)
//                 {
//                     var ligne = monPanier.liste[i];
//                     var ligneTableau = tableau.insertRow(-1);
//                     var colonne1 = ligneTableau.insertCell(0);
//                     colonne1.innerHTML += ligne.getCode();
//                     var colonne2 = ligneTableau.insertCell(1);
//                     colonne2.innerHTML += ligne.qteArticle;
//                     var colonne3 = ligneTableau.insertCell(2);
//                     colonne3.innerHTML += ligne.prixArticle;
//                     var colonne4 = ligneTableau.insertCell(3);
//                     colonne4.innerHTML += ligne.getPrixLigne();
//                     var colonne5 = ligneTableau.insertCell(4);
//                     colonne5.innerHTML += "<button class=\"btn btn-primary\" type=\"submit\" onclick=\"supprimer(this.parentNode.parentNode.cells[0].innerHTML)\"><span class=\"glyphicon glyphicon-remove\"></span> Retirer</button>";
//                 }
//                 document.getElementById("prixTotal").innerHTML = monPanier.getPrixPanier();
//                 document.getElementById("nbreLignes").innerHTML = longueur;
//             }

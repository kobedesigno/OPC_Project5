import  { apiUrl } from "./config"
export const getCameras = async function(id) {
    try  {
        let response = await fetch(apiUrl + '/api/product/' +id)
        if (response.ok) {
            let camerasData = await response.json()
            console.log(camerasData);
            camerasData.forEach(product => {

                function cameraTemplate(camera) {
                    return 
                }
                document.querySelector('main').innerHTML = `
                ${camerasData.map(cameraTemplate).join('')}
                `;
            });
        } else {
            console.error('Retour du serveur : ', response.status)
        }
        } catch (e) {
            console.log(e)
        } 
    }
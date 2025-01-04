// prévention de l'empilement d'alertes, qui entrainerait la suppression de tous les messages sauf le dernier
// Pour cela, on utilise une file et une fonction asynchrone qui boucle et vide la file alerte par alerte
let file_alertes = []

function ouvrirAlerte(message,prompt=false){

    // on renvoie une promise pour couvrir le cas d'une alerte en mode prompt
    // qui se doit donc de renvoyer le texte saisi par l'utilisateur
    return new Promise((resolve) => {
        file_alertes.push({message,prompt,resolve})

        // si c'est la seule alerte en attente, on l'affiche
        if(file_alertes.length == 1 ) {
            afficherAlerte(file_alertes[0].message, file_alertes[0].prompt)
        }
        // sinon, elle sera automatiquement affichée lors de la fermeture de l'alerte juste avant dans la file
    })
    
}


// Fonction pour afficher une alerte mais plus jolie que celle par défaut
function afficherAlerte(message,prompt) {
    // on signale une alerte en train d'être visionnée
    flag = true


    // on prend les elements
    let modal = document.getElementById("alerte_jolie")

    const message_ele = document.getElementById("message_alerte_jolie")
    
    // Mettre le message
    message_ele.textContent = message;

    // afficher la barre de saisie de texte si besoin
    const alerte_input = document.getElementById("input_alerte_jolie")
    if(prompt){
        //inline pour mettre l'input à coté du bouton OK :)
        alerte_input.style.display = "inline-block";
    }else{
        alerte_input.style.display = "none";
    }
    
    // et on affiche en changeant la propriété css
    modal.style.display = "block";
}


// Fonction pour fermer l'alerte
function fermerAlerte() {

    var modal = document.getElementById('alerte_jolie');
    
    // et on cache en changeant la propriété css
    modal.style.display = "none";

    // enlève notre élément de la file

    const alerte_vue = file_alertes.shift()

    // resolve la promise de ouvrirAlerte avec la valeur de l'input 
    // quand l'utilisateur a fermé l'alerte
    // dans le cas d'une alerte sans le mode prompt, on ne récupère pas de valeur
    // donc on se moque de ce que cela peut renvoyer (Nan, sans doute)
    const alerte_input = document.getElementById("input_alerte_jolie")
    if(alerte_vue.resolve){
        alerte_vue.resolve(alerte_input.value)
    }

    // affiche récursivement les autres alertes en attentes
    if(file_alertes.length > 0){
        afficherAlerte(file_alertes[0].message, file_alertes[0].prompt)
    }

}

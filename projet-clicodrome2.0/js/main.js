let score = 0

// stoque les ameliorations deja disponibles dans le magasin pour ne pas le faire clignoter
let magasin_tech = {}

let magasin_coll = {}

// stoquer les ameliorations deja achetees pour ne pas les afficher dans le magasin
let sacado = {} 

// premet de ne pas laisser le joueur acheter html 5 si il n'a pas débloqué html 1.0 etc..
let evolution_tech = 0
let evolution_coll = 0

// variable qui permet d'augmenter la taille de l'incrément du score pour chaque clic, en fonction de la technlologie déloquée
let boost = 1

let revenu_passif = 0



async function remplirMagasinTechnologies(){


    const table= document.getElementById("table_magasin_technologies_body") 

    let data = await fetch("./bdd/arbre.json")
    data = await data.json() 


    let tech = data["technologies"]

    for(const key in tech){
        // ne va pas s'embeter à process si on a deja acheté l'amelioration     
        // n'afficher l'amélioration que si le score est assez élevé
        const t = new Technologie(tech[key])

        if( !sacado[key] && !magasin_tech[key] && (t.borne <= score) && (evolution_tech === parseInt(t.evolution))){
            ouvrirAlerte(tech[key]["narration"])

            // met à jour le contenu du magasin
            // pour ne pas re-afficher cette ligne et éviter un clignotement
            magasin_tech[key] = true                
    
    
            /* fonction qui va s'activer lorsqu'on achète l'objet*/
            t.callbackAchat = (event) =>{


                // ne laisse acheter que si on a l'argent
                if(score >= t.cout){


                    // incrémente le score implicite d'evolution pour permettre à la prochaine amelioration de s'afficher
                    evolution_tech += 1
                    
                    // on améliore le style de la page :)
                    t.appliquerAmeliorationStyle()
                        
                    // et on ajouter l'amélioration dans l'abre des compétences débloquées
                    sacado[key] = true



                    // on refresh le magasin pour enlever l'amelioration de la liste
                    // vide le ventre du magasin
                    table.innerHTML = ""
                    magasin_tech = {}
                    remplirMagasinTechnologies()


                    // finalement, on lui débit son compte de points tel un vendeur de voitures
                    score -= t.cout
                    majAffichageScore()

                    // augmentation du boost d'incrément
                    ouvrirAlerte("Incrémentation de la rentabilité de tes clicks de "+t.boost+" points !!")

                    if(t.evolution == 0){
                        boost += t.boost -1    // car sinon, le premier boost ne va pas entrainer un nombre rond de points par click :)        

                    }else{
                        boost += t.boost
                    }

                }else{
                    // PAS ASSEZ RICHE !!!!!
                    ouvrirAlerte("PAS ASSEZ RICHE !!!!!!!!!!!!")
                }
            }
            // affiche dans le tableau la ligne générée, prend en compte le callback d'achat
            const tr = t.genererLigneTableau()
            table.appendChild(tr)
        }
        
    }

}


async function remplirMagasinCollegues(){


    const table= document.getElementById("table_magasin_collegues_body") 

    let data = await fetch("./bdd/arbre.json")
    data = await data.json() 


    let collegues = data["collegues"]

    for(const key in collegues){
        const collegue = new Collegue(collegues[key],key)

        // ne va pas s'embeter à process si déjà présent dans le magasin
        // ou si le score d'évolution n'est pas assez élevé
        if(!magasin_coll[key] && (evolution_coll >= parseInt(collegue.evolution)) ){

    
            /* fonction qui va s'activer lorsqu'on achète l'objet*/
            collegue.callbackAchat = (event) => {
                
                // calcul du cout en fonction du nombre de collegue de ce type déjà acheté
                let exp = 0
                if(key in sacado){
                    exp = sacado[key]
                }
                const cout_reel = Number(collegue.cout * (1.1)**exp).toFixed(1)
                
                // ne laisse acheter que si on a l'argent
                if(score >= cout_reel){
                

                    if(!(key in sacado)){

                        //lancer l'animation d'achat avec l'image correspondante
                        let image = document.getElementById("image_collegue_animee")
                        image.setAttribute("src",collegue.nom_fichier_image)
                        image.setAttribute("alt","image de "+collegue.nom)
                        // affiche l'image
                        image.removeAttribute("hidden")

                        // PLUIE DE CONFETTTIIII
                        genererConfetti()


                        // recache l'image après 6 secondes et lance la narration
                        setTimeout(() => {
                            image.setAttribute("hidden",true)

                            // narration comme c'est la première fois qu'on achète

                            ouvrirAlerte("Vous avez débloqué "+ collegue.nom+" !!"+collegues[key]["narration"])
                            ouvrirAlerte("Incrémentation de la rentabilité passive de "+collegue.revenu_passif+" points !!")
                            
                        }, (4000));

                        // on ajoute l'amélioration dans l'abre des compétences débloquées
                        sacado[key] = 1   

                        // incrémente le score implicite d'evolution pour permettre à la prochaine amelioration de s'afficher
                        evolution_coll += 1

                        // on maj le magasin pour débloquer de nouveaux personnages
                        remplirMagasinCollegues()
                    
                    }else{
                        // on incrémente la qtt d'objet dans son sacado
                        sacado[key] += 1
                    }

                    // augmentation du boost d'incrément
                    revenu_passif += collegue.revenu_passif

                    // finalement, on lui débite son compte de points tel un vendeur de voitures
                    score = score - cout_reel
                    majAffichageScore()

                    let exp = 0
                    if(key in sacado){
                        exp = sacado[key]
                    }

                    // on change le futur cout dans le tableau
                    document.getElementById("case_cout_"+key).textContent = rendreNombreLisible(Number(collegue.cout * (1.1)**exp).toFixed(1))


                }else{
                    // PAS ASSEZ RICHE !!!!!
                    ouvrirAlerte("PAS ASSEZ RICHE !!!!!!!!!!!!")
                }
                
                
            }
    
            
            // met à jour le contenu du magasin
            // pour ne pas re-afficher cette ligne et éviter un clignotement
            magasin_coll[key] = true


            // affiche dans le tableau la ligne générée, prend en compte le callback d'achat
            const tr = collegue.genererLigneTableau()         
            table.appendChild(tr)
            
        }
        

    }

}

function majAffichageScore(){
    const score_aff = document.getElementById("score_affichage")
    score = Number((score).toFixed(1))
    score_aff.textContent ="SCORE  : " + rendreNombreLisible(score)

}

// fonction appelée à chaque clic de souris
function scoreCount(){
    score += boost
    majAffichageScore()
    // check refresh la table magasin pour afficher une amélioration si un palier est atteint
    remplirMagasinTechnologies()
    remplirMagasinCollegues()
}

// revenu passif à chaque seconde

function augmenterScorePassivement(){
    score += revenu_passif
    majAffichageScore()
    setTimeout(() => {
        augmenterScorePassivement()
    }, 1000)    
}

var i=0
function leBoostDuProf(){
    if (i === 0){
        rickRoll()
        i+=1
    }
    score += 1000000000
    majAffichageScore()
    
}



function rickRoll(){
    const rickroll = document.getElementById("never")
    const close_roll = document.getElementById("close_rick")

    // affichage de la video
    rickroll.setAttribute("src","./img/never_gonna_give_you_up.mp4")
    rickroll.setAttribute("type","video/mp4")
    rickroll.removeAttribute("hidden")
    rickroll.autoplay=true
    
    // affichage du bouton de fermeture
    close_roll.removeAttribute("hidden")
    close_roll.addEventListener("click",function(){
        rickroll.hidden=true
        rickroll.pause();

        close_roll.hidden=true

    })

    
}


// fonction qui va creer plein d'elements confetti
function genererConfetti() {

    const container = document.getElementById("confetti-container")

    // couleurs des confetti à generer
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD633", "#A833FF", "#33FFF6"]
    
    const nb_confetti = 150 // nombre de confettis

    for (let i = 0; i < nb_confetti; i++) {

        //créer un nouvel element de classe confetti
        const confetti = document.createElement("div")
        confetti.classList.add("confetti")

        //prendre une couleur aléatoire dans la liste
        confetti.style.setProperty("background-color", colors[Math.floor(Math.random() * colors.length)])
        
        // positionner le confetti à un endroit random horizontalement
        confetti.style.left = Math.random() * 100 + "vw"

        // mettre une fraction de 5s pour faire un temps à l'écran assez naturel
        const longevite = Math.random() * 5
        confetti.style.animationDelay = longevite+"s"

        // faire des confettis qui vont plus vite que d'autres
        confetti.style.animationDuration = 4 + Math.random() * 2 + "s" 

        // ajouter le confetti au container
        container.appendChild(confetti)

    }

    setTimeout(() => {
        // vide le conteneur à la fin pour ne pas surcharger la page d'elements
        // on aurait pu utiliser container.innerHTML = ""
        // mais ça nous permet de mettre en avant une boucle while et la supression d'éléments
        // la boucle fonctionne tant que firstChild n'est pas null
        // i.e tant que note conteneur a au moins un enfant
        while(container.firstChild){
            container.removeChild(container.firstChild)
        }
    }, 10000);

}


function rendreNombreLisible(n){
    let ret = n

    if(n>=1000000){
        const quantifiers = [
            "Million",         // 10^6
            "Milliard",        // 10^9
            "Billion",         // 10^12
            "Billiard",        // 10^15
            "Trillion",        // 10^18
            "Trilliard",       // 10^21
            "Quadrillion",     // 10^24
            "Quadrilliard",    // 10^27
            "Quintillion",     // 10^30
            "Quintilliard",    // 10^33
            "Sextillion",      // 10^36
            "Sextilliard",     // 10^39
            "Septillion",      // 10^42
            "Septilliard",     // 10^45
            "Octillion",       // 10^48
            "Octilliard",      // 10^51
            "Nonillion",       // 10^54
            "Nonilliard",      // 10^57
            "Décillion",       // 10^60
            "Décilliard",      // 10^63
            "Undécillion",     // 10^66
        ];
        // on enlève la virgule et la partie decimal pour ne pas 
        // fausser la longueur du string
        const rpz_string = Number(n).toFixed(0)+"" 
        // les qualificatifs étant par puissance de mille,
        // compte la puissance de 10 mais divisée par 3
        const puiss_mil = Math.floor((rpz_string.length-1)/3)

        // ici, on ne garde que jusqu'à la centaine de l'unité choisie
        // et on le met dans la variable de retour
        ret = Number(n/(10**(3*puiss_mil))).toFixed(2)

        // enfin, on rajoute le quantificateur, avec un 's' si on est pas à l'unité
        let q = " "+ quantifiers[puiss_mil -2]
        if(ret != 1){
            q +='s'
        }

        ret += q

    }

    return ret
    

}


function genererCadeau(){
    

    const div_cadeau = document.getElementById("div_cadeau");
    div_cadeau.style.display = "block";

    teleportationCadeau(1)
}


function cadeauClickCallback(){
    const div_cadeau = document.getElementById("div_cadeau");

    const nb_gen = Math.floor(Math.random() * 10) + 1; // Nombre aléatoire entre 1 et 10

    ouvrirAlerte("Entrez un chiffre entre 1 et 10 :",true).then((val)=>{
        const nb_devine = parseInt(val, 10);

        if (isNaN(nb_devine) || nb_devine < 1 || nb_devine > 10) {
            ouvrirAlerte("Le chiffre rentré n'est pas valide")
        }else{ 
            if (nb_gen === nb_devine) {
                ouvrirAlerte("Bravo ! Vous avez doublé votre score !");
                score *= 2;
            } else {
                ouvrirAlerte("Dommage, vous doublerez votre score la prochaine fois !... MOUHAHAHAHAH");
            }
        } 
    

    
        // génère un nouveau timer pour le prochain cadeau à afficher !
        setTimeout(genererCadeau, Math.random() * 10000 + 20000); // Premier affichage aléatoire entre 20 et 30 secondes
    
    })
    // enlève le cadeau avant que le callback soit executé pour ne pas voir le cadeau sur l'alert
    div_cadeau.style.display = "none";

}


function teleportationCadeau(n) {
    const div_cadeau = document.getElementById("div_cadeau");

    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 50);

    div_cadeau.style.left = `${x}px`;
    div_cadeau.style.top = `${y}px`;


    // limite le nombre de téléportations du cadeau à 15 fois
    // permet de ne pas boucler le timeout à l'infini
    if(n < 15){
        n += 1
        setTimeout(() => {
            // affiche le cadeau à un autre endroit pour faire un effet de téléportation
            teleportationCadeau(n)
        }, Math.random() * 1000 + 1000); // Durée d'affichage entre 1s et 1.5 seconde
        
    }else{
        // on enlève le cadeau à la 15ème téléportation :), 
        // display: none va aussi permettre de rendre le cadeau non cliquable
        div_cadeau.style.display = "none"
    }
}

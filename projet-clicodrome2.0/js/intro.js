document.addEventListener("click",firstClick)


function firstClick(){
    let position_button=document.getElementById("div_button")
    let position_score=document.getElementById("div_score")

    const score_aff = document.createElement("output")
    score_aff.innerText="SCORE"
    score_aff.id = "score_affichage"

    const click = document.createElement("button")
    click.innerText="click"

    position_score.appendChild(score_aff)
    position_button.appendChild(click)

    click.addEventListener("click",scoreCount)


    document.removeEventListener("click",firstClick)

    augmenterScorePassivement()

}

function pageChargee(){
    // fonction appelée au chargement de la page, initialise divers mécanismes du jeu

    ouvrirAlerte("Bienvenue dans ProgWeb-Legends ! Un jeu des plus innovants basé sur le concept du click de souris :)")
    firstClick()
    

    // on setup le cadeau qui se téléporte 
    const div_cadeau = document.getElementById("div_cadeau");
    div_cadeau.addEventListener("click",cadeauClickCallback)


    setTimeout(genererCadeau, Math.random() * 10000 + 20000); // Premier affichage aléatoire entre 20 et 30 secondes


}

window.addEventListener("DOMContentLoaded",pageChargee)




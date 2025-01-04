class Collegue{
    constructor(json,cle) {
        this.props = json
        this.nom = this.props.nom
        this.cout = this.props.cout
        this.boost = this.props.boost
        this.revenu_passif = this.props.revenu_passif
        this.url_wikipedia = this.props.wikipedia
        this.nom_fichier_image = this.props.nom_fichier_image
        this.cle = cle
        this.callbackAchat = {}
        this.evolution = this.props.evolution
    }

    /* va générer la ligne du tableau correspondant à ce collegue, 
    utile pour remplir le magasin de collegues */
    genererLigneTableau() {
        const tr = document.createElement("tr")
        const case_nom = document.createElement("td")
        case_nom.textContent = this.nom
        const case_boost = document.createElement("td")
        case_boost.textContent = this.revenu_passif
        const case_cout = document.createElement("td")
        case_cout.textContent = rendreNombreLisible(this.cout)
        case_cout.id = "case_cout_"+this.cle

        // case contenant un lien vers la page wikipédia du personnage
        const case_wiki = document.createElement("td")
        const a = document.createElement("a")
        a.href = this.url_wikipedia
        a.textContent = this.nom
        case_wiki.appendChild(a)

    
        const action  = document.createElement("td")
        const btn_acheter = document.createElement("button")
        btn_acheter.textContent = "Acheter"
        btn_acheter.addEventListener("click",this.callbackAchat)
        action.appendChild(btn_acheter)

        tr.appendChild(case_nom)
        tr.appendChild(case_boost)
        tr.appendChild(case_cout)
        tr.appendChild(case_wiki)
        tr.appendChild(action)

        return tr
        
    }

}
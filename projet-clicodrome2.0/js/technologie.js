class Technologie{
    constructor(json) {
        this.props = json
        this.cout = this.props.cout
        this.boost = this.props.boost
        this.nom = this.props.nom
        this.css_id = this.props.css_id
        this.evolution = this.props.evolution
        this.borne = this.props.borne
        this.callbackAchat = {}

    }

    appliquerAmeliorationStyle(){
        document.getElementById("alerte-css").setAttribute("href","css/alerte/a"+evolution_tech+".css")
        document.getElementById("link-css").setAttribute("href","css/"+this.css_id)
    }

    genererLigneTableau(){
        const tr = document.createElement("tr")
        const case_nom = document.createElement("td")
        case_nom.textContent = this.nom
        const case_boost = document.createElement("td")
        case_boost.textContent = this.boost
        const case_cout = document.createElement("td")
        case_cout.textContent = rendreNombreLisible(this.cout)
    
        const case_action  = document.createElement("td")
        const btn_acheter = document.createElement("button")
        btn_acheter.textContent = "Acheter"
        btn_acheter.addEventListener("click",this.callbackAchat)

        case_action.appendChild(btn_acheter)
    
    
        tr.appendChild(case_nom)
        tr.appendChild(case_boost)
        tr.appendChild(case_cout)
        tr.appendChild(case_action)


        return tr
    }


}
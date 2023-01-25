// MÉTHODE 1 POUR LIER JSON  charger l'URL du fichier JSON var requestURL =
// 'https://github.com/MehdiYansli/QUIZ_dev/blob/main/quiz.json ';  créer une
// requête var request =  new XMLHttpRequest();  ouvrir une nouvelle requête
// request.open('GET', requestURL);  Attribu la valeur 'json' à responseType
// (en-US), signalant ainsi au serveur que nous attendons une réponse au format
// JSON. Puis, nous envoyons notre requête request.responseType='json';
// request.send();  réponse du serveur et son traitement request.onload =
// function() {     var quiz = request.response; }
const main = document.querySelector('main')
const resultPage = document.getElementById('result')
const pageAccueil = document.getElementById('pageAccueil')
main.style.display = 'none';
const questionsPage = document.getElementById('questionnaire')
const listAll = document.getElementsByTagName('li')
const boutonsRadio = document.getElementsByClassName('reponses')
const submit = document.getElementById('submit')
const buttonEnd = document.getElementById('end')
// je sélectionne tous les labels sélectionnés de la page const labels =
// document.querySelectorAll('label') MÉTHODE 2 POUR LIER JSON

let questions = {};
getData();
async function getData() {
    const reponse = await fetch("quiz.json");
    questions = await reponse.json();
    const quiz = questions.quiz
    // mettre les données de la première question sur le li créé en html que j'ai
    // ensuite cloné en newli
    const questElmt = document.getElementsByClassName('quest')[0]
    questElmt.textContent = quiz[0].question
    // Donner aux clones les questions correspondant aux questions à la suite dans
    // le json
    for (let i = 1; i < quiz.length; i++) {
        const questionBloc = quiz[i]
        const card = createCard(questionBloc, i)
        card.firstElementChild.textContent = questionBloc.question
    }

    // Donner à chaque bouton radio du li créé en HTML les valeurs des réponses du
    // premier objet json
    const labels1 = boutonsRadio[0].querySelectorAll('label')
    const inputs1 = boutonsRadio[0].querySelectorAll('input')

    for (let i = 0; i < labels1.length; i++) {
        labels1[i].textContent = quiz[0].answer[i]
        inputs1[i].value = quiz[0].answer[i]
    }

    // Validation du quiz
    submit.addEventListener('click', choix)

    function choix() {
        // je débute le score en partant de 0
        let scoreNbr = 0

        // je sélectionne les input des boutons radios et juste de ceux sélectionnés au clic
        for (let i = 0; i < quiz.length; i++) {
            let radios = boutonsRadio[i].querySelectorAll('input')
            let radio = boutonsRadio[i].querySelector('input:checked')
            
            
            for (let j = 0; j < radios.length; j++) {
                radios[j].disabled = true 
                
            }

                if (radio == null) {
                    console.log('null')
                    orange(radios, i) 

                } else if (radio.value === quiz[i].goodAnswer) {
                    //  Compter le nombre de points pour faire le score
                    scoreNbr = scoreNbr + 1
                    console.log(scoreNbr)

                    let labelChecked = radio.nextElementSibling
                    labelChecked.style.backgroundColor = 'green'
                    
                } else if (radio.value !== quiz[i].goodAnswer) {
                    let labelChecked = radio.nextElementSibling
                    labelChecked.style.backgroundColor = 'red'
                    correction(radios, i)

                }

// récupérer et stocker la valeur du score
        localStorage.setItem("score", scoreNbr)

// ajouter les informations sur une réponse si il y en a dans le json
                if (quiz[i].information != "") {
                    let info = document.createElement('p')
                    info.style.color = 'green'
                    info.style.border= 'solid green'
                    info.style.width= '90%'
                    info.style.margin= '10px auto'
                    info.style.padding= '5px 5px'
                    info.style.borderRadius= '10px'
                    info.style.textAlign = 'center'
                    info.textContent = quiz[i].information
                    listAll[i].append(info)
                    
                }
        }
        // Je rappel la fonction qui permet d'afficher le score et le top5 afin
        // d'afficher le nombre du score
        results(scoreNbr)
    }
// fonction pour changer la couleur des bonnes réponses en orange
// foncion rappelé plus haut dans le cas où pas de réponse
    submit.addEventListener('click', orange)

    function orange(radios, i) {
    for (let j = 0; j < radios.length; j++) {
            if (radios[j].value == quiz[i].goodAnswer) {
                radios[j].nextElementSibling.style.backgroundColor = 'orange'
            }
        }
    }
// entourer la bonne réponse si la personne s'est trompé 
    submit.addEventListener('click', correction)

    function correction(radios, i) {
    for (let j = 0; j < radios.length; j++) {
            if (radios[j].value == quiz[i].goodAnswer) {
                radios[j].nextElementSibling.style.border = 'solid 3px green'
            }
        }
    }
}

// ------------- Entrer son username sur la page d'accueil ------------------

const formElmt = document.querySelector('form');

// Empêcher le chargement de l'évènement lors du clique sur le bouton submit
formElmt.addEventListener('submit', handleSubmit)

function handleSubmit(event) {
    event.preventDefault();
}

// Au clic sur le bouton go le champs doit être remplie / garder le nom et on
// passe au questionnaire
const go = document.getElementById('go');
const username = document.getElementById('nom');
const accueil = document.querySelector('.accueil')

username.addEventListener('keyup', update)

function update() {

    if (username.value.trim() == "") {
        go.disabled = true;

    } else {

        go.disabled = false;

        go.addEventListener('click', valider)

        function valider() {

            accueil.style.display = 'none'
            main.style.display = null
            pageAccueil.style.height = '100%'
            // j'enregistre le nom entré par l'élève
            localStorage.setItem("nom", username.value)

            // ------------ Ajouter un titre qui utilise le nom dans local storage ------
            const bienvenue = document.getElementById('bienvenue')
            bienvenue.textContent = 'Bon courage ' + localStorage.getItem('nom') + ' !'

        }
        
    }

}

// ------ créer les éléments sur la page de résultat
function results(scoreNbr) {
   

    bienvenue.style.display = 'none'
    buttonEnd.style.display = 'none'

    const resultPage = document.getElementById('results')
    const scorePlace = document.getElementById('score')
    
    resultPage.style.display = 'contents'
    
    scorePlace.textContent = 'SCORE : ' + localStorage.getItem('score') + "/25"
     save(username, scoreNbr)


}

//-------------------------- Créer les questions -------------------------------

function createCard(questionBloc, i) {
    const list = document.getElementsByTagName('li')[0]
    /**
     * @type {HTMLElement}
    */
    let newli = list.cloneNode(true)
    questionsPage.appendChild(newli)

    // selection des inputs et des labels créés afin de changer leurs name, id et
    // for pour les lier entre eux

    let inputs = newli.querySelectorAll('input')
    console.log(inputs)
    // forEach va chercher les éléments d'un tableau et je remplace leur name
    inputs.forEach(element => element.name = 'option' + i)

    let newLabels = newli.querySelectorAll('label')
    console.log(newLabels)

    // Boucle for pour remplacer id et for qui doivent être les mêmes pour chaque
    // bouton
    for (let j = 0; j < newLabels.length; j++) {
        inputs[j].id = 'option' + i + j
        //utilisation de setAttribute pour newLabels car .for ne fonctionnait pas
        newLabels[j].setAttribute("for", 'option' + i + j)
        newLabels[j].textContent = questionBloc.answer[j]
        inputs[j].value = newLabels[j].textContent
    }
    return newli;

}

// ----------- local storage pour garder les noms et scores

function save(username, scoreNbr) {
  

    let onePlayer = {
    name: username.value,
    score: scoreNbr
 }   

// si rien enregistré au départ on débute avec un tableau vide
    if (localStorage.getItem("data") == null){
        localStorage.setItem("data", "[]")
    }

// prendre anciennes valeur enregistré et les mettre dans les nouvelles
    let old_data = JSON.parse(localStorage.getItem("data"))
    old_data.push(onePlayer)

// enregistrer les anciennes et nouvelles valeurs dans le local storage
    localStorage.setItem("data", JSON.stringify(old_data))

// ----- stocker les noms des joueurs et leur score pour le top 5

     const players = document.getElementById('players')
     
     
     old_data.sort(compareScore)
     
     function compareScore(a, b) {
         return b.score - a.score
          //fonction fléchée plus rapide 
         // old_data.sort((a,b) => b.score - a.price)
        }

    if (old_data.length > 5) {
    old_data.length = 5
    }
     // trier du plus haut score au plus petit 
     for (i=0; i < old_data.length; i++ ){
             
         const player = document.createElement('li')
         const playerName = document.createElement('span')
         const playerScore = document.createElement('span')
         players.append(player)
         player.append(playerName, playerScore)
         
         playerName.textContent = old_data[i].name
         playerScore.textContent = old_data[i].score + "/25"
        }
    }


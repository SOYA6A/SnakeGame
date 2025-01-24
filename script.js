//Sélectionne l'élément de la planche de jeu (play board) 
const playBoard = document.querySelector(".play-board");
//Séléctionne l'élément qui affiche le score 
const scoreElement = document.querySelector(".score");
//Séléctionne l'élément qui affiche le meilleur score 
const highScoreElement = document.querySelector(".high-score");
//Séléctionne tous les contrôles (flèches)sur l'interface
const controls = document.querySelectorAll(".controls i")

//varible pour vérifier si le jeu est términé
let gameOver = false;
//variables pour la position de la nourriture 
let  foodX, foodY;
//variable pour la position initiale de la tête du snake
let snakeX = 5, snakeY = 10;
//tableau pour stocker le coprs du serpent 
let snakeBody = [];
//vitesse du snake sur les axe X et Y
let velocityX =0, velocityY = 0;
//identifiant pour l'intervalle de mise à jour du jeu
let setIntervalId;
//score du jeu 
let score = 0;

//récupère le meilleur score depuis le stockage local ou initialise à 0
let highScore = localStorage.getItem("high-score") || 0;
//met à jour l'affichage du meilleur score 
highScoreElement.textContent = `High Score: ${highScore}`;

//fonction pour changer la position de la nouriture aléatoirement 
const changeFoodPosition = () => {
  //génère une position aléatoire pour la nouriture dans la grille
    foodX = Math.floor(Math.random() * 30 ) + 1;//entre 1 et 30
    foodY = Math.floor(Math.random() * 30 ) + 1;//entre 1 et 30
}

//fonction pour gérer la fin du jeu
const handleGameOver = () => {
  //stop la mise a jour du jeu 
  clearInterval(setIntervalId);
  //envoie une alerte indiquant que le jeu est términé
  alert("Game Over! Press close to replay ");
  //recharge la page pour rejouer
  location.reload();

}


//fonction pour changer la direction du snake selon les touches pressées
const changeDirection = (e) => {
  //vérifie quelle touche a été pressée et change la direction en conséquence
      if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
      } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
      } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
      } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
      }
}

//ajoute un événement de clic sur chaque controles (arrow)
controls.forEach(key => {
  key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
});

//fonction pour initialiser et mettre à jour le jeu
const initGame = () => {
  //si le jeu est términé, appelle la fonction handleGameOver
    if(gameOver) return handleGameOver();

    //création de la nourriture à afficher sur le play board 
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
   
    //check if the snake hits the food
    if(snakeX === foodX && snakeY === foodY ) {
        changeFoodPosition();//change la position de la nourriture
        snakeBody.push([foodX, foodY])//ajoute un segment au corps du snake
        score++;//augmente le score 

        //met à jour le score si le score actuel est supérieur
       highScore = score >= highScore ? score : highScore;
       //enregistre le meilleur score dans le stockage local
       localStorage.setItem("high-score", highScore);
       //met a jour l'affichage du score  
        scoreElement.innerText = `Score: ${score}`;
        //met a jour l'affichage du meilleur score 
        highScoreElement.innerText = `highScore: ${highScore}`;
      
    }

    //met à jour la position du corps du snake 
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
        
    }

    //met a jour la position de la tête du snake
    snakeBody[0] = [snakeX, snakeY];

    //met a jour la position de la tête du snake selon la vitesse 
    snakeX += velocityX;
    snakeY += velocityY;

    //vérifie si le snake touche les bords de la grille 
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;//si c'est le cas donc le jeu términé
    }

    //vérifie si le snake se mord
    for (let i = 0; i < snakeBody.length;  i++) {
         htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

         //si la tête du snake touche un autre segement du corps
         if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
          gameOver = true;//then le jeu est términé
         }
    }


    //met à jour le play board avec la new position of the food and the snake 
    playBoard.innerHTML = htmlMarkup;
}

//change la position de la nourriture pour commencer le jeu 
changeFoodPosition();
//démare le jeu et met à jour toutes les 125 millisecondes
   setIntervalId = setInterval(initGame, 125);
   //écoute les événements de pression de touche pour changer la direction 
    document.addEventListener("keydown", changeDirection); 
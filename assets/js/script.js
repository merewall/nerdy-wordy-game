// ALPHABET GUESS OPTIONS
var options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// INITIAL GAME SETTINGS
var word;
var result = false;
var wins = 0;
var losses = 0;
var timeLeft = 10;

// PAGE ELEMENTS
var alphaEl = document.getElementById('alphabet');
var wordEl = document.getElementById('word');
var msg = document.getElementById('message');
var timerEl = document.getElementById('timer');

// PAGE LOAD INITIATION
function init(){
    displayScores();
    displayAlphabet();
}

// START BUTTON ACTION
function startGame(){
    // RESET TO GAME'S INTIAL SETTING & START TIMER COUNTDOWN
    timeLeft = 10;
    timerEl.textContent = timeLeft + " seconds";
    result = false;
    displayAlphabet();
    gameCountdown();
    msg.textContent = '';

    // PICK A RANDOM WORD FOR USER TO GUESS & DISPLAY AS BLANKS
    word = getRandomWord();
    var hiddenWord = [];
    for (let i = 0; i < word.length; i++){
        hiddenWord.push("_");
    }
    wordEl.textContent = hiddenWord.join('');
    wordEl.setAttribute("style", "letter-spacing: 1rem");    
    

    // INITIATE KEYDOWN EVENT LISTENER FOR USER GUESSES
    document.addEventListener('keydown', handleUserGuess);
}

// DISPLAY ALPHABET FOR USER
function displayAlphabet(){
    
    // REMOVES ALL EXISTING LETTER DIVS FROM PREVIOUS GAME GUESSES
    while (alphaEl.firstChild) {
        alphaEl.removeChild(alphaEl.firstChild);
    };
    
    // DISPLAY EVERY LETTER OF ALPHABET OPTIONS ON PAGE
    var alphaArr = options.split('');
    for(let i = 0; i < alphaArr.length; i++){
        var letterEl = document.createElement('div');
        letterEl.textContent = alphaArr[i];
        letterEl.setAttribute('class','letter')
        alphaEl.appendChild(letterEl);
    }
}

// FUNCTION TO SELECT RANDOM WORD FOR A NEW GAME
function getRandomWord() {
    // POSSIBLE WORDS
    var words = ["banana", "chief", "calculator", "apple", "squid", "jumper", "judo", "karate", "trees", "javascript", "coding", "software"];

    return words[Math.floor(Math.random()*words.length)]
};

// FUNCTION TO START GAME TIMER
function gameCountdown(){

    timerEl.setAttribute('style', 'color: var(--darkgreen)')

    var timeInterval = setInterval(function(){
        // IF HAVEN'T WON YET AND MORE THAN 1 SEC LEFT,
        // SHOW TIME LEFT AND DECREMENT TIMELEFT
        if (timeLeft > 1 && result !== true){
            timerEl.textContent = timeLeft + " seconds";
            timeLeft--;
          } // IF HAVEN'T WON YET AND ONE 1 SEC LEFT
            // ADJUST SYNTAX OF TIMELEFT DISPLAY AND DECREMENT
            else if (timeLeft === 1 && result !== true){
              timerEl.textContent = timeLeft + " second";
              timeLeft--;
          } // IF WON, CLEAR THE TIMER
            else if (result === true){
              clearInterval(timeInterval);
          } // IF TIME RUNS OUT BEFORE SOLVING, INCREASE LOSSES
            // SET LOSSES TO LOCAL STORAGE, REDISPLAY SCORES
            // AND CLEAR TIMER INTERVAL
            else {
            timerEl.textContent = 'TIME IS OUT!';
            timerEl.setAttribute('style', 'color: var(--red)');
            msg.textContent = "Press 'Start' to try again."
            wordEl.textContent = word;
            losses++;
            localStorage.setItem('losses', losses);
            displayScores();
            clearInterval(timeInterval);
            document.removeEventListener('keydown',handleUserGuess);
            // displayMessage();
          }
    }, 1000);
}

// DISPLAY SCORES
function displayScores(){

    // CHECK LOCAL STORAGE FOR ANY STORED SCORES
    let storedWins = localStorage.getItem("wins");
    let storedLosses = localStorage.getItem("losses");

    // UPDATE WINS/LOSSES  IF ANY STORED SCORES
    if(storedWins){
        wins = storedWins;
    } else {
        wins = 0;
    }

    if(storedLosses){
        losses = storedLosses;
    } else {
        losses = 0;
    }

    // UPDATE THE UI WITH THE SCORES
    var winsEl = document.getElementById("wins");
    var lossesEl = document.getElementById("losses");
    winsEl.textContent = "WINS:  " + wins;
    lossesEl.textContent = "LOSSES:  " + losses;

}

// KEY EVENT LISTENER TO LOG USER GUESSES
function handleUserGuess(event){
    // CLEAR MESSAGE
    msg.textContent = '';

    // UPDATE ALPHABET OPTIONS TO SHOW USER'S GUESS
    var guess = event.key;
    updateAlphabet(guess);

    // CHECK IF USER'S GUESS IS IN WORD
    var wordArr = word.split('');
    var correct = wordArr.indexOf(guess);
    if(correct === -1){
        msg.textContent = "Guess again!"
    } else {
        var indexes = [];
        for(let i = 0; i < wordArr.length; i++){
            if(wordArr[i] === guess){
                indexes.push(i);
            };
        };
        var currWordDisplay = wordEl.textContent.split('')
        for(let j = 0; j < indexes.length; j++){
            currWordDisplay.splice(indexes[j],1,wordArr[indexes[j]]);
        };
        wordEl.textContent = currWordDisplay.join('');
    }
    checkForWin();
}

// UPDATE ALPHABET OPTIONS WITH EACH GUESS
function updateAlphabet(guess){
    var optionsArr = options.split('');
    var index = optionsArr.indexOf(guess.toUpperCase());
    var letterToUpdate = alphaEl.children[index];
    letterToUpdate.setAttribute('style','text-decoration: line-through; color: var(--red)')
}


// IF NO MORE LETTERS LEFT TO GUESS, YOU WIN
function checkForWin(){
    var currWordDisplay = wordEl.textContent.split('');

    if((currWordDisplay.indexOf('_')) === -1){
        msg.textContent = "Great job!"
        result = true;
        wins++;
        localStorage.setItem('wins', wins);
        displayScores();
    } 
}

// RESET SCORES
function resetScores(){
    localStorage.removeItem('wins');
    localStorage.removeItem('losses');
    displayScores();
}

// CLICK EVENT LISTENER TO START GAME
var startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', startGame);

// CLICK EVENT LISTENER TO RESET SCORES
var resetBtn = document.getElementById('reset-scores-btn');
resetBtn.addEventListener('click', resetScores);

// PAGE LOAD
init();
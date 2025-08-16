let gameTextDiv = document.getElementById('gameTextDiv');
let locationText = document.getElementById('locationName');

let backgroundMusic = new Audio('');
backgroundMusic.volume = 0.5; 
backgroundMusic.loop = true;

let img = document.getElementById('testImage');

let clicksound = new Audio('audio/UI/click3.wav');
clicksound.volume = 0.45;

let booksound = new Audio('audio/UI/book.wav');
booksound.volume = 0.45;

let clockSound = new Audio('audio/UI/clock.wav');
clockSound.volume = 0.1;

let deathSound = new Audio('audio/UI/death.mp3');
deathSound.volume = 0.45;

let QTESound = new Audio('audio/UI/qte.mp3');
QTESound.volume = 0.45;

let encounterSound = new Audio('audio/UI/encounter.mp3');
encounterSound.volume = 0.45;

//Prevents refresh on submitting the form (Player Name)
var form = document.getElementById("enterName");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

//The player's name .
let answer = "";

//Number of journal entries found (the two around the map)
let numberFound = 0;

//Number of times the player has survived QTE
let timesSurvived = 0;

let trackedIDPlayer = 0;

let trackedIDMidnight = 0;

let isGameOver = false;

let spriteVisible = false;

let causeOfDeath = "";

let clicked = false;

let flash = false;
const btnOptions = document.getElementById("buttonOptions");

const sprite = document.getElementById("sprite");

var timer;
let remaining = 35;

var totalTimer;
let gameTimer = 0;

var rangeValue = 0 ;

const positions = [];

let currentID = 1;
let midnightMan

var journalBody = document.getElementById("journalContents");
//Accessing the main body of text for the journal
const accessJournal = document.getElementById("journal");
//This is for changing the styling of the journal (border-red to indicate new appended text to journal)

function survivalTimer(){
    return setInterval(() => {
        gameTimer++;
        console.log(gameTimer);
    }, 1000);
}

setInterval(journalStartUp, 999);
function journalStartUp() {
    if (gameTimer == 1) {
    //Stating these timeouts should commence counting down once the game starts (it should say gameTimer = 299, as that's when the game actually starts)
        setTimeout(firstEntry, 30000)
        //Half a minute has passed
        setTimeout(secondEntry, 120000)
        //2 Minutes has passed
        setTimeout(thirdEntry, 180000)
        //3 Minutes has passed
        setTimeout(fourthEntry, 240000)
        //4 Minutes has passed

        //Bell chimes
        setInterval(() => {
            if(gameTimer == 57 || gameTimer == 117 || gameTimer == 177 || gameTimer == 237 || gameTimer == 297){
                clockChime()
            }
        }, 1*1000);
    }
}
function firstEntry() {
    //Adding first timeout piece of text to journal
    journalBody.appendChild(document.createElement("br"));
    journalBody.appendChild(document.createElement("br"));
    var entryOne = document.createTextNode("The first recorded case of this entity dates back to 1834. In a small european village resided Lord Wanton. Deriving joy from inflicting pain on his servants, he was rumoured to have entered a blood contract with a demon. He continued this bloodstained legacy until he suddenly fell ill one night. When his servants saw his vulnerable and weakened state, they took turns stabbing him with any and every sharp object they could find: steak knives, fire pokers, forks and such, until he eventually bled to death. It is believed that this released the demon now known as The Midnight Man.");
    journalBody.appendChild(entryOne);
    accessJournal.style.borderColor = "red";
    }

function secondEntry() {
    //Adding second timeout piece of text to journal
    journalBody.appendChild(document.createElement("br"));
    journalBody.appendChild(document.createElement("br"));
    var entryTwo = document.createTextNode("Bright lights have been found to attract The Midnight Man so don't stay in the entrance hall too long. You might regret it.");
    journalBody.appendChild(entryTwo);
    accessJournal.style.borderColor = "red";
}

function thirdEntry() {
    //Adding third timeout piece of text to journal
    journalBody.appendChild(document.createElement("br"));
    journalBody.appendChild(document.createElement("br"))
    var entryThree = document.createTextNode("The mansion has four levels, some more safe than others.");
    journalBody.appendChild(entryThree);
    accessJournal.style.borderColor = "red";
}

function fourthEntry() {
    //Adding fourth timeout piece of text to journal
    journalBody.appendChild(document.createElement("br"));
    journalBody.appendChild(document.createElement("br"));
    var entryFour = document.createTextNode("It's your fault he's here. Why did you bring him here. What is wrong with you. WHY. WHY. WHY. WH");
    journalBody.appendChild(entryFour);
    accessJournal.style.borderColor = "red";
}

let encounterEntries = ["It is believed that before he takes your life, the last moments of all his previous victims will flash before your eyes, filling your mind until it feels like your head will burst. The acute organ failure that follows is often instantaneous.",
"The Midnight Man's body has two holes in his body, identical to where the first and last strikes impaled Lord Wanton."]
//These are the two possible entries you can earn from surviving the QTE

let whichEntry = "";

//This will generate either 0 or 1 which can be used for the index of the 'encounterEntries' array to add one of the 2 entries to the diary
let firstEntryGenerated = "";
let secondEntryGenerated = "";

function clearArray(array){
    if (array.length == 0){
        console.log("Invalid array")
    } else{
        while(array.length > 0) {
            array.pop();
        }
    }
}

function getPossibleIDs(ID){
    clearArray(positions);
    const node = textNodesArray.find(node => node.id === ID);
    node.optionsArray.forEach(playerOption =>{
        positions.push(playerOption.nextId);
    })  

    console.log(positions);

    if (node.id == currentID && sprite.classList.contains("hide")) {
        sprite.classList.remove("hide");
        console.log("Colision");

    }
    else {
        sprite.classList.add("hide");
        console.log("Not collided");
    }

}

function getCoinFlip() {
    let url = 'http://andymcdowell.hosting.hal.davecutting.uk/1030_APIs/coinFlip.php';
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            sideLanded = data.coinFlip;
            console.log(sideLanded)
            return sideLanded;
        })
        .catch(function(error) {
            return `Error: ${error}`;
        }
        );
}
    
const rangeDiceResult = [1]; // This array is used to store values from the Dice Roll with Inputs API to use for the midnight man's AI.

const diceResult = []; // This array is used to store values from the regular Dice Roll API to use to trigger random events.

function getDiceRoll(){
    let url = 'http://andymcdowell.hosting.hal.davecutting.uk/1030_APIs/diceroll.php';
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                diceResult.pop();
                diceResult.push(data);
            })
            .catch(function(error) {
                return `Error: ${error}`;
            }
        );
}

function diceRollRange(max){
    console.log("Max value : "+ max);
    if (max == 1){
        rangeDiceResult.pop()
        rangeDiceResult.push(1);
    }
    else{
        let url = 'http://andymcdowell.hosting.hal.davecutting.uk/1030_APIs/diceRollWithInputs.php?diceFaceNumber=' + max + '&diceNumber=1';
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                rangeDiceResult.pop()
                rangeDiceResult.push(data[0].result);
                
            })
            .catch(function(error) {
                return `Error: ${error}`;
            }
            );
    }
    // One major issue I noticed with the API is that it sometimes returned numbers that were outside of the range I gave it
    // For example, if the max number was 2, meaning it had to generate a number between 1 and 2, it would sometime return 3
    // This causes the Midnight Man to break completely.
    // The code below checks if such an instance has occurred and overrules the number with a random number generator instead.
    if (rangeDiceResult[0] > max){
        console.log("There is an error!!");
        rangeDiceResult.pop()
        rangeDiceResult.push(Math.floor(Math.random() * max) + 1)
    }
};

function killPlayer() {
    if (trackedIDPlayer == trackedIDMidnight) {
        causeOfDeath = "The Midnight Man found you";
        console.log("GAMEOVER!");
        gameOver();
    }
}

function checkIDs(playerID, midnightID){

    console.log("PlayerID : "+ playerID +" , " + "MidnightID : " + midnightID);

    if (playerID == midnightID && sprite.classList.contains("hide") && gameTimer > 30) {
        sprite.classList.remove("hide");
        spriteVisible = true;
        console.log("appears")

    }
    else {
        sprite.classList.add("hide");
        spriteVisible = false;
    }

    trackedIDPlayer = playerID;
    trackedIDMidnight = midnightID;

    checkSprite = document.getElementById("sprite");

    if (playerID == midnightID && gameTimer > 30 && spriteVisible){
        encounterSound.play();
        locName = document.getElementById("locationName");
        locName.classList.add("shakeup");
        setTimeout(killPlayer(), 5*1000);
    }
    else{
        locName.classList.remove("shakeup");
    }
}

function startHunt(){
    return setInterval(function(){
        getPossibleIDs(midnightMan);
        diceRollRange(positions.length);
        console.log(rangeDiceResult[0])
        value = rangeDiceResult[0]
        midnightMan = positions[value-1];
        checkIDs(currentID, midnightMan);
    },7*1000);
}

function randomEvent(){
    return setInterval(() => {
        getDiceRoll();
        console.log("diceResult : " + diceResult[0])
        if (diceResult[0] == 6){
            QTEpopup();
        }
    }, 20*1000);
}

var huntAI;
var gametime;
var testing

function gameStart() {
    answer = document.getElementById("playerName").value;
    let length = answer.length;
    //Checking the input is not empty
    if (length > 0) {
        //Hide the game start screen to begin gameplay
        const removeScreen = document.querySelectorAll(".bg-img");
        for (let i = 0; i < removeScreen.length; i++) {
            removeScreen[i].classList.add("hide");
        }

    }

}
function restartGame() {
    window.location.reload();
}

function gameOver(){
    isGameOver = true;
    deathSound.play();
    
    clearInterval(huntAI);
    clearInterval(testing);
    stopTimer();
    clearInterval(gametime);
    
    const removeImages = document.querySelectorAll(".images");
    for (let i = 0; i < removeImages.length; i++) {
        removeImages[i].classList.add("hide");
    }
    const removeText = document.querySelectorAll(".text");
    for (let i = 0; i < removeText.length; i++) {
        removeText[i].classList.add("hide");
    }

    const form = document.getElementById("enterName");
    form.classList.add("hide")

    const showGame = document.getElementById("indexed");
    showGame.style="background-image: url(Images/GameOver.jpg)";
    showGame.classList.remove("hide")

    const survivalTime = document.getElementById("youDied");
    survivalTime.classList.remove("hide")
    minutes = convertToMin(gameTimer);
    seconds = convertToSec(minutes, gameTimer);
    if (gameTimer < 60){
        survivalTime.innerHTML = "You survived for "+ gameTimer + " seconds. ";
    }
    else if(gameTimer > 60 && gameTimer < 120){
        survivalTime.innerHTML = "You survived for "+ minutes + " minute and " + seconds + " seconds. ";
    }
    else{
        survivalTime.innerHTML = "You survived for "+ minutes + " minutes and " + seconds + " seconds. ";
    }
    const causeOfD = document.getElementById("causeOf");
    causeOfD.classList.remove("hide")
    causeOfD.innerHTML = "Cause of death: "+ (causeOfDeath);

    const roundStatistics = document.getElementById("stats");
    roundStatistics.classList.remove("hide")
    roundStatistics.innerHTML = "Journal entries found: " + numberFound + "/2" + "<br/>" + "Events Survived: "+timesSurvived;

    const betterLuck = document.getElementById("message");
    betterLuck.classList.remove("hide")
    betterLuck.innerHTML = "Better luck next time, "+ answer;

    const retryButton = document.getElementById("restartGame");
    retryButton.classList.remove("hide")

}
function gameComplete() {
    clearInterval(huntAI);
    clearInterval(testing);
    stopTimer();
    clearInterval(gametime);
        const removeImages = document.querySelectorAll(".images");
        for (let i = 0; i < removeImages.length; i++) {
            removeImages[i].classList.add("hide");
        }
    const removeText = document.querySelectorAll(".text");
        for (let i = 0; i < removeText.length; i++) {
            removeText[i].classList.add("hide");
        }
        btnOptions.style.display = "none";

        const form = document.getElementById("enterName");
        form.classList.add("hide")
    
        const showGame = document.getElementById("indexed");
        showGame.style="background-image: url(Images/GameComplete.jpg)";
        showGame.classList.remove("hide")
    
        const roundStatistics = document.getElementById("stats");
        roundStatistics.classList.remove("hide")
        roundStatistics.innerHTML = "Journal entries found: " + numberFound + "/2" + "<br/>" + "Events Survived: "+timesSurvived;
    
        const completeMessage = document.getElementById("message");
        completeMessage.classList.remove("hide")
        completeMessage.innerHTML = "Until next time, "+ answer;
    
}

function clockChime() {
    clockSound.play();
}

function pause(){
    stopTimer();
    clearInterval(huntAI);
    clearInterval(gametime);
    clearInterval(testing);
    console.log("PAUSE");
    
}

function pauseQTE() {
    //timer still runs for QTE
    clearInterval(huntAI);
    console.log("PAUSE");
}

function resumeQTE(){
    huntAI = startHunt();
    console.log("RESUME");    
}

function resume(){
    startTimer();
    huntAI = startHunt();
    gametime = survivalTimer();
    testing = randomEvent();
    console.log("RESUME");    
}

function convertToMin(time){
    let minute = time / 60; 
    let min = minute.toString().split(".")[0]
    min = parseInt(min);
    return min;
}

function convertToSec(min, time){
    return (time - (60 * min)); 
}

function stopTimer(){
    clearInterval(timer);
    remaining = 40;
}

function startTimer(){
    timer = setInterval('countdown()',1000);
}

function countdown(){
    remaining--;
    // console.log(remaining);

    if(remaining <= 0){
        console.log("Dead");
        causeOfDeath = "You went insane from staying in the same room for too long";
        stopTimer();
        gameOver();
    } else if(remaining == 25){
        // Print first warning message
    } else if(remaining == 15){
        // Print second warning message
        // Distortion Effects
    } else if(remaining == 5){
        // Print final warning message
        // Sound Effects
    }
}

function timerEvent(){
    stopTimer();
    startTimer();
}

function endQTE() {
    let whichFlip = getCoinFlip();
    console.log(whichFlip)
    if (whichFlip = "Tails") {
        whichEntry = 0;

    }
    if (whichFlip = "Heads") {
        whichEntry = 1;
    }
    console.log(whichEntry)
    var modal = document.getElementById("QTEModal");
    modal.classList.add("hide");
    if (firstEntryGenerated != "") {
        //If there is already a first entry
        if (secondEntryGenerated == "") {
        //If there is not a second entry yet...
            if (whichEntry == 1) {
                console.log("It was 1")
                //So we need to append the entry of index position '0'
                journalBody.appendChild(document.createElement("br"));
                whichEntry = 0;
                const consideredEntryA = document.createTextNode(encounterEntries[whichEntry]);
                journalBody.appendChild(document.createElement("br"));
                journalBody.appendChild(consideredEntryA)
                accessJournal.style.borderColor = "red";
                secondEntryGenerated = "appended";
        
            }
            else if (whichEntry == 0) {
                console.log("It was 0")
                //So we need to append the entry of index position '1'
                journalBody.appendChild(document.createElement("br"));
                whichEntry = 1;
                const consideredEntryB = document.createTextNode(encounterEntries[whichEntry]);
                journalBody.appendChild(document.createElement("br"));
                journalBody.appendChild(consideredEntryB)
                accessJournal.style.borderColor = "red";
                secondEntryGenerated = "appended";
            }
        }
    }
        else {
            console.log("No first entry")
            console.log(whichEntry)
            journalBody.appendChild(document.createElement("br"));
            randomEntry = document.createTextNode(encounterEntries[whichEntry]);
            journalBody.appendChild(document.createElement("br"));
            journalBody.appendChild(randomEntry)
            accessJournal.style.borderColor = "red";
            firstEntryGenerated = "appended";
        }
}

function QTEpopup() {
    
    pause();
    QTESound.play();

    var modal = document.getElementById("QTEModal");
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
        let finished = false;
        let timeEnded = false;
        let placeLetter = document.getElementById("letter");
        let playerLetter = document.getElementById("correspond");
        let sym = document.getElementById("sym");
        const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        const letters = [];

        for(let i = 0; i < Math.floor(Math.random() *9)+6; i++){
            letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }

        // document.getElementById("list").innerHTML = letters;

        let pointer = 0;
        console.log(letters.length)
        placeLetter.innerHTML = letters[pointer];

        window.addEventListener("keydown", validate)

        setTimeout(function(){
                if(!finished){
                    timeEnded = true;
                    placeLetter.innerHTML = "Dead";
                    causeOfDeath = "Failed Quick-Time-Event";
                    var modal = document.getElementById("QTEModal");
                    modal.remove();
                    gameOver();
                }
            },7*1500)

        function validate(){
            let userInput = event.key.toUpperCase();
            // playerLetter.innerHTML = userInput;
            
            if(finished){
                console.log("I GOT HERE");
                timesSurvived += 1;
            }
            else if(timeEnded){
                placeLetter.innerHTML = "Dead";
            }
            else{
                // playerLetter.innerHTML = pointer + 1 + " " + letters.length;
                if(pointer+1 == letters.length && userInput == letters[letters.length - 1]){
                    placeLetter.innerHTML = "You survived...this time";
                    setTimeout(endQTE, 2500);
                    resume();
                    finished = true;
                }
                else{
                    if(userInput == letters[pointer]){
                        pointer++;
                        placeLetter.innerHTML = letters[pointer];
                    }
                    else{
                        pointer = 0;
                        placeLetter.innerHTML = letters[pointer];
                    }
                }
            }
        }


    // TIMERS

    // A simple countdown timer that the user has to complete the QTE withing (maybe 5 - 7 seconds?)
    // An internal countdown timer that the user has to enter the right key in otherwise it sets the user back to the start (0.75 - 1 seconds?)
    // A bar underneath the letter indicates how much time the user has to press a key
}


function toggleFlash() {
    if (!flash) {
        //do something
    }
}

function toggleText1() {
    if(!clicked){
        clicksound.play();
        document.getElementById("gameTextDiv").style.display="none"; //Making the first piece of text hidden
        document.getElementById('text2').style.display='block'; //Showing the second piece of text in its place
        clicked = true;
    }}

function toggleText2() {
    clicked = false;
    if(!clicked){
        clicksound.play();
        document.getElementById('text2').style.display="none"; //Making the second piece of text hidden
        document.getElementById('text3').style.display='block'; //Showing the third piece of text in its place
        clicked = true;
    }}

function startGame(){
    document.getElementById('text3').style.display="none"; //Making the last piece of text hidden
    document.getElementById('gameTextDiv').style.display="block";
    clicksound.play();
    showNode(currentID);
    gametime = survivalTimer();
    setTimeout(() => {
        midnightMan = 19;
        huntAI = startHunt();
        testing = randomEvent();
    }, 30*1000);
}

let journalClick = false;

function openJournal() {
    accessJournal.style.borderColor = "";
    pause();
    journalClick = false;
    if (!journalClick) { // I changed all the "== false" to be "!" for simplicity. 
    booksound.play();
    const addJournal = document.querySelectorAll(".overlay");
        for (let i = 0; i < addJournal.length; i++) {
            addJournal[i].classList.remove("hide");
        }
    document.getElementById('testImage').classList.add('hide');
    document.getElementById('locationName').classList.add('hide');
    document.getElementById('flashlight').classList.add('hide');
    const removeImages = document.querySelectorAll(".images");
        for (let i = 0; i < removeImages.length; i++) {
            removeImages[i].classList.add("hide");
        }
    const removeText = document.querySelectorAll(".text");
        for (let i = 0; i < removeText.length; i++) {
            removeText[i].classList.add("hide");
        }
    const removeButtons = document.querySelectorAll(".buttonLayout");
        for (let i = 0; i < removeButtons.length; i++) {
            removeButtons[i].classList.add("hide");
        }
    }
    journalClick = true;
}

function closeJournal() {
    resume();
    journalClick = false;
    if (!journalClick) {
    booksound.play();
    const removeJournal = document.querySelectorAll(".overlay");
    for (let i = 0; i < removeJournal.length; i++) {
        removeJournal[i].classList.add("hide");
    }

    document.getElementById('testImage').classList.remove('hide');
    document.getElementById('locationName').classList.remove('hide');
    document.getElementById('flashlight').classList.remove('hide');

    const addImages = document.querySelectorAll(".images");
        for (let i = 0; i < addImages.length; i++) {
            addImages[i].classList.remove("hide");
        }
    const addText = document.querySelectorAll(".text");
        for (let i = 0; i < addText.length; i++) {
            addText[i].classList.remove("hide");
        }
    const addButtons = document.querySelectorAll(".buttonLayout");
        for (let i = 0; i < addButtons.length; i++) {
            addButtons[i].classList.remove("hide");
        }
    }
    journalClick = true;
}


function showNode(nodePointer){
    const currentNode = textNodesArray.find(currentNode => currentNode.id === nodePointer);
    gameTextDiv.innerText = currentNode.text;
    locationText.innerText = currentNode.locat;
    img.src = currentNode.imagesrc;
    
    currentID = currentNode.id;
    // console.log(currentID);

    let previousBgMusic = backgroundMusic.src;

    let splitted = previousBgMusic.split("Code/");
    if (splitted.length > 1 && splitted[1]) {
        previousBgMusic = splitted[1].replace("%20"," ");
    } else {
        previousBgMusic = "";
    }

    /**
     * This is basically a way of formating the file path so that it is the same as the file path as currentNode.music
     * currentNode stores audio file sources as simply "audio/..."
     * but the storing the actual src as a variable gives the entire file name in the drive e.g "file:////C:/Users/..."
     * It splits the string by The 27/ in the folder name Group 27 - So if we ever change the main folder's name - remember to change the .split as well,
     * After splitting it then replaces and %20 in the file name to be a simple space.
     */
    
    let nextBgMusic = currentNode.music;

    if(previousBgMusic != nextBgMusic){
        backgroundMusic.src = nextBgMusic;
        backgroundMusic.play();
        /**
         * This is a way of having it so the same audio continues throughout instead of restarting at the beginning whenever the player
         * enter a new room. Basically it checks if the audio from the previous room is the same as the next room, if it isn't then it makes
         * the audio src the same as the next room and plays it. This is why the formatting above was needed.
         * - Sam
         */
    }
    while(btnOptions.firstChild){
        btnOptions.removeChild(btnOptions.firstChild);
    }

    currentNode.optionsArray.forEach(playerOption => {
        if (showOption(playerOption)){
            const button = document.createElement("button");
            button.innerText = playerOption.text;
            button.classList.add("btn");
            button.addEventListener("click",() => selectOption(playerOption));
            btnOptions.appendChild(button);
        }
    })
}

function delay(amount) {
    return new Promise(resolve => setTimeout(resolve, amount));
}

function showOption(playerOption){
    return true;
}

function selectOption(playerOption){
    clicksound.play();
    document.body.style.animation="fadeout 0.5s forwards";
    const nextNode = playerOption.nextId;
    delay(1000).then(() => showNode(nextNode));
    delay(1000).then(() => document.body.style.animation="fadein 0.5s forwards");
    timerEvent(); // Initialises the countdown to prevent the user from staying in the same room for too long.
}


let mouseX = 0;
let mouseY = 0;
let flashlight = document.getElementById("flashlight");

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

function getMousePosition(e) {
    mouseX = !isTouchDevice() ? e.pageX : e.touches[0].pageX;
    mouseY = !isTouchDevice() ? e.pageY : e.touches[0].pageY;
    flashlight.style.setProperty("--Xpos", (mouseX-200) + "px");
    flashlight.style.setProperty("--Ypos", mouseY + "px");
}

document.addEventListener("mousemove", getMousePosition);
document.addEventListener("touchmove", getMousePosition);

setInterval(startUp, 999);
function startUp() {

if (gameTimer == 1) {
    //Basically occurs once the game starts
    setInterval(masterEntry, 1000)
    setTimeout(wipeJournal, 1500)
    }
}

setInterval(() => {
    if (gameTimer >= 300){
        gameComplete();
    }
}, 1*1000);

//Validations to ensure the player only takes the journal entries once
let onceOnly = false;
let onceOnly2 = false;

    function masterEntry() {
        if (currentID == "21" && !onceOnly) {
        //Checks if the user has checked under the bed in the master bedroom for the journal entry
            journalBody.appendChild(document.createElement("br"));
            journalBody.appendChild(document.createElement("br"));
            var masterBedroomNote = document.createTextNode("The Midnight Man does not have a physical body, consequently making physical attacks uneffective. Unlike his counterpart, he cannot be stabbed to death.");
            journalBody.appendChild(masterBedroomNote);
            accessJournal.style.borderColor = "red";
            currentID = 11;
            onceOnly = true;
            numberFound += 1;
        }
        if (currentID == "22" && !onceOnly2) {
            //Checks if the user has checked the cellar for the journal entry
                    journalBody.appendChild(document.createElement("br"));
                    journalBody.appendChild(document.createElement("br"));
                    var cellarNote = document.createTextNode("333 - Let your personal strength be the guide.");
                    journalBody.appendChild(cellarNote);
                    accessJournal.style.borderColor = "red";
                    currentID = 8;
                    onceOnly2 = true;
                    numberFound += 1;
        }
    }

function wipeJournal() {
    //Clears journal continues 15 seconds into the game
        journalBody.innerHTML = "";
    }


const textNodesArray = [
    {
        id : 1, 
        text: "The interior appeared almost offensively lavish, having recently been refurbished, this room's modernised furniture sticks out like a sore thumb. What was I thinking?",
        locat: "Entrance Hall",
        imagesrc: "images/entrance.jpg",
        music: "audio/BGM/Doll Dancing.mp3",
        optionsArray: [
            {
                text: "Enter Dining Room on the Left",
                nextId : 2
            },
            {
                text: "Enter Study on the Right",
                nextId : 5
            },
            {
                text: "Walk up the Stairs",
                nextId : 9
            },
            {
                text: "Enter the Ballroom",
                nextId : 7
            }
        ]
    },
    {
        id: 2,
        text: "Greeted by the various shades of brown, the dining room always remains neat and tidy, with cutlery and crockery ready prepared for dinners of up to 12 guests. There's something unsettling about so many empty chairs. ",
        locat: "Dining Room",
        imagesrc: "images/dining.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Return to Entrance Hall",
                nextId : 1 
            },
            {
                text: "Enter Kitchen",
                nextId : 3
            }

        ]
    },
    {
        id: 3,
        text: "I suppose if I ever need a pan or knife to defend myself, I have quite a few options to choose from. Although, if it comes down to it, I think I'd rather run than try fight them.",
        locat: "Kitchen",
        imagesrc: "images/kitchen.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Enter the Dining Room",
                nextId: 2
            },
            {
                text: "Walk into the Cold Room",
                nextId : 4
            },
            {
                text: "Go down into the Cellar",
                nextId : 8
            },
            {
                text: "Return to Entrance Hall",
                nextId: 1
            }

        ]
    },
    {
        id: 4,
        text: "Sometimes I forget this room exists, nowadays if I want to store meat or anything I just use the fridge freezer. I wouldn't want to be stuck in here with that creature though, there's only one way in and out of this room.",
        locat: "Cold Room",
        imagesrc: "images/cold.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Return to Kitchen",
                nextId: 3
            }
        ]
    },
    {
        id: 5,
        text: "Despite being a researcher of sorts, I never found myself working in this room. In hindsight, having the lounge right beside my study wasn't the smartest of ideas.",
        locat: "Study",
        imagesrc: "images/study.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Enter the Entrance Hall",
                nextId: 1
            },
            {
                text: "Enter the Lounge",
                nextId : 6
            }
        ]
    },
    {
        id: 6,
        text: "Perhaps indolent of me to say, but the lounge was always my favourite room. So many memories with so many good friends and acquaintances. I hope I can get out of this alive, to have one more drink with them.",
        locat: "Lounge",
        imagesrc: "images/lounge.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Enter the Entrance Hall",
                nextId: 1
            },
            {
                text: "Enter The Study",
                nextId : 5
            },
            {
                text: "Enter the Ballroom",
                nextId : 7
            }

        ]
    },
    {
        id: 7,
        text: "There was a lot of potential for parties and soirees in this room, sadly none were realised. I just couldn't bring myself to repurpose an authentic victorian ballroom. The novelty of it was and remains to be a good icebreaker for inviting friends over.",
        locat: "Ballroom",
        imagesrc: "images/ballroom.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Enter the Entrance Hall",
                nextId: 1
            },
            {
                text: "Enter the Lounge",
                nextId : 6
            }
        ]
    },
    {
        id: 8,
        text: "I shouldn't stay here for long, it might just be the darkness but something about being down here really frightens me...",
        locat: "Cellar",
        imagesrc: "images/cellar.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Return to the Kitchen",
                nextId : 3
            },
            {
                text: "Look around",
                nextId: 22
            }
        ]
    },
    // UPSTAIRS
    {
        id: 9,
        text: "If I saw that figure down this hallway I might pass out from fear, this hallway connects to so many rooms such that staying here much longer doesn't feel very safe.",
        locat: "Upstairs Hallway",
        imagesrc: "images/hallway.jpg" ,
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Downstairs",
                nextId: 1
            },
            {
                text: "Walk down the Hallway",
                nextId: 10
            },
            {
                text: "Enter the Master Bedroom on the left",
                nextId: 11
            },
            {
                text: "Enter the Nursery on the right",
                nextId: 13
            },
            {
                text: "Enter the First Bedroom on the right",
                nextId: 14
            }
        ]
    },
    {
        id: 10,
        text: "It's very dark down here but I can roughly see the two seperate corridors spanning on both sides. To be honest, I don't spend much time here myself, that is of course unless I have guests over.",
        locat: "End of Hallway",
        imagesrc: "images/hallwayend.jpg" ,
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 9
            },
            {
                text: "Enter the Storage Room on the right",
                nextId: 15
            },
            {
                text: "Enter the Guest Bedroom on the right",
                nextId: 16
            },
            {
                text: "Enter the Second Bedroom on the left",
                nextId: 17
            },
            {
                text: "Enter the Bathroom on the left",
                nextId: 18
            }
        ]
    },
    {
        id: 11,
        text: "There's a comfort in being back in my room. If I remember correctly, there's some notes on The Midnight Man around here somewhere...",
        locat: "Master Bedroom", 
        imagesrc: "images/masterbedroom.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 9
            },
            {
                text: "Enter the Ensuite Bathroom",
                nextId: 12
            },
            {

                text: "Open the drawers",
                nextId: 20
            },
            {
                text: "Look under the bed",
                nextId: 21
            }
            
        ]
    },
    {
        id: 12,
        text: "I jumped so high when I saw the pale figure in the mirror, and even moreso when they jumped back in return. I realise now it was just my reflection. My face is deathly pale, but I guess that makes sense, giving the circumstanes.",
        locat: "Ensuite Bathroom",
        imagesrc: "images/ensuite.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 11
            }
        ]
    },
    {
        id: 13,
        text: "I don't feel comfortable thinking about this room.",
        locat: "Nursery",
        imagesrc: "images/nursery.jpg", 
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 9
            },
            {
                text: "Enter the Attic",
                nextId: 19
            }
        ]
    },
    {
        id: 14,
        text: "The more tattered of the two spare bedrooms, I decided to keep the tattered vintage aesthetic for novelty purposes, however, in this darkness it is very unsettling.",
        locat: "Bedroom 1",
        imagesrc: "images/bedroom1.jpg", 
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 9
            }
        ]
    },
    {
        id: 15,
        text: "The original owner of this mansion had stored countless documents here, and despite taking weeks to fully sort through and clear out this room, I never ended up storing many things in it. The documents were quite interesting of a read though.",
        locat: "Storage Room",
        imagesrc: "images/storage.jpg", 
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 10
            }
        ]
    },
    {
        id: 16,
        text: "Glancing out the window only to be met by the looming abyss of night. It is definitely the witching hour.",
        locat: "Guest Bedroom",
        imagesrc: "images/guestbedroom.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 10
            }
        ]
    },
    {
        id: 17,
        text: "The nicer bedroom of the two spare ones, I must admit, I have slept here several nights instead of my own bedroom. I enjoy a change of scenery since I stay cooped up in this mansion for most of my time.",
        locat: "Bedroom 2",
        imagesrc: "images/bedroom2.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 10
            }
        ]
    },
    {
        id: 18,
        text: "The temperature in this room seems to be several degrees colder than the others. I can feel a shiver down my spine, however that might just be my fear. I think I've had goosebumps this entire time. ",
        locat: "Bathroom",
        imagesrc: "images/bathroom.jpg", 
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 10
            }
        ]
    },
    {
        id: 19,
        text: "I feel a sense of vulnerability, being in a room with only one exit and entrance. I don't think I should stay here much longer.",
        locat: "Attic",
        imagesrc: "images/attic.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go Back",
                nextId: 13
            }
        ]
    },
    {
        id: 20,
        text: "You open up the drawers...what you're looking for is not here.",
        locat: "Master Bedroom",
        imagesrc: "images/masterbedroom.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Close Drawers",
                nextId: 11
            }
        ]
    },
    {
        id: 21,
        text: "You crawled down and checked under the bed...out of the corner of your eye you see a piece of paper",
        locat: "Master Bedroom",
        imagesrc: "images/masterbedroom.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
            text: "Get up from under the bed",
            nextId: 11
            }
        ]
    },
    {
        id: 22,
        text: "You start scanning the ground with your eyes...out of the corner of your eye, you see a piece of paper",
        locat: "Cellar",
        imagesrc: "images/cellar.jpg",
        music: "audio/BGM/The Dread.mp3",
        optionsArray: [
            {
                text: "Go back to the entrance",
                nextId: 8
            }
        ]
    }
];

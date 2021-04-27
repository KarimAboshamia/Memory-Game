/*jshint esversion: 6 */
let cards = document.querySelectorAll(".card");
let holdCards = [...cards];
let deck = document.querySelector(".deck");
let activeCards = [];
let movesCounter = 0;
const rating = document.querySelectorAll(".fa-star");
let numberOfStars = 3;
let second = 0;
let minute = 0;
let timer = document.querySelector(".timer");
let interval;

//Shuffle cards
function cardsShuffler() {
    shuffle(holdCards);
    holdCards.forEach(function(elem) {
        deck.append(elem);
    });
}

//Reset page when restart button is clicked
document.querySelector('.restart').onclick = function() {
    window.location.reload();
};

//Open cards when it's called and functions are applied to them
function cardsOpener() {
    for (var i = 0; i < cards.length; i += 1) {
        cards[i].onclick = function() {
            matcher(this);
        };
    }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Specficy when to call displayer and opened
function matcher(card) {
    if (clicked(card)) {
        return;
    }
    displayer(card);
    opened(card);
}

//Specify when to add moves and when not
function clicked(card) {
    if (card.classList.contains("show") || card.classList.contains("open")) {
        return true;
    }
    return false;
}

// Add specific classes when card is clicked
function displayer(card) {
    card.classList.add("open");
    card.classList.add("show");
}

// handle number of moves, stars and start timer when click event occur
function movesHandler() {
    movesCounter++;
    if (movesCounter === 1) {
        document.querySelector(".checker").innerHTML = "Move";
        document.querySelector(".moves").innerHTML = movesCounter;
    } else {
        document.querySelector(".moves").innerHTML = movesCounter;
        document.querySelector(".checker").innerHTML = "Moves";
    }
    if (movesCounter > 30 && movesCounter < 32) {
        for (var i = 0; i < 3; i++) {
            if (i > 1) {
                rating[i].style.visibility = "hidden";
            }
        }
        numberOfStars = 2;
    } else if (movesCounter > 40) {
        for (var x = 0; x < 3; x++) {
            if (x > 0) {
                rating[x].style.visibility = "hidden";
            }
        }
        numberOfStars = 1;
    }
}

// startTimer from : https://scotch.io/tutorials/how-to-build-a-memory-matching-game-in-javascript#5-the-timer
function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = minute + "mins " + second + "secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
    }, 1000);
}

// check if cards is matched or not
function isMatch(activeCards) {
    let con0 = activeCards[0].innerHTML != activeCards[1].innerHTML;
    let con1 = activeCards[0].isSameNode(activeCards[1]);
    if (con0 || con1) {
        return false;
    }
    return true;
}

//if cards is matched add specific class(es)
function matched(activeCards) {
    for (var i = 0; i < activeCards.length; i++) {
        activeCards[i].classList.add("match");
        activeCards[i].classList.add("animated");
        activeCards[i].classList.add("flip");
    }
}

//if cards is notmatched remove specific class(es)
function notMatched(activeCards) {
    for (var i = 0; i < activeCards.length; i++) {
        activeCards[i].classList.add("wrong");
        activeCards[i].classList.add("animated");
        activeCards[i].classList.add("flash");
    }
    setTimeout(function() {
        for (var i = 0; i < activeCards.length; i++) {
            activeCards[i].classList.remove("open");
            activeCards[i].classList.remove("show");
            activeCards[i].classList.remove("wrong");
            activeCards[i].classList.remove("animated");
            activeCards[i].classList.remove("flash");
        }
    }, 500);
}

//Main function that control all another functions
function opened(card) {
    if (activeCards.length > 0) {
        movesHandler();
        displayer(card);
        activeCards.push(card);
        if (isMatch(activeCards)) {
            matched(activeCards);
            activeCards = [];
        } else {
            notMatched(activeCards);
            activeCards = [];
        }
    } else {
        activeCards.push(card);
        movesHandler();
    }
    allMatched();
}

function allMatched() {
    let all = true;
    $('.card').each(function() {
        all = $(this).hasClass("match");
        return all;
    });
    if (all) {
        sweetAlert();
        stopTimer();
    }
}

//function to stop the timer when the player wins
function stopTimer() {
    timer.innerHTML = timer.innerHTML;
    clearInterval(interval);
}

//This function is used from https://sweetalert2.github.io/ to show winning message
function sweetAlert() {
    swal({
        title: 'Congratulations',
        text: movesCounter + ' moves ' + ' and ' + numberOfStars + ' Star(s) ' + ' in ' + timer.innerHTML,
        animation: false,
        customClass: 'animated bounceInDown',
        confirmButtonText: 'Play again'
    }).then((result) => {
        if (result.value) {
            window.location.reload();
        }
    });
}

startTimer();
cardsShuffler();
cardsOpener();

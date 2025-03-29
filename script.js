    const buttons = document.querySelectorAll(".game-button");
    const resetButton = document.querySelector(".reset-button");
    const decisionElem = document.querySelector(".decision");
    const picksElem = document.querySelector(".picks");
    const resultsElem = document.querySelector(".results");
    const autoplayElem = document.querySelector(".autoplay-button");
    let bodyElem = document.querySelector('body')
    
    let isAuto = false;
    let autoPlayInterval;

    let sessionResults = JSON.parse(localStorage.getItem("sessionResults")) || { win: 0, lose: 0, tie: 0 };
    updateResults();

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            computeResult(button.dataset.choice);
        });
    });
    autoplayElem.addEventListener("click", autoPlay);
    resetButton.addEventListener("click", resetScore);
    bodyElem.addEventListener('keydown', hotKeysAction)


    function computeResult(playerGuess) {
        const choices = ["rock", "paper", "scissors"];
        const compGuess = choices[Math.floor(Math.random() * choices.length)];

        picksElem.innerText = `Player: ${playerGuess} VS Computer: ${compGuess}`;

        let result;
        if (compGuess === playerGuess) {
            result = "tie";
        } else if (
            (playerGuess === "rock" && compGuess === "scissors") ||
            (playerGuess === "paper" && compGuess === "rock") ||
            (playerGuess === "scissors" && compGuess === "paper")
        ) {
            result = "win";
        } else {
            result = "lose";
        }

        sessionResults[result]++;
        localStorage.setItem("sessionResults", JSON.stringify(sessionResults));
        updateResults(result);
    }

    function updateResults(result = null) {
        resultsElem.innerText = `Wins: ${sessionResults.win} | Losses: ${sessionResults.lose} | Ties: ${sessionResults.tie}`;
        if (result) {
            decisionElem.innerText = result === "win" ? "Victory! 🏆" : result === "lose" ? "You Lose... 😢" : "It’s a Tie! 🤝";
        }
    }

    function resetScore() {
        let confirmDesicion = confirm('Do you really want to reset your stats?')
        if (confirmDesicion) {
            sessionResults = { win: 0, lose: 0, tie: 0 };
            localStorage.setItem("sessionResults", JSON.stringify(sessionResults));
            updateResults();
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval)
                autoplayElem.innerText = "Autoplay";
            }
            decisionElem.innerText = "";
            picksElem.innerText = "";
        } else {
            return
        }

    }
    
    function autoPlay() {
        if (isAuto) {
            autoplayElem.innerText = "Autoplay"
            clearInterval(autoPlayInterval)
            isAuto = false
            return
        }
        
        autoplayElem.innerText = "Stop";
        autoPlayInterval = setInterval(() => {
            const choices = ["rock", "paper", "scissors"];
            const compGuess = choices[Math.floor(Math.random() * choices.length)];
            computeResult(compGuess)
        }, 1000);
        isAuto = true
    }
  
     function hotKeysAction(event) {
        if (event.key === 'r' && isAuto === false) {
            computeResult('rock');
        } else if (event.key === 'p' && isAuto === false) {
            computeResult('paper');
        }
         else if (event.key === 's' && isAuto === false) {
            computeResult('scissors');
        } else if (event.key === 'a') {
            autoPlay()
        } else if (event.key ==='Backspace'){
            resetScore()
        }
    }
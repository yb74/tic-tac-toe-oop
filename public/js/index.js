class TicTacToe {
    constructor() {
        this.count = 0;
        this.gameover = false;
        this.reset = false;

        // players creation
        this.player1 = new Player("Younes", "circle");
        this.player2 = new Player("Ali", "cross");

        console.log(`Player 1 : name = ${this.player1.playerName}, number of victory = ${this.player1.victory}`);
        console.log(`Player 2 : name = ${this.player2.playerName}, number of victory = ${this.player2.victory}`);

        document.getElementById("player-name-turn-text").textContent = this.player1.playerName;
        document.getElementById("p1-name-stats-box").textContent = this.player1.playerName;
        document.getElementById("p2-name-stats-box").textContent = this.player2.playerName;
        
        // modal
        this.modalElt = document.getElementById("modal");

        // stats p1
        this.p1_victoryElt = document.getElementById("p1-won-games");
        this.p1_DefeatElt = document.getElementById("p1-lost-games");

        // stats p2
        this.p2_victoryElt = document.getElementById("p2-won-games");
        this.p2_DefeatElt = document.getElementById("p2-lost-games");

        // Stocking columns, lines and diagonals' ID in an array
        this.line1 = ["box-1a", "box-1b", "box-1c"];
        this.line2 = ["box-2a", "box-2b", "box-2c"];
        this.line3 = ["box-3a", "box-3b", "box-3c"];

        this.column1 = ["box-1a", "box-2a", "box-3a"];
        this.column2 = ["box-1b", "box-2b", "box-3b"];
        this.column3 = ["box-1c", "box-2c", "box-3c"];

        this.diagonale1 = ["box-1a", "box-2b", "box-3c"];
        this.diagonale2 = ["box-1c", "box-2b", "box-3a"];

        // boxes
        this.box1a = document.getElementById("box-1a");
        this.box1b = document.getElementById("box-1b");
        this.box1c = document.getElementById("box-1c");

        this.box2a = document.getElementById("box-2a");
        this.box2b = document.getElementById("box-2b");
        this.box2c = document.getElementById("box-2c");

        this.box3a = document.getElementById("box-3a");
        this.box3b = document.getElementById("box-3b");
        this.box3c = document.getElementById("box-3c");

        // player turn text
        this.playerNameText = document.getElementById("player-name-turn-text");
        
        // document.querySelectorAll('.boxes').forEach(box => box.addEventListener('click', this.handleBoxClick));
        document.querySelectorAll('.boxes').forEach(box => box.addEventListener('click', this.clickBox));

        document.getElementById("modal-button-playAgain").addEventListener("click", this.restart);
        document.getElementById("modal-button-resetScore").addEventListener("click", this.resetScore);
    }

    // function reset score
    resetScore = () => {
        this.reset = true;
        this.modalElt.style.display = "none";
        this.restart();
    }

    // function restart
    restart = () => {
        this.count = 0;
        this.modalElt.style.display = "none";
        console.log("Game restarted");
        this.gameover = false;
        // if (this.count === 0) {
            this.player2.symboleAcc = [];
            this.player1.symboleAcc = [];
            for (let i=0; i<document.getElementsByClassName("boxes").length; i++) {
                // clearing the board game (removing all crosses and cirlces)
                document.getElementsByClassName("boxes")[i].classList.remove("cross", "circle");
            }
            // Hiding gameover block and showing player turn box again
            document.getElementById("player-turn-box").style.display ="flex";
            document.getElementById("player-gameover-box").style.display ="none";

            // restart with player 1 as first player to play
            this.playerNameText.textContent = this.player1.playerName;
            document.getElementById("player-turn-cross").style.display = "none";
            document.getElementById("player-turn-circle").style.display = "block";

            if (this.reset) {
                this.p1_victoryElt.textContent = 0;
                this.player1.victory = 0;
                this.p1_DefeatElt.textContent = 0;
                this.player1.defeat = 0;

                this.p2_victoryElt.textContent = 0;
                this.player2.victory = 0;
                this.p2_DefeatElt.textContent = 0;
                this.player2.defeat = 0;

                this.reset = false;
            }
        // };
    }

    // click handling
    handleBoxClick = (clickedBoxEvent) => {
        /*
        We will save the clicked html element in a variable for easier further use
        */    
        const clickedBoxElt = clickedBoxEvent.target;
        /*
        Here we will grab the 'data-box-index' attribute from the clicked box to identify where that box is in our grid. 
        Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an 
        integer(number)
        */
       
        const clickedBoxIndex = parseInt(
            clickedBoxElt.getAttribute('data-box-index')
        );

        console.log(clickedBoxIndex);
    }

    clickBox = (clickedBoxEvent) => {
        const elt = clickedBoxEvent.target;

        // condition below prevnent to replace a cross by a circle and vice-versa
        if (!elt.classList.contains("circle") && !elt.classList.contains("cross") && !this.gameover) {
            this.count += 1;

            if (this.count % 2 === 0) { // player 2 (impair)
                elt.classList.add("cross");
                this.playerNameText.textContent = this.player1.playerName;
                document.getElementById("player-turn-cross").style.display = "none";
                document.getElementById("player-turn-circle").style.display = "block";

                // manage victory player 2
                this.player2.symboleAcc.push(elt.id);

                console.log(this.player2.symboleAcc);

                let checker = (arr, target) => target.every(v => arr.includes(v));
                
                if (
                    checker(this.player2.symboleAcc, this.line1) ||
                    checker(this.player2.symboleAcc, this.line2) ||
                    checker(this.player2.symboleAcc, this.line3) ||
                    checker(this.player2.symboleAcc, this.column1) ||
                    checker(this.player2.symboleAcc, this.column2) ||
                    checker(this.player2.symboleAcc, this.column3) ||
                    checker(this.player2.symboleAcc, this.diagonale1) ||
                    checker(this.player2.symboleAcc, this.diagonale2)
                ) {
                    this.gameover = true;
                    // manage score/stats
                    this.player2.victory += 1;
                    this.p2_victoryElt.textContent = this.player2.victory;

                    this.player1.defeat += 1;
                    this.p1_DefeatElt.textContent = this.player1.defeat;
                    // alert("player 2 won !!");
                    this.modalElt.style.display = "block";
                    document.getElementById("player-modal-gameover-text").innerHTML = 'The winner is <span id="player-modal-name-gameover-text" class="player-modal-name-gameover-text"></span> !!!';
                    document.getElementById("player-modal-name-gameover-text").textContent = this.player2.playerName;

                    document.getElementById("player-name-gameover-text").textContent = this.player2.playerName;
                    
                    document.getElementById("player-turn-box").style.display = "none";
                    document.getElementById("player-gameover-box").style.display = "flex";
                } else {
                    console.log("player 2 hasn't won yet !!");
                    if (this.count === 9) {
                        this.modalElt.style.display = "block";
                        document.getElementById("player-modal-gameover-text").innerHTML = "It's a draw !!!";
                    }
                }
            } else { // player 1 (impaire)
                elt.classList.add("circle");
                this.playerNameText.textContent = this.player2.playerName;
                document.getElementById("player-turn-cross").style.display = "block";
                document.getElementById("player-turn-circle").style.display = "none";

                // manage victory player 1
                this.player1.symboleAcc.push(elt.id);

                console.log(this.player1.symboleAcc);

                let checkerP1 = (arrP1, targetP1) => targetP1.every(vP1 => arrP1.includes(vP1));
                
                if (
                    checkerP1(this.player1.symboleAcc, this.line1) ||
                    checkerP1(this.player1.symboleAcc, this.line2) ||
                    checkerP1(this.player1.symboleAcc, this.line3) ||
                    checkerP1(this.player1.symboleAcc, this.column1) ||
                    checkerP1(this.player1.symboleAcc, this.column2) ||
                    checkerP1(this.player1.symboleAcc, this.column3) ||
                    checkerP1(this.player1.symboleAcc, this.diagonale1) ||
                    checkerP1(this.player1.symboleAcc, this.diagonale2)
                ) {
                    this.gameover = true;
                    // manage score
                    this.player1.victory += 1;
                    this.p1_victoryElt.textContent = this.player1.victory;

                    this.player2.defeat += 1;
                    this.p2_DefeatElt.textContent = this.player2.defeat;

                    this.modalElt.style.display = "block";
                    document.getElementById("player-modal-gameover-text").innerHTML = 'The winner is <span id="player-modal-name-gameover-text" class="player-modal-name-gameover-text"></span> !!!';
                    document.getElementById("player-modal-name-gameover-text").textContent = this.player1.playerName;

                    document.getElementById("player-gameover-box").style.display = "flex";
                    document.getElementById("player-turn-box").style.display = "none";
                    
                    document.getElementById("player-name-gameover-text").textContent = this.player1.playerName;
                    // alert("player 1 won !!");
                } else {
                    console.log("player 1 hasn't won yet !!");
                    if (this.count === 9) {
                        this.modalElt.style.display = "block";
                        document.getElementById("player-modal-gameover-text").innerHTML = "Nobody won !!!";
                    }
                }
            };

            console.log("count : %d", this.count);

            if (this.gameover) {
                document.getElementById("player-turn-box").style.display ="none";
                document.getElementById("player-gameover-box").style.display ="flex";
                this.count = 0;
            }
        }
    }
}

let ticTacToe = new TicTacToe;

// let player1InputName = prompt("What's your name player 1 ?", "Player 1");
// let player2InputName = prompt("What's your name player 2 ?", "Player 2");
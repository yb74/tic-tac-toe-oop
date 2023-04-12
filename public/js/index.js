class TicTacToe {
    constructor() {
        this.count = 0;
        this.gameover = false;
        this.reset = false;
        this.lines = []
        this.columns = []
        this.backwardDiagonal = []
        this.forwardDiagonal = []
        this.boxesIds = [] // 1d array of boxes Ids (to be transformed to 2d array to set the boxes in proper order

        document.getElementById("start-game-btn").addEventListener("click", (e) => {
            e.preventDefault()
            localStorage.setItem('board_size', document.getElementById("board-size-selector").value);
            this.createBoard()
            document.querySelectorAll('.boxes').forEach(box => box.addEventListener('click', this.clickBox))
            this.startGame()
        });
        // modal
        this.modalElt = document.getElementById("modal");
        // stats p1
        this.player1_victoryElt = document.getElementById("p1-won-games");
        this.player1_DefeatElt = document.getElementById("p1-lost-games");
        // stats p2
        this.player2_victoryElt = document.getElementById("p2-won-games");
        this.player2_DefeatElt = document.getElementById("p2-lost-games");
        // player turn text
        this.playerNameText = document.getElementById("player-name-turn-text");

        document.getElementById("modal-button-playAgain").addEventListener("click", this.restart);
        document.getElementById("modal-button-reset-score").addEventListener("click", this.resetScore);
        // Bottom buttons
        document.getElementById("button-reset-score").addEventListener("click", this.resetScore);
        document.getElementById("back-to-menu-btn").addEventListener("click", (() => {window.location.reload()}));
    }

    createBoard = () => {
        // Game board creation
        const tableElt = document.getElementById("board")
        // let boardSizeSelectorVal = document.getElementById("board-size-selector").value
        let boardSizeSelectorVal;
        boardSizeSelectorVal = localStorage.getItem('board_size') !== null ? localStorage.getItem('board_size') : 3

        for (let i=1; i<=boardSizeSelectorVal; i++) {
            // Table row creation
            let tableRow = document.createElement('tr');
            tableRow.id=`row${i}`
            // adding rows to table
            tableElt.appendChild(tableRow)

            const rowElt = document.getElementById(`row${i}`)
            for (let j=1; j<=boardSizeSelectorVal; j++) {
                // Table division creation
                let tableDivision = document.createElement('td');
                tableDivision.setAttribute("class", "boxes")
                // adding division to table
                rowElt.appendChild(tableDivision)
            }
        }
        // setting id and custom attributes for each table divison <td> of the board
        const tableDivisionElts = document.getElementsByTagName("td")
        for (let k=0; k<boardSizeSelectorVal * boardSizeSelectorVal; k++) {
            tableDivisionElts[k].setAttribute(`data-box-index`, k+1)
            tableDivisionElts[k].id = `box${k+1}`

            // Stocking boxes Ids in an 1d array
            this.boxesIds.push(tableDivisionElts[k].id)
        }
        // Splitting the 1d array into a 2D array of boxes Ids to display the boxes in proper order
        const arr = this.boxesIds
        const splitArray = (arr, rows) => {
            const itemsPerRow = Math.ceil(arr.length / rows);
            return arr.reduce((acc, val, ind) => {
                const currentRow = Math.floor(ind / itemsPerRow);
                if(!acc[currentRow]){
                    acc[currentRow] = [val];
                }else{
                    acc[currentRow].push(val);
                }
                return acc;
            }, []);
        };

        this.boxes = splitArray(arr, Math.sqrt(arr.length))
    }

    startGame = () => {
        // players creation
        this.player1 = new Player(document.getElementById("p1-inputName").value, "circle");
        this.player2 = new Player(document.getElementById("p2-inputName").value, "cross");
        document.getElementById("player-name-turn-text").textContent = this.player1.playerName;
        document.getElementById("p1-name-stats-box").textContent = this.player1.playerName;
        document.getElementById("p2-name-stats-box").textContent = this.player2.playerName;
        document.getElementById("start-menu-screen").style.display = "none";
        document.getElementById("board-screen").style.display = "block";
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
        this.gameover = false;
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
            // Player 1
            this.player1_victoryElt.textContent = 0;
            this.player1.victory = 0;
            this.player1_DefeatElt.textContent = 0;
            this.player1.defeat = 0;
            // player 2
            this.player2_victoryElt.textContent = 0;
            this.player2.victory = 0;
            this.player2_DefeatElt.textContent = 0;
            this.player2.defeat = 0;
            this.reset = false;
        }
    }

    getLines = () => {
        for (let i=0; i<this.boxes.length; i++) {
            this.lines.push(this.boxes[i])
        }
        return this.lines
    }

    getColumns = () => {
        for (let i=0; i<this.boxes.length; i++) {
            const column = []
            for (let j=0; j<this.boxes.length; j++) {
                column.push(this.boxes[j][i])
            }
            this.columns.push(column)
        }
        return this.columns
    }

    getBackwardDiagonal = () => {
        for (let i=0; i<this.boxes.length; i++) {
            for (let j=0; j<this.boxes.length; j++) {
                i === j ? this.backwardDiagonal.push(this.boxes[i][j]) : null
            }
        }
        return this.backwardDiagonal
    }

    getForwardDiagonal = () => {
        for (let i=0; i<this.boxes.length; i++) {
            for (let j=0; j<this.boxes.length; j++) {
                (i + j === this.boxes.length -1) ? this.forwardDiagonal.push(this.boxes[i][j]) : null
            }
        }
        return this.forwardDiagonal
    }

    manageGame = (successCondition, winnerPlayer, loserPlayer, winnerElt, loserElt) => {
        if (
            successCondition
        ) {
            this.gameover = true;
            // manage score/stats
            winnerPlayer.victory += 1;
            winnerElt.textContent = winnerPlayer.victory;

            loserPlayer.defeat += 1;
            loserElt.textContent = loserPlayer.defeat;
            this.modalElt.style.display = "block";
            document.getElementById("player-modal-gameover-text").innerHTML = 'The winner is <span id="player-modal-name-gameover-text" class="player-modal-name-gameover-text"></span> !!!';
            document.getElementById("player-modal-name-gameover-text").textContent = winnerPlayer.playerName;
            document.getElementById("player-name-gameover-text").textContent = winnerPlayer.playerName;
            document.getElementById("player-turn-box").style.display = "none";
            document.getElementById("player-gameover-box").style.display = "flex";
        } else {
            if (this.count === localStorage.getItem('board_size')*localStorage.getItem('board_size')) {
                this.modalElt.style.display = "block";
                document.getElementById("player-modal-gameover-text").innerHTML = "It's a draw !!!";
            }
        }
    }

    clickBox = (clickedBoxEvent) => {
        const elt = clickedBoxEvent.target;
        let checker = (arr, target) => target.every(v => arr.includes(v));

        // condition below prevnent to replace a cross by a circle and vice-versa
        if (!elt.classList.contains("circle") && !elt.classList.contains("cross") && !this.gameover) {
            this.count += 1;

            if (this.count % 2 === 0) { // player 2 cross (impair)
                elt.classList.add("cross");
                this.playerNameText.textContent = this.player1.playerName;
                document.getElementById("player-turn-cross").style.display = "none";
                document.getElementById("player-turn-circle").style.display = "block";

                // manage victory player 2
                this.player2.symboleAcc.push(elt.id);

                for (let i=0; i<localStorage.getItem('board_size'); i++) {
                    this.manageGame(checker(this.player2.symboleAcc, this.getLines()[i]) || checker(this.player2.symboleAcc, this.getColumns()[i]), this.player2, this.player1, this.player2_victoryElt, this.player1_DefeatElt);
                }
                // Checking diagonals
                this.manageGame(checker(this.player2.symboleAcc, this.getForwardDiagonal()) || checker(this.player2.symboleAcc, this.getBackwardDiagonal()), this.player2, this.player1, this.player2_victoryElt, this.player1_DefeatElt)
            } else { // player 1 circle (impaire)
                elt.classList.add("circle");
                this.playerNameText.textContent = this.player2.playerName;
                document.getElementById("player-turn-cross").style.display = "block";
                document.getElementById("player-turn-circle").style.display = "none";

                // manage victory player 1
                this.player1.symboleAcc.push(elt.id);

                for (let i=0; i<localStorage.getItem('board_size'); i++) {
                    this.manageGame(checker(this.player1.symboleAcc, this.getLines()[i]) || checker(this.player1.symboleAcc, this.getColumns()[i]), this.player1, this.player2, this.player1_victoryElt, this.player2_DefeatElt);
                }
                // Checking diagonals
                this.manageGame(checker(this.player1.symboleAcc, this.getForwardDiagonal()) || checker(this.player1.symboleAcc, this.getBackwardDiagonal()), this.player1, this.player2, this.player1_victoryElt, this.player2_DefeatElt)
            }
        }
        if (this.gameover) {
            document.getElementById("player-turn-box").style.display ="none";
            document.getElementById("player-gameover-box").style.display ="flex";
            this.count = 0;
        }
    }
}

let ticTacToe = new TicTacToe;
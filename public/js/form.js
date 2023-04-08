const onChangeHandler = () => {
    let p1NameInputVal = document.getElementById("p1-inputName").value;
    let p2NameInputVal = document.getElementById("p2-inputName").value;
    // let boardSizeSelectorVal = document.getElementById("board-size-selector").value;

    const startGameBtn = document.getElementById("start-game-btn");

    p1NameInputVal.length < 2 || p2NameInputVal.length < 2 ? startGameBtn.disabled = true : startGameBtn.disabled = false;
}
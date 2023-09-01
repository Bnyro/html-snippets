let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

let word = WORDS.random().toUpperCase();
const rows = 6;
const columns = 5;
const keyboardRows = ["QWERTZUIOP", "ASDFGHJKL", "<YXCVBNM⏎"];

let currentRow = 0;
let currentColumn = 0;

const handleResult = (success) => {
  $("#keyboard").classList.add("invisible");
  $("#result").classList.remove("invisible");
  $("#result h2").innerHTML = success
    ? "Congratulations!"
    : `Correct word: ${word}`;
  $("#result h2").style.color = success ? "var(--green)" : "var(--red)";
};

const getElement = (row, column) => {
  let r = $$("#table div")[row];
  return r.querySelectorAll("span")[column];
};

const handleAction = (char) => {
  if (char == "<") {
    if (currentColumn == 0) return;
    currentColumn -= 1;
    getElement(currentRow, currentColumn).innerHTML = "";
  } else {
    let curRow = $$("#table div")[currentRow];
    let charEls = [...curRow.querySelectorAll("span")];
    let insertedWord = charEls.map((el) => el.innerHTML).join("");
    if (insertedWord.length != columns) return;

    charEls.forEach((span, index) => {
      const char = span.innerHTML;
      const cl =
        char == word[index]
          ? "correct"
          : word.includes(char)
          ? "exists"
          : "false";
      span.classList.add(cl);
    });

    if (insertedWord == word) {
      handleResult(true);
    } else if (rows - 1 == currentRow) {
      handleResult(false);
    } else {
      currentRow += 1;
      currentColumn = 0;
    }
  }
};

const handleChar = (char) => {
  if (!isLetter(char)) {
    handleAction(char);
    return;
  }
  if (currentRow >= rows || currentColumn >= columns) return;
  getElement(currentRow, currentColumn).innerHTML = char;
  currentColumn += 1;
};

const renderTable = () => {
  for (var i = 0; i < rows; i++) {
    const div = document.createElement("div");
    $("#table").appendChild(div);
    for (var x = 0; x < columns; x++) {
      const span = document.createElement("span");
      div.appendChild(span);
    }
  }
};

const renderKeyboard = () => {
  keyboardRows.forEach((row) => {
    const div = document.createElement("div");
    $("#keyboard").appendChild(div);
    [...row].forEach((char) => {
      const span = document.createElement("span");
      span.innerHTML = char;
      span.addEventListener("click", () => handleChar(char));
      div.appendChild(span);
    });
  });
};

const retry = () => {
  currentRow = 0;
  currentColumn = 0;
  word = WORDS.random().toUpperCase();
  $("#keyboard").classList.remove("invisible");
  $("#result").classList.add("invisible");
  $("#table").innerHTML = "";
  renderTable();
};

renderTable();
renderKeyboard();

$("#result button").addEventListener("click", retry);

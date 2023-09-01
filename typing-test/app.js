let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);

// constants
const maxWordLength = 5;
const timeLimit = 60;

// current state
let running = null;

// text to type
let words = [];
let lines = [];
let currentIndex = 0;
let currentLine = 0;

// current stats
let currentTime = 0;
let correctCount = 0;
let falseCount = 0;

let updateTimeTimeout = null;

const appendEl = (parentElement, text) => {
  const newEl = document.createElement("span");
  newEl.innerHTML = text;
  parentElement.appendChild(newEl);
};

const fetchWords = async () => {
  const response = await fetch("words.txt");
  const text = await response.text();
  words = text.split("\n").filter((word) => word.length <= maxWordLength);
};

const updateTime = () => {
  currentTime -= 1;
  $("#countdown").innerHTML = currentTime;
  if (currentTime == 0) {
    running = false;
    let correctWords = [...$$("#text span")]
      .slice(0, currentIndex)
      .filter((el) => !isLetter(el.innerHTML)).length;
    let wordCount = (correctWords * 60) / timeLimit;
    $(
      "#result"
    ).innerHTML = `WPM: ${wordCount}, Correct: ${correctCount}, False: ${falseCount}`;
  } else {
    updateTimeTimeout = window.setTimeout(updateTime, 1000);
  }
};

const startCountdown = () => {
  running = true;
  $("#result").innerHTML = "";
  currentTime = timeLimit;
  updateTimeTimeout = window.setTimeout(updateTime, 1000);
};

const getLines = () => {
  const chars = [...$$("#text span")];
  const groups = groupBy(chars, (el) => el.offsetTop);
  return [...groups.entries()];
};

const updateLines = () => {
  const prevLines = lines.slice(0, currentLine + 1);
  const length = prevLines.map((el) => el[1].length).reduce((a, b) => a + b, 0);
  if (currentIndex == length) {
    prevLines[currentLine][1].forEach((span) => {
      span.hidden = true;
    });
    currentLine += 1;
  }
};

const showText = () => {
  $("#text").innerHTML = "";
  range(1000).forEach((_) => {
    const chars = [...words.random()];
    chars.forEach((char) => {
      appendEl($("#text"), char);
    });
  });
  currentEl().classList.add("current");
  lines = getLines();
};

const refresh = () => {
  correctCount = 0;
  falseCount = 0;
  currentIndex = 0;
  currentLine = 0;
  $("#countdown").innerHTML = timeLimit;
  $("#result").innerHTML = "";
  running = null;
  window.clearTimeout(updateTimeTimeout);
  showText();
};

fetchWords().then(() => {
  refresh();
});

$("#reset").addEventListener("mouseup", (event) => {
  if (isLetter(event.key)) refresh();
});

document.addEventListener("keypress", (event) => {
  if (running == false) return;
  if (running == null) startCountdown();
  let current = currentEl();
  if (
    event.key.toLowerCase() == current.innerHTML ||
    (event.key === " " && !isLetter(current.innerHTML))
  ) {
    correctCount += 1;
    current.classList.add("correct");
    current.classList.remove("current");
    currentIndex += 1;
    currentEl().classList.add("current");
    updateLines();
  } else {
    falseCount += 1;
  }
});

const randomApi = "http://api.quotable.io/random"
const typeDisplay = document.getElementById("type-display");
const typeInput = document.getElementById("type-Input");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const incorrectSound = new Audio("./audio/incorrect.mp3");
const correctSound = new Audio("./audio/correct.mp3");

//テキスト正誤判定
typeInput.addEventListener("input", () => {

    //タイプ音
    typeSound.play();
    typeSound.currentTime = 0;

    const displayArray = typeDisplay.querySelectorAll("span");
    const InputArray = typeInput.value.split("");
    let correct = true;
    displayArray.forEach((randomspan, index) => {
        if ((InputArray[index] == null)) {
            //入力がないときは判定しない
            randomspan.classList.remove("correct");
            randomspan.classList.remove("incorrect");
            correct = false;
        }
        //正解
        else if (randomspan.innerText == InputArray[index]) {
            randomspan.classList.add("correct");
            randomspan.classList.remove("incorrect");
            //不正解
        } else {
            randomspan.classList.add("incorrect");
            randomspan.classList.remove("correct");

            //不正解音
            incorrectSound.volume = 0.4;
            incorrectSound.play();
            incorrectSound.currentTime = 0;
            correct = false;
        }
    });
    //正解音
    if (correct == true) {
        correctSound.play();
        correctSound.currentTime = 0;
        nextdisplay();
    }
});

//非同期処理でランダムな文章を取得する
async function getRandom() {
    const Response = await fetch(randomApi);
    const data = await Response.json();
    return data.content;
}

//ランダムな文章を取得して、表示する
async function nextdisplay() {
    const random = await getRandom();
    typeDisplay.innerText = "";

    //文章を一文字ずつ分解して、spanタグを生成する
    let text = random.split("");
    text.forEach((random) => {
        const randomspan = document.createElement("span");
        randomspan.innerText = random;
        typeDisplay.appendChild(randomspan);
    });

    //テキストボックスの中身を消す
    typeInput.value = "";
    StartTimer();
}

let StartTime;
let basetime = 100;//時間表示
let Interval;

//タイマー
function StartTimer() {
    clearInterval(Interval);
    timer.innerText = basetime;
    StartTime = new Date();
    Interval = setInterval(() => {
        timer.innerText = basetime - getTimerTime();
        if (timer.innerText <= 0) TimeUp();
    }, 1000);
}


function getTimerTime() {
    return Math.floor((new Date() - StartTime) / 1000);
}

//問題の切り替え
function TimeUp() {
    nextdisplay();
}

nextdisplay();
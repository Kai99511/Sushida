const randomApi = "http://api.quotable.io/random"
const typeDisplay = document.getElementById("type-display");
typeDisplay.style.display = 'block';
const typeInput = document.getElementById("type-Input");
typeInput.style.display = 'block';
const timer = document.getElementById("timer");
timer.style.display = 'block';
const qsNumber = document.getElementById("qs-number");
qsNumber.style.display = 'block';


const typeSound = new Audio("./audio/typing-sound.mp3");
const incorrectSound = new Audio("./audio/incorrect.mp3");
const correctSound = new Audio("./audio/correct.mp3");


let gameCount = 0;
let score = 0;
let Interval;
let StartTime;
//難易度変更
let baseCount = 5;//問題数
let Basetime = 3;//時間表示 

function startGame() {
    // タイトル画面を非表示にし、ゲーム画面を表示
    document.getElementById('title-screen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    //テキスト正誤判定
    typeInput.addEventListener("input", () => {
        //タイプ音
        typeSound.play();
        typeSound.currentTime = 0;

        const displayArray = typeDisplay.querySelectorAll("span");
        const InputArray = typeInput.value.split("");
        let correct = true;
        displayArray.forEach((randomSpan, index) => {
            if ((InputArray[index] == null)) {
                //入力がないときは判定しない
                randomSpan.classList.remove("correct");
                randomSpan.classList.remove("incorrect");
                correct = false;
            }
            //正解(緑文字)
            else if (randomSpan.innerText == InputArray[index]) {
                randomSpan.classList.add("correct");
                randomSpan.classList.remove("incorrect");
                //不正解(赤文字)
            } else {
                randomSpan.classList.add("incorrect");
                randomSpan.classList.remove("correct");
                //タイピングの不正解音
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
            gameCount++;
            score++;
            nextDisplay();
        }
    });

    //非同期処理でランダムな文章を取得する
    async function getRandom() {
        const Response = await fetch(randomApi);
        const data = await Response.json();
        return data.content;
    }

    //ランダムな文章を取得して、表示する
    async function nextDisplay() {
        const random = await getRandom();
        typeDisplay.innerText = "";
        document.getElementById("qs-number").innerText =
         "Question" + (gameCount + 1) + " " + "/" + " " + baseCount;
        //文章を一文字ずつ分解して、spanタグを生成する
        let text = random.split("");
        text.forEach((random) => {
            const randomSpan = document.createElement("span");
            randomSpan.innerText = random;
            typeDisplay.appendChild(randomSpan);
        });

        //テキストボックスの中身を消す
        typeInput.value = "";
        StartTimer();
    }

    //タイマー
    function StartTimer() {
        clearInterval(Interval);
        timer.innerText = Basetime;
        StartTime = new Date();
        Interval = setInterval(() => {
            timer.innerText = Basetime - getTimerTime();
            if (timer.innerText <= 0) {
                gameCount++;
                if (gameCount >= baseCount) {  // 問題を解いた回数がnに達したらゲームを終了
                    endGame();
                    return;
                } TimeUp();
            }
        }, 1000);
    }
    function getTimerTime() {
        return Math.floor((new Date() - StartTime) / 1000);
    }
    //問題の切り替え
    function TimeUp() {
        nextDisplay();
    }

    nextDisplay();
}
//問題が終わったら終了
function endGame() {
    const resultMessage = `Your score is ${score}/${gameCount}!`;//リザルト
    document.getElementById('title-screen').style.display = 'block';//リザルト画面を表示
    document.getElementById('title-screen').innerHTML = `<h2>${resultMessage}</h2>`;//点数
    document.getElementById('title-screen').innerHTML += '<button href="#" class="btn btn-border" onclick="restartGame()">Retry</button>';//リスタートボタン
    document.getElementById('timer').style.display = 'none'; // タイマーを非表示にする
    document.getElementById('qs-number').style.display = 'none';
    document.querySelector('.container').style.display = 'none';//ゲーム画面の非表示
    clearInterval(Interval);
    gameCount = 0;//ゲーム回数リセット
    score = 0;//点数リセット
}

//リザルト&リスタート
function restartGame() {
    document.getElementById('title-screen').style.display = 'none'; //リザルト画面(タイトル画面)を非表示
    document.getElementById('timer').style.display = 'block';// タイマーを表示にする
    document.getElementById('qs-number').style.display = 'block';
    startGame(); // ゲームを再開する
}
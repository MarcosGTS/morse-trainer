const BASE_TIMEOUT = 250;
const TIMEOUT_TABLE = {
    ',': BASE_TIMEOUT,
    '.': BASE_TIMEOUT * 2,
    '_': BASE_TIMEOUT * 4,
    ' ': BASE_TIMEOUT * 6, 
    '*': BASE_TIMEOUT * 12,
};

const MORSE_TABLE =  {
    'A': "._",    'B': "_...",  'C': "_._.",  'D': "_..",   'E': ".",
    'F': ".._.",  'G': "__.",   'H': "....",  'I': "..",    'J': ".___",
    'K': "_._",   'L': "._..",  'M': "__",    'N': "_.",    'O': "___",
    'P': ".__.",  'Q': "__._",  'R': "._.",   'S': "...",   'T': "_",
    'U': ".._",   'V': "..._",  'W': ".__",   'X': "_.._",  'Y': "_.__",
    'Z': "__..",
    '0': "_____", '1': ".____", '2': "..___", '3': "...__", '4': "...._",
    '5': ".....", '6': "_....", '7': "__...", '8': "___..", '9': "____."
};

const WORD_LIST = [ 
   "amor", "amizade", "carro", "casa", "tempo", "dia", "noite", "trabalho", "família", "vida",
  "homem", "mulher", "cidade", "país", "mundo", "pai", "mãe", "filho", "filha", "escola",
  "professor", "aluno", "dinheiro", "saúde", "felicidade", "viagem", "história", "livro", "coração", "cabeça",
  "mão", "olho", "pé", "corpo", "comida", "água", "bebida", "roupa", "sapato", "telefone",
  "computador", "internet", "trânsito", "ônibus", "carreira", "futuro", "presente", "passado", "esperança", "medo",
  "alegria", "tristeza", "força", "fraqueza", "tempo", "relógio", "porta", "janela", "quarto", "sala",
  "cozinha", "banheiro", "mesa", "cadeira", "sofá", "televisão", "filme", "música", "canto", "dança",
  "arte", "pintura", "esporte", "futebol", "basquete", "praia", "montanha", "rio", "mar", "sol",
  "lua", "estrela", "vento", "chuva", "nuvem", "neve", "terra", "fogo", "ar", "luz",
  "sombra", "estrada", "ponte", "igreja", "hospital", "farmácia", "loja", "mercado", "parque", "jardim"
];


const lightBulb = document.querySelector(".light-bulb");
const button = document.querySelector("button");
const timeoutList = document.querySelectorAll("input[type=range]");

timeoutList.forEach(timeController => {
    const sinal = timeController.dataset["type"];
    const display = document.getElementById("display-" + sinal);

    timeController.value = TIMEOUT_TABLE[sinal] / 1000;
    display.innerText = `${Number(timeController.value).toFixed(2)}s`;

    timeController.addEventListener("input", () => {
        TIMEOUT_TABLE[sinal] = timeController.value * 1000;
        display.innerText = `${Number(timeController.value).toFixed(2)}s`;
    })  
});

// Transformar uma lista de (. _) em um piscar 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function toggleLightbulb() {
    lightBulb.classList.toggle("on");
}

async function blinckBy(time) {
    toggleLightbulb();
    await sleep(time);
    toggleLightbulb();
}

function renderMorse(morse) {
    let index = 0;
    let controller = {run: true};

    async function loop() {
        const sinal = morse[index];
        const timeout = TIMEOUT_TABLE[sinal];
        //console.log(sinal, timeout);

        if (!controller.run) return;

        if ([".", "_"].includes(sinal)) {
            await blinckBy(timeout);
        } else {
            await sleep(timeout);
        }

        index = (index + 1) % morse.length; 
        loop();
    }

    loop()

    return controller;
}

let controller = {}; 

// button.addEventListener("click", () => {
//     const input = document.querySelector("input");
//     const morse = getMorseTranslation(input.value.toUpperCase());

//     controller.run = false
//     controller = renderMorse(morse);
// });

function getMorseTranslation(text) {
    let morse = text.split("").map((char) => {
        if (char == " ") {
            return [char, char];
        }

        const result = MORSE_TABLE[char].split("").join(',').split("");
        result.push(" ");

        return result; 
    })

    morse = morse.flat();
    morse.pop();
    morse.push("*");

    return morse; 
}

function game() {
    const status = {points: 0, lives: 3};
    let word = null;
    let controller = {};

    // START
    next();

    function next() {
        word = pickRandom(WORD_LIST).toUpperCase() ;
        console.log(word);
        playMorse(word);
    }

    // check if correct or wrong

    function checkAnswer(value) {
        if (status.lives <= 0) return;

        if (value.toUpperCase() == word) {
            console.log("YOUR ANSWER IS CORRECT!!");
            status.points += 1; 
            next();
        } else {
            status.lives -= 1;

            if (status.lives > 0) {
                console.log("WRONG, TRY AGAIN!");
            } else {
                console.log("YOU LOSE", status);
                controller.run = false;
            }
        }
        
    }

    // if correct pick another word

    function pickRandom(list) {
        const random_index = Math.floor(Math.random() * list.length);
        return list[random_index];
    }

    function playMorse(word) {
        const morse = getMorseTranslation(word);

        controller.run = false
        controller = renderMorse(morse);       
    }

    return {checkAnswer};
}

const {checkAnswer} = game();

button.addEventListener("click", () => {
    const input = document.querySelector("input");
    checkAnswer(input.value.toUpperCase());
});


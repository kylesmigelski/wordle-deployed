<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref, Ref} from 'vue'
import Keyboard from "./keyboard.vue";
import '@fontsource/anton';
import {addDoc, collection, getFirestore} from "@firebase/firestore";
import store  from './store'

// get username from vuex store
const username = computed(() => {
  return store.getters.getUsername
})
const userID = computed(() => {
  return store.getters.getUserID
})

const db = getFirestore();
const gameStatistics = collection(db, "gameStatistics");

const userWords: Ref<string[]> = ref([])
const solutionWord: Ref<string[]> = ref([])
const validWords: Ref<string[]> = ref([])
const lettersGuessed: Ref<number> = ref(0)
const typedLetters: Ref<string[]> = ref([])
const letterColors: Ref<Record<string, string>> = ref({})
let timeStart = new Date().getTime();

// Store the solution word in the vuex store


// Load the list of solutions from the txt file and choose a random one
onBeforeMount( async () => {
  const response = await fetch('wordles.txt');
  const text = await response.text();
  const wordsArray = text.split('\n').filter(word => word.trim() !== '');

  // Choose a random word from the list and add it to solutionWord
  const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
  solutionWord.value.push(randomWord);
  store.commit('setSolutionWord', solutionWord.value[0]);
  console.log("Solution: ", solutionWord.value[0]);
})

// Load the list of valid words from the txt file
onBeforeMount( async () => {
  const response = await fetch('guesses.txt');
  const text = await response.text();
  const wordsArray = text.split('\n');
  validWords.value = wordsArray
})

function addOneWord() {
  // Convert lettersGuessed to a string
  const word = typedLetters.value.join('')
  // Add a word to the list of user words if it is valid, has 5 letters, and hasn't been guessed before
  if (word.length == 5 && !userWords.value.includes(word) && validWords.value.includes(word)) {
    userWords.value.push(word)
    displayWord(word);
    CheckForWin(word);
  }
  else {
    console.log("invalid word: " + word)
    shake();
  }
}

//click title to display solution
function displaySolution() {
  document.getElementById("title")!.innerHTML = solutionWord.value[0];
}

function newGame() {
  window.location.reload();
}

function displayWord(word: string) {
  lettersGuessed.value -= 5
  typedLetters.value = []
  const letters = word.split('')
  for (let i = 0; i < letters.length; i++) {

    // if letter is in the solution word at the same position, add class "perfect"
    if (solutionWord.value[0].charAt(i) === letters[i]) {
      //document.getElementsByClassName('box')[lettersGuessed.value + i].classList.add('perfect')
      letterColors.value[letters[i]] = '#538d4e'
    }
    // if letter is in the solution word at a different position, add class "misplaced"
    else if (solutionWord.value[0].includes(letters[i])) {
      letterColors.value[letters[i]] = '#b59f3b'
    }
    // if letter is not in the solution word, add class "wrong" and make letter appear
    else {
      letterColors.value[letters[i]] = '#3A3A3C'
    }
  }
  // Add 5 to lettersGuessed to move to the next row
  lettersGuessed.value += 5
  flip(letters);
}


function displayLetter(letter: string) {
  // only display the letter if it is in the alphabet, and we have not typed more than 5 letters
  if (letter.match(/[a-z]/i) && typedLetters.value.length < 5) {
    document.getElementsByClassName('box')[lettersGuessed.value].innerHTML = letter.toUpperCase();
    typedLetters.value.push(letter)
    lettersGuessed.value += 1
    pop();
  }
}

function removeLastLetter() {
  // Remove the last letter from the input field
  if (typedLetters.value.length > 0) {
    document.getElementsByClassName('box')[lettersGuessed.value - 1].innerHTML = '';
    typedLetters.value.pop()
    lettersGuessed.value -= 1
  }
}

function CheckForWin(word: string) {
  // Check if the latest word is the same as the solution word. If so, the user wins and they can't submit any more words or letters
  if (solutionWord.value.join() === (word)) {
    allowInput = false
    // Change the color of the newgame button to green
    winner();
    storeGameStats("won");
  }
  // If the user has guessed 6 words, they lose
  else if(lettersGuessed.value == 30){
    storeGameStats("lost");
    alert('You lose. The answer was: '+ solutionWord.value);
    allowInput = false
  }
}

let allowInput = true
const onKeyup = (e: KeyboardEvent) => onPress(e.key)
window.addEventListener('keyup', onKeyup)
function onPress(key: string) {
  if (!allowInput) return
  if (/^[a-zA-Z]$/.test(key)) {
    displayLetter(key)
  } else if (key === 'Backspace' || key === 'Delete') {
    removeLastLetter()
  } else if (key === 'Enter') {
    addOneWord()
  }
}

function shake() {
  document.getElementsByClassName('grid')[0].classList.add('shake')
  setTimeout(() => {
    document.getElementsByClassName('grid')[0].classList.remove('shake')
  }, 300)
}

function flip(letters: string[]) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      document.getElementsByClassName('box')[lettersGuessed.value - 5 + i].classList.add('flip')
      document.getElementsByClassName('box')[lettersGuessed.value - 5 + i].style.backgroundColor = letterColors.value[letters[i]]
      document.getElementsByClassName('box')[lettersGuessed.value - 5 + i].style.outlineColor = letterColors.value[letters[i]]
    }, 350 * i)
  }
}

function pop() {
  // Pop the current letter
  document.getElementsByClassName('box')[lettersGuessed.value - 1].classList.add('pop')
  // Remove the pop class after 350ms
  setTimeout(() => {
    document.getElementsByClassName('box')[lettersGuessed.value - 1].classList.remove('pop')
  }, 300)
}

function winner() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      document.getElementsByClassName('box')[lettersGuessed.value - 5 + i].classList.add('skip')
    }, 330 * i)
  }
}

// store the game stats in the firestore document
async function storeGameStats(gameResult: string) {
  try {
    const docRef = await addDoc(gameStatistics, {
      userID: userID.value,
      username: username.value,
      secretWord: solutionWord.value[0],
      gameResult: gameResult,
      score: lettersGuessed.value / 5,
      time: Math.ceil((new Date().getTime() - timeStart) / 1000) + 's',
      date: new Date()
    })
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

</script>

<template>
  <div class="field">
    <div class="grid">
      <div class="box" id="letter-boxes" v-for="index in 30"></div>
    </div>
  </div>

  <div style="justify-content: center">
    <keyboard @key="onPress" :letterColors="letterColors" :key="onPress"/>
  </div>
</template>

<style scoped>
  .grid{
    display: inline-grid;
    grid-template-columns: repeat(5, 60px);
    grid-template-rows: repeat(6,60px);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }

  .field {
    justify-content: center;
    align-items: center;
    display: flex;
    margin-bottom: 60px;
  }

  input[type=text] {
    padding:10px;
    width: 250px;
    border:0;
    background-color: gray;
    border-radius:10px;
    margin-right: 10px;
    box-shadow:0 0 5px 2px rgba(255, 255, 255, 0.2);
  }
  ::placeholder {
    color: black;
  }

  hr {
    margin-bottom: 20px;
  }

  .box{
    outline: #3A3A3C solid 2px;
    font-size: 32px;
    padding-top: 10%;
    font-weight: bold;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  .front, .back{
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }
  .front{
    z-index: 2;
    transform: rotateX(0deg);
  }
  .back{
    transform: rotateX(180deg);
  }
  .flip{
    transform: rotateX(180deg) scale(1, -1);
    transition: 0.5s;
    transform-style: preserve-3d;
    position: relative;
  }

  .perfect{
    background-color: #538d4e;
    color: white;
    outline-color: #538d4e;
  }

  .misplaced{
    background-color: #b59f3b;
    color: white;
    outline-color: #b59f3b;
  }

  .wrong{
    background-color:#3A3A3C;
    color: white;
    outline-color: #3A3A3C;
  }

  .shake {
    animation: shake 0.7s;
  }
  @keyframes shake {
    0% {
      transform: translate(1px);
    }
    10% {
      transform: translate(-2px);
    }
    20% {
      transform: translate(2px);
    }
    30% {
      transform: translate(-2px);
    }
    40% {
      transform: translate(2px);
    }
    50% {
      transform: translate(-2px);
    }
    60% {
      transform: translate(2px);
    }
    70% {
      transform: translate(-2px);
    }
    80% {
      transform: translate(2px);
    }
    90% {
      transform: translate(-2px);
    }
    100% {
      transform: translate(1px);
    }
  }

  .pop {
    animation: pop 0.3s;
  }
  @keyframes pop {
    0% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .skip {
    animation: skip 0.7s;
  }
  @keyframes skip {
    0% {
      transform: translateY(0px);
    }
    20% {
      transform: translateY(5px);
    }
    60% {
      transform: translateY(-25px);
    }
    90% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @media (max-width: 920px) {
    h1 {
      font-size: 1.5rem;
    }
    .title { grid-area: 1 / 3 / 2 / 4;
      width: 150px;
      font-size: x-large;
      margin-top: 20px;
    }
    .nav-button { grid-area: 1 / 0 / 2 / 6;
      height: 30px;
      width: 100px;
      font-size: small;
      margin-right: 50px;
      padding: 0;
    }
    .field {
      justify-content: center;
      align-items: center;
      display: flex;
      margin-bottom: 15px;
    }
    .header {
      grid-template-rows: 48px;
      margin-bottom: 15px;
    }
  }


</style>

<script setup lang="ts">
import {onBeforeMount, onUnmounted, ref, Ref, watch} from 'vue'
import Keyboard from "./keyboard.vue";
import '@fontsource/anton';

const userWords: Ref<string[]> = ref([])
const solutionWord: Ref<string[]> = ref([])
const validWords: Ref<string[]> = ref([])
const lettersGuessed: Ref<number> = ref(0)
const typedLetters: Ref<string[]> = ref([])
const letterColors: Ref<Record<string, string>> = ref({})

// Load the list of solutions from the txt file and choose a random one
onBeforeMount( async () => {
  const response = await fetch('wordles.txt');
  const text = await response.text();
  const wordsArray = text.split('\n').filter(word => word.trim() !== '');

  // Choose a random word from the list and add it to solutionWord
  const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
  solutionWord.value.push(randomWord)
  console.log(solutionWord.value)
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
    console.log(validWords.value)
    alert('Invalid word. Please try again.')
  }
}

function newGame() {
  window.location.reload();
}

function displayWord(word: string) {
  lettersGuessed.value -= 5
  typedLetters.value = []
  const letters = word.split('')
  for (let i = 0; i < letters.length; i++) {

    // Display the word in the grid
    document.getElementsByClassName('box')[lettersGuessed.value + i].innerHTML = letters[i].toUpperCase();

    // Add the corresponding class to the letter.
    // if letter is in the solution word at the same position, add class "perfect"
    if (solutionWord.value[0].charAt(i) === letters[i]) {
      document.getElementsByClassName('box')[lettersGuessed.value + i].classList.add('perfect')
      letterColors.value[letters[i]] = '#538d4e'
    }
    // if letter is in the solution word at a different position, add class "misplaced"
    else if (solutionWord.value[0].includes(letters[i])) {
      document.getElementsByClassName('box')[lettersGuessed.value + i].classList.add('misplaced')
      letterColors.value[letters[i]] = '#b59f3b'
    }
    // if letter is not in the solution word, add class "wrong" and make letter appear
    else {
      document.getElementsByClassName('box')[lettersGuessed.value + i].classList.add('wrong')
      letterColors.value[letters[i]] = '#3A3A3C'
    }
  }
  // Add 5 to lettersGuessed to move to the next row
  lettersGuessed.value += 5
}


function displayLetter(letter: string) {
  // only display the letter if it is in the alphabet, and we have not typed more than 5 letters
  if (letter.match(/[a-z]/i) && typedLetters.value.length < 5) {
    document.getElementsByClassName('box')[lettersGuessed.value].innerHTML = letter.toUpperCase();
    typedLetters.value.push(letter)
    lettersGuessed.value += 1
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
    document.getElementById("newgame")!.style.backgroundColor = "#538d4e";
  }
  // If the user has guessed 6 words, they lose
  else if(lettersGuessed.value == 30){
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
    console.log('backspace')
  } else if (key === 'Enter') {
    addOneWord()
  }
}
// add a watch that ensures the grids html is updated when the backspace key is pressed


</script>

<template>
  <div class="header">
    <h1 class="div2" id="title" style="font-family: Anton,serif">Wordle Clone</h1>
    <button class="div4" @click="newGame" id="newgame" style="font-family: Anton,serif">New Game</button>
  </div>
  <hr color="gray">

  <div class="field">
    <div class="grid">
      <div class="box" v-for="index in 30"></div>
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

  .header {
    display: grid;
    grid-area: header;
    justify-content: space-evenly;
    justify-items: center;
    align-content: space-evenly;
    align-items: center;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 50px;
  }
  .div2 { grid-area: 1 / 3 / 2 / 4;
    margin-top: 30px;
  }
  .div4 { grid-area: 1 / 5 / 2 / 6;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-right: 100px;
    color: white;
  }

  .field {
    justify-content: center;
    align-items: center;
    display: flex;
    margin-bottom: 25px;
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

  .button1{
    outline-style: solid;
    outline-color: black;
    height: 40px;
    width: 200px;
    margin-top: auto;
    justify-content: center;
    align-items: center;
    font-size: small;
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

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
    .div2 { grid-area: 1 / 3 / 2 / 4;
      width: 150px;
    }
    .div4 { grid-area: 1 / 5 / 2 / 6;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      height: 35px;
      width: 100px;
      font-size: small;
      margin-right: 50px;
    }
    hr {
      margin-bottom: 15px;
    }
    .field {
      justify-content: center;
      align-items: center;
      display: flex;
      margin-bottom: 15px;
    }
    .header {
      grid-template-rows: 38px;
    }
  }


</style>

<template>
  <div id="keyboard-cont">
    <!-- Top row -->
    <div class="keyboard-row">
      <button v-for="key in topRow" class="keyboard-button" @click="handleKeyClick(key)">
        {{ key }}
      </button>
      </div>
      <!-- Middle row printed in a row -->
      <div class="second-row">
        <button v-for="key in middleRow" class="keyboard-button" @click="handleKeyClick(key)">
          {{ key }}
        </button>
      </div>

    <!-- Bottom row printed in a row -->
    <div class="keyboard-row">
      <button class="keyboard-button big-key" @click="handleKeyClick('Enter')">Enter</button>
        <button v-for="key in bottomRow" class="keyboard-button" @click="handleKeyClick(key)">
          {{ key }}
        </button>
      <button class="keyboard-button big-key" @click="handleKeyClick('Backspace')">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
        >
          <path
              fill="currentColor"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
let topRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
let middleRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
let bottomRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

export default {
  name: 'Keyboard',
  props: {
    letterColors: {
      type: Object,
      required: true
    },
  },
data() {
    return {
      topRow,
      middleRow,
      bottomRow,
    }
  },
  methods: {
    handleKeyClick(key) {
      this.$emit('key', key);
    },
  },

// Every time the letterColors prop changes shade the keyboard buttons accordingly
  watch: {
      letterColors: {
        handler: function (newVal, oldVal) {
          for (const letter in newVal) {
            shadeKeyBoard(letter, newVal[letter])
          }
        },
        deep: true
      }
    }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      elem.style.backgroundColor = color
    }
  }
}
</script>

<style>
#keyboard-cont {
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#keyboard-cont div {
  display: flex;
}

.second-row {
  margin: 0.5rem 0;
}

.keyboard-button {
  color: white;
  font-weight: bold;
  border: 0;
  padding: 0;
  margin: 0 6px 0 0;
  height: 58px;
  width: 43px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  transition: background-color 0.2s ease;
}
.big-key {
  width: 65.4px;
  font-size: 75%;
}
@media screen and (max-height: 700px), screen and (max-width: 720px){
  #keyboard-cont {
    margin: 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #keyboard-cont div {
    display: flex;
  }
  .keyboard-button {
    height: 48px;
    width: 33px;
    margin: 0 4px 4px 0;
  }
  .big-key {
    width: 50px;
    font-size: 75%;
  }
}

</style>
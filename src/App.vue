<script setup lang="ts">
import {computed, ref, Ref} from "vue";
import Statistics from "./components/statistics.vue";
import store  from './components/store'

// get username from Vuex store
const username = computed(() => {
  return store.getters.getUsername
})
const displayUsername = computed(() => {
  return store.getters.getDisplayUsername
})
const userID = computed(() => {
  return store.getters.getUserID
})
const solutionWord = computed(() => {
  return store.getters.getSolutionWord
})

let showModalStatistics: Ref<boolean> = ref(false)
const title = ref("Wordle clone")

function newGame() {
 window.location.reload();
}
function revealWord() {
  console.log(solutionWord.value)
  title.value = solutionWord.value;
}

function showStatisticsModal() {
  showModalStatistics.value = true
}

</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <button @click="newGame">New Game</button>

      <div v-show="showModalStatistics" @close="showModalStatistics = false;" >
        <statistics :user-id="userID" :show-modal-statistic="showModalStatistics" @close="showModalStatistics = false"></statistics>
      </div>
    </div>
    <div class="navbar-center">
      <h1 @click="revealWord" v-text="title"></h1>
    </div>
    <div class="navbar-right">
      <button v-if="!username" @click="$router.push('/login')">Login</button>
      <button v-if="username" @click="showStatisticsModal">{{ displayUsername }}'s Stats</button>
      <button v-if="!username" @click="$router.push('/register')" >Register</button>
    </div>
  </nav>
  <router-view />
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: #3a3a3c 1px solid;
  margin-bottom: 50px;
}
.navbar-center{
  font-family: Anton,serif;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbar-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 200px;
}
.navbar-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 200px;
}
h5 {
  margin-right: 25px;
}
button {
  margin-right: 15px;
}
@media (max-width: 920px) {
  .navbar{
    margin-bottom: 15px;
    padding: 0 5px;
  }
  h1 {
    font-size: 1.2rem;
    margin-right: 40px;
  }
  .navbar-left {
    width: 100px;
  }
  .navbar-right {
    width: 100px;
  }
  .navbar-center {
    width: 150px;
  }
  button {
    margin-right: 5px;
    margin-left: 5px;
    height: 35px;
    width: 65px;
    font-size: x-small;
    margin-right: 5px;
  }
}

</style>

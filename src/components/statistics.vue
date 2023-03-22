<template>
  <HelloWordle />
  <div class="modal" @click="closeModal">
    <div class = "container" @click.stop @submit.prevent>
      <h2>Game history for {{ displayUsername }}<br></h2>
      <div v-if="isLoading"><h3>Loading...</h3></div>
    <table v-if="!isLoading" class="game-table">
      <tr>
        <th>Game</th>
        <th>Date</th>
        <th>Score</th>
        <th>Secret word</th>
        <th>Total Time</th>
        <th>Result</th>
      </tr>
      <tr v-for="(document, index) in gameStatistics" :key="index">
        <td>{{ index }}</td>
        <td>{{ new Date(document.date.seconds * 1000).toLocaleDateString() }}</td>
        <td>{{ document.score }}</td>
        <td>{{ document.secretWord }}</td>
        <td>{{ document.time }}</td>
        <td>{{document.gameResult}}</td>
      </tr>
    </table>
      <button @click="sortByDuration">Sort by duration</button>
      <button @click="sortByScore">Sort by score</button>
      <button @click="sortByDate">Sort by date</button>
      <button type="button" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import store  from './store'

import{ collection, getDocs } from "firebase/firestore"
import { initializeApp } from "@firebase/app";
import {getFirestore, Firestore} from "@firebase/firestore";
import HelloWordle from "./HelloWordle.vue";

const firebaseConfig = {
  apiKey: "AIzaSyCQm1cPSv2TByJ7qmwTuRWMPhNj6aKZl7Y",
  authDomain: "wordle-5db5b.firebaseapp.com",
  projectId: "wordle-5db5b",
  storageBucket: "wordle-5db5b.appspot.com",
  messagingSenderId: "835958338222",
  appId: "1:835958338222:web:16ad75f9dcf40ad0f9733f",
  measurementId: "G-84HV2KBLWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db:Firestore = getFirestore(app);
const gameStatistics: any[] = [];

const displayUsername = computed(() => {
  return store.getters.getDisplayUsername
})
const userID = computed(() => {
  return store.getters.getUserID
})

interface GameStatistic {
  date: string;
  score: number;
  secretWord: string;
  time: number;
  gameResult: string;
  userID: string;
}

export default defineComponent({
  name: 'Statistics',
  components: {HelloWordle},
  data() {
    return {
      isLoading: false,
      gameStatistics: [] as GameStatistic[],
      displayUsername: displayUsername.value,
      userID: userID.value
    };
  },
  mounted() {
    this.getGameStatistics();
  },
  methods: {
    closeModal() {
      this.$router.push({ name: "Home" });
    },
    async getGameStatistics() {
      this.isLoading = true;
      const querySnapshot = await getDocs(collection(db, "gameStatistics"));
      // filter the game statistics by the user id
      const filteredGameStatistics: GameStatistic[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().userID === userID.value) {
          filteredGameStatistics.push(doc.data() as GameStatistic);
        }
      });
      this.gameStatistics = filteredGameStatistics;
      this.sortByDate();
      this.isLoading = false;
    },
    sortByDuration() {
      this.gameStatistics.sort((a, b) => {
        // convert a and b to numbers and get rid of the last character
        const aTime = Number(a.time.toString().slice(0, -1));
        const bTime = Number(b.time.toString().slice(0, -1));
        return aTime - bTime;
      });
    },
    sortByScore() {
      this.gameStatistics.sort((a, b) => (a.score > b.score ? 1 : -1));
    },
    sortByDate() {
      this.gameStatistics.sort((a, b) => {
       return b.date.seconds * 1000 - a.date.seconds * 1000
      });
      console.log(this.gameStatistics)
    },
},
});

</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.game-table {
  border-collapse: collapse;
  width: 100%;
}

.game-table th, .game-table td {
  border: 4px solid black;
  padding: 8px;
  text-align: left;
  border-radius: 3px;
}

.game-table th {
  background-color: #538d4e;
  font-weight: normal;
}

form {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 65px;
  border-radius: 5px;
  margin-bottom: 150px;
}

h2 {
  margin-top: 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
button[type="button"] {
  background-color: #f44336;
  color: white;
}
button {
  margin-top: 15px;
  margin-right: 10px;
}

.container {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 65px;
  border-radius: 5px;
  margin-bottom: 150px;
}
@media (max-width: 920px) {
    .game-table th,
    .game-table td {
      border: 2px solid black;
      padding: 5px;
      font-size: 0.5rem;
    }

    form,
    .container {
      padding: 20px;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    label {
      font-size: 0.5rem;
      margin-bottom: 3px;
    }

    input[type="text"],
    input[type="password"] {
      padding: 3px;
      font-size: 0.7rem;
    }

    button {
      margin-top: 10px;
      margin-right: 5px;
      font-size: 0.7rem;
    }
  }
</style>
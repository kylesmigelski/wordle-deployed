<template>
  <HelloWordle />
  <div class="modal" @click="goHome()">
    <form @click.stop @submit.prevent>
      <h2>Log in </h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="button-row">
        <button type="submit" @click="loginEmailPassword">Submit</button>
        <button type="button" @click="goHome">Cancel</button>
      </div>
      <button type="Google" @click="googleSignIn">Sign In with Google</button>
      <h6> Hint: click the game title to reveal the solution!</h6>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from './store';

// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import {getFirestore, Firestore} from "@firebase/firestore";
import { getAnalytics } from "@firebase/analytics";
import { getAuth,signInWithPopup, signInWithEmailAndPassword, UserCredential, GoogleAuthProvider } from '@firebase/auth';
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export default defineComponent({
  name: 'LoginModal',
  components: {HelloWordle},
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' });
    },

    // login with email and password using firebase
    async loginEmailPassword(event: Event) {
      event.preventDefault();
      try {
        // We emulate login with just a username by appending @mail.com to the username so firebase can handle the login
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, this.username + "@mail.com", this.password);
        store.commit('setUsername', userCredential.user?.email)
        store.commit('setDisplayUsername', this.username)
        store.commit('setUserID', userCredential.user?.uid)
        console.log(userCredential.user?.email);
        this.goHome();
      } catch (error) {
        console.error(error);
      }
    },

    googleSignIn() {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          store.commit('setUsername', user?.email)
          store.commit('setUserID', user?.uid)
          this.goHome();
        }).catch((error) => {
          console.error(error);
        });
    }
  }
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 65px;
  border-radius: 5px;
  margin-bottom: 200px;
  width: 200px;
}

h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}
.button-row {
  display: flex;
  justify-content: space-between;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button[type="submit"],
button[type="button"] {
  display: block;
  margin-top: 10px;
  padding: 10px;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="submit"]:hover {
  background-color: #3e8e41;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}
button[type="Google"] {
  background-color: #4285f4;
  color: white;
  margin-top: 20px;
}

button[type="button"]:hover {
  background-color: #da190b;
}
</style>
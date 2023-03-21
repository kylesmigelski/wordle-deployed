<template>
  <HelloWordle />
  <div class="modal" @click="goHome()">
    <form @click.stop @submit.prevent>
      <h2>Create an account:</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <label style="font-size: 0.7rem; color: gray; margin-bottom: 8px" for="password">Must be more than 6 characters</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="button-row">
        <button type="submit" @click="createAccount">Submit</button>
        <button type="button" @click="goHome">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import HelloWordle from "./HelloWordle.vue";
// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import {getFirestore, Firestore} from "@firebase/firestore";
import { getAnalytics } from "@firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, UserCredential, sendEmailVerification } from 'firebase/auth';

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

export default defineComponent({
  components: {HelloWordle},
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    createAccount():void {
      const newEmail = this.username + "@mail.com";
      const newPassword = this.password;

      createUserWithEmailAndPassword(auth, newEmail, newPassword)
        .then((cred:UserCredential)=>{
          sendEmailVerification(cred.user);
          console.log("Account created");

          auth.signOut()
        .catch((err: any) => {
          console.error("Oops", err);});
        })
      this.goHome();
    },
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
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: rgba(0, 0, 0, 0.9);
  padding: 65px;
  width: 200px;
  border-radius: 5px;
  margin-bottom: 300px;
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
  margin-top: 15px;
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

button[type="button"]:hover {
  background-color: #da190b;
}
</style>
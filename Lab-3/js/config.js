import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQAvOQ3kR8fgQf4aeJsXQDXY4hDXPXSak",
    authDomain: "checknote-pro.firebaseapp.com",
    databaseURL: "https://checknote-pro-default-rtdb.firebaseio.com",
    projectId: "checknote-pro",
    storageBucket: "checknote-pro.appspot.com",
    messagingSenderId: "1020938240345",
    appId: "1:1020938240345:web:b71c89259ae843929a4c48"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

export { firebaseConfig, app, auth, database };

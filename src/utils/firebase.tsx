// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCB6L2OCb05M6qIzwQlK1Ky39KIEz1rJac",

  authDomain: "daliar.firebaseapp.com",

  projectId: "daliar",

  storageBucket: "daliar.appspot.com",

  messagingSenderId: "1047133935601",

  appId: "1:1047133935601:web:185e8b16c0452cb85d5650",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {});
export default app;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBK__-ICOs1XU8dFMMstr4HA_sxYCoWRIs",
  authDomain: "controle-financas-bddbd.firebaseapp.com",
  projectId: "controle-financas-bddbd",
  storageBucket: "controle-financas-bddbd.firebasestorage.app",
  messagingSenderId: "23622478380",
  appId: "1:23622478380:web:ed2f9d9646a5e29bf73f89"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

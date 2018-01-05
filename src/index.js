import React from "react";
import { render } from "react-dom";
import firebase from "firebase";
import "firebase/firestore";
import App from "./App";
import registerServiceWorker from "./createServiceWorker";
// registerServiceWorker();

firebase.initializeApp({
  apiKey: "AIzaSyDLZQ6-PFhiUQrZOuUQth_LAEJBBvnZOYA",
  authDomain: "ml8-visualizer.firebaseapp.com",
  databaseURL: "https://ml8-visualizer.firebaseio.com",
  projectId: "ml8-visualizer",
  storageBucket: "ml8-visualizer.appspot.com",
  messagingSenderId: "752477759795"
});

render(<App />, document.getElementById("root"));

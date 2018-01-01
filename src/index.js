import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import firebase from "firebase";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDLZQ6-PFhiUQrZOuUQth_LAEJBBvnZOYA",
  authDomain: "ml8-visualizer.firebaseapp.com",
  databaseURL: "https://ml8-visualizer.firebaseio.com",
  projectId: "ml8-visualizer",
  storageBucket: "ml8-visualizer.appspot.com",
  messagingSenderId: "752477759795"
});

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Start editing to see some magic happen {"\u2728"}</h2>
  </div>
);

render(<App />, document.getElementById("root"));

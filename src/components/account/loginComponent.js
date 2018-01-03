import React from "react";
import { FirebaseAuth } from "react-firebaseui";
import firebase from "firebase";
import { withRouter } from "react-router";
class LoginComponent extends React.Component {
  render() {
    return (
      <div>
        <div>
          Welcome to the Visualizer<br />
          Before using the app, you have to sign in first
        </div>
        <FirebaseAuth
          firebaseAuth={firebase.auth()}
          uiConfig={{
            signInFlow: "redirect",
            signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
              signInSuccess: () => {
                this.props.history.push("/");
                return false; // Avoid redirects after sign-in.
              }
            },
            tosUrl: "https://www.gnu.org/licenses/gpl-3.0.txt"
          }}
        />
      </div>
    );
  }
}

export default withRouter(LoginComponent);

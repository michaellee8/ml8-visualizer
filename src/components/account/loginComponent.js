import React from "react";
import firebase from "firebase";
import { withRouter } from "react-router";
import List, { ListItem, ListItemText } from "material-ui/List";
import Button from "material-ui/Button";
class LoginComponent extends React.Component {
  render() {
    return (
      <div>
        Sign in to use this app
        <Button
          onClick={() =>
            firebase
              .auth()
              .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
          }
        >
          SIGN IN WITH GOOGLE
        </Button>
      </div>
    );
  }
}

export default withRouter(LoginComponent);

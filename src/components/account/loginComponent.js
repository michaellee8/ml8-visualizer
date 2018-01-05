import React from "react";
import firebase from "firebase";
import { withRouter } from "react-router";
import List, { ListItem, ListItemText } from "material-ui/List";
class LoginComponent extends React.Component {
  render() {
    return (
      <div>
        <div>
          Welcome to the Visualizer<br />
          Before using the app, you have to sign in first
        </div>
        <List>
          <ListItem
            button
            onClick={() =>
              firebase
                .auth()
                .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            }
          >
            <ListItemText primary="SIGN IN WITH GOOGLE" />
          </ListItem>
          <ListItem
            button
            onClick={() =>
              firebase
                .auth()
                .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
            }
          >
            <ListItemText primary="SIGN IN WITH FACEBOOK" />
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withRouter(LoginComponent);

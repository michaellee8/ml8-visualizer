import React from "react";
import firebase from "firebase";
import { withRouter } from "react-router";
import injectSheet from "react-jss";
class LogoutComponent extends React.Component {
  render() {
    return (
      <div>
        <div>Click the button below to log out</div>
        <button
          className={this.props.classes.signOutButton}
          onClick={firebase
            .auth()
            .signOut()
            .then(() => this.props.history.push("/"))
            .catch(err => {
              alert("Some problem occured, you did not signOut");
              console.error(err);
            })}
        />
      </div>
    );
  }
}

export default injectSheet({
  signOutButton: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px"
  }
})(withRouter(LogoutComponent));

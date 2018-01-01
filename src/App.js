import React from "react";
import ErrorBoundary from "react-error-boundary";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import LoginComponent from "./components/account/loginComponent";
import LogoutComponent from "./components/account/logoutComponent";
import Dashboard from "./components/treeNodes/dashboard";
import firebase from "firebase";

type Props = {};
type State = { isLoggedIn: boolean, currentUserId: string };
export default class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false, currentUserId: "" };
  }
  componentWillMount() {
    this.authWatcher = firebase
      .auth()
      .onAuthStateChanged(
        user =>
          user
            ? this.setState({ isLoggedIn: true, currentUserId: user.uid })
            : this.setState({ isLoggedIn: false, currentUserId: "" })
      );
  }
  componentWillUnmount() {
    this.authWatcher();
  }
  return() {
    <ErrorBoundary
      onError={(error: Error, componentStack: string) => console.error(error)}
      FallbackComponent={() => <div>Oh, there is a app-wide crash. </div>}
    >
      <Router>
        <div>
          <Route path="/login" component={LoginComponent} />
          <Route path="/logout" component={LogoutComponent} />
          <Route
            path="/:userId/:nodeId"
            component={({ match }) => (
              <Dashboard
                userId={match.params.userId}
                nodeId={match.params.nodeId}
              />
            )}
          />
          <Redirect
            to={
              this.state.isLoggedIn
                ? `${this.state.currentUserId}/root`
                : "/login"
            }
          />
        </div>
      </Router>
    </ErrorBoundary>;
  }
}
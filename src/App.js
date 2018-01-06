import React from "react";
import ErrorBoundary from "react-error-boundary";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import LoginComponent from "./components/account/loginComponent";
import LogoutComponent from "./components/account/logoutComponent";
import Dashboard from "./components/treeNodes/dashboard";
import firebase from "firebase";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

type Props = {};
type State = { isLoggedIn: boolean, currentUserId: string };
export default class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false, currentUserId: "" };
  }
  componentWillMount() {
    this.authWatcher = firebase.auth().onAuthStateChanged(user => {
      user
        ? this.setState({ isLoggedIn: true, currentUserId: user.uid })
        : this.setState({ isLoggedIn: false, currentUserId: "" });
    });
  }
  componentWillUnmount() {
    this.authWatcher();
  }
  render() {
    return (
      <ErrorBoundary
        onError={(error: Error, componentStack: string) => console.error(error)}
        FallbackComponent={() => <div>Oh, there is a app-wide crash. </div>}
      >
        <MuiThemeProvider theme={createMuiTheme({})}>
          <Router>
            <div>
              <Switch>
                <Route
                  exact
                  path="/:userId/:nodeId"
                  component={({ match }) => (
                    <Dashboard
                      userId={match.params.userId}
                      nodeId={match.params.nodeId}
                    />
                  )}
                />
                <Route exact path="/logout" component={LogoutComponent} />
                {this.state.isLoggedIn ? (
                  <Redirect to={`${this.state.currentUserId}/root`} />
                ) : null}
                <Route exact path="/login" component={LoginComponent} />
                <Route exact path="/logout" component={LogoutComponent} />

                {this.state.isLoggedIn ? (
                  <Redirect to={`${this.state.currentUserId}/root`} />
                ) : (
                  <Redirect to={"/login"} />
                )}
              </Switch>
            </div>
          </Router>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

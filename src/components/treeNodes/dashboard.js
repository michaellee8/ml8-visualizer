import React from "react";
import AppBar from "react-appbar";
import firebase from "firebase";
import injectSheet from "react-jss";
import UpIcon from "material-ui-icons/ChangeHistory"
import EditIcon from "material-ui-icons/ModeEdit"

type Props = { nodeId: string, userId: string, classes: any };
type State = {};

class Dashboard extends React.Component<Props, State> {
  render() {
    return <div><div className={this.props.classes.appBar} >
        <div className={this.props.classes.appBarButton}><UpIcon/></div>
        <div className={this.props.classes.appBarButton}><EditIcon/>/div>
      </div></div>;
  }
}

export default injectSheet({
  appBar: { position: "fixed", width: "100%", minHeight: "50px" },
  appBarButton:{width:"50%"}
})(Dashboard);

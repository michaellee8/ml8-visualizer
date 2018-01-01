import React from "react";
import { Draggable } from "react-beautiful-dnd";
import firebase from "firebase";
import ErrorBoundary from "react-error-boundary";
import injectSheet from "react-jss";
import Linkify from "react-linkify";

type Props = {
  nodeId: string,
  userId: string,
  classes: any,
  isDragDisabled: boolean,
  color: string
};
type State = { nodeData: any };

class SingleNodes extends React.Component<Props, States> {
  componentWillMount() {
    this.treeNodeWatcher = firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("nodes")
      .doc(this.props.nodeId)
      .onSnapshot(doc => this.setState({ nodeData: doc.data() }));
  }
  componentWillUnmount() {
    this.treeNodeWatcher();
  }
  render() {
    return (
      <ErrorBoundary
        onError={(error: Error, componentStack: string) => console.error(error)}
        FallbackComponent={() => {
          <div>{this.props.nodeId}</div>;
        }}
      >
        <Draggable
          draggableId={`${this.props.userId}/${this.props.nodeId}`}
          isDragDisabled={this.props.isDragDisabled}
        >
          {(provided, snapshot) => (
            <div>
              <div
                className={this.props.classes.treeNodeRoot}
                ref={provided.innerRef}
                style={{ color: this.props.color, ...provided.draggableStyle }}
                {...provided.dragHandleProps}
              >
                <Linkify>{this.state.nodeData.text}</Linkify>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Draggable>
      </ErrorBoundary>
    );
  }
}

export default injectSheet({
  treeNodeRoot: {
    // minHeight: "2em",
    borderRadius: "0.5em",
    // width: "100%",
    margin: "0.5em",
    textAlign: "center",
    /* border: 0.1em solid black;*/
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    boxSizing: "border-box",
    flex: "1 1 auto"
  },
  treeNodeContent: {
    margin: "0.5em"
    // "mix-blend-mode": "difference"
  }
})(SingleNodes);

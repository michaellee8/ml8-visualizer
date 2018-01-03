import React from "react";
import { Draggable } from "react-beautiful-dnd";
import firebase from "firebase";
import ErrorBoundary from "react-error-boundary";
import injectSheet from "react-jss";
import Linkify from "react-linkify";
import idToColor from "../../idToColor";

type Props = {
  nodeId: string,
  userId: string,
  classes: any,
  isDragDisabled: boolean,
  color: string
};
type State = { nodeData: any };

class SingleNodes extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { nodeData: null };
  }
  componentWillMount() {
    this.treeNodeWatcher = firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("nodes")
      .doc(this.props.nodeId)
      .onSnapshot(doc => this.setState({ nodeData: doc.data() }));
  }
  componentWillReceiveProps(nextProps) {
    if (this.treeNodeWatcher) {
      this.treeNodeWatcher();
    }

    this.treeNodeWatcher = firebase
      .firestore()
      .collection("users")
      .doc(nextProps.userId)
      .collection("nodes")
      .doc(nextProps.nodeId)
      .onSnapshot(doc => this.setState({ nodeData: doc.data() }));
  }
  componentWillUnmount() {
    if (this.treeNodeWatcher) {
      this.treeNodeWatcher();
    }
  }
  render() {
    return (
      <ErrorBoundary
        onError={(error: Error, componentStack: string) => console.error(error)}
        FallbackComponent={() => <div>{this.props.nodeId}</div>}
      >
        {this.state.nodeData ? (
          <Draggable
            draggableId={`${this.props.userId}/${this.props.nodeId}`}
            isDragDisabled={this.props.isDragDisabled}
          >
            {(provided, snapshot) => (
              <div
                className={this.props.classes.treeNodeRoot}
                ref={provided.innerRef}
                style={{
                  backgroundColor: idToColor(
                    `${this.props.userId}/${this.props.nodeId}`
                  ),
                  ...provided.draggableStyle
                }}
                {...provided.dragHandleProps}
              >
                <div>
                  <Linkify className={this.props.classes.treeNodeContent}>
                    {this.state.nodeData.text}
                  </Linkify>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Draggable>
        ) : (
          <div>loading</div>
        )}
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
    padding: "1em",
    boxSizing: "border-box",
    flex: "1 1 auto"
  },
  treeNodeContent: {
    margin: "0.5em"
    // "mix-blend-mode": "difference"
  }
})(SingleNodes);

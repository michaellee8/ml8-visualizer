import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import firebase from "firebase";
import ErrorBoundary from "react-error-boundary";
import injectSheet from "react-jss";
import Linkify from "react-linkify";
import SingleNodes from "./singleNodes";
import idToColor from "../../idToColor";

type Props = {
  nodeId: string,
  userId: string,
  classes: any,
  isDragDisabled: boolean,
  isDropDisabled: boolean
};
type State = { nodeData: any, connectionData: any };

class VerticalNodes extends React.Component<Props, States> {
  componentWillMount() {
    this.treeNodeWatcher = firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("nodes")
      .doc(this.props.nodeId)
      .onSnapshot(doc => this.setState({ nodeData: doc.data() }));
    this.treeConnectionWatcher = firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("connections")
      .where("src", "==", this.props.nodeId)
      .orderBy("stamp", "desc")
      .onSnapshot(querySnapshot => {
        var datas = [];
        querySnapshot.forEach(doc => datas.push(doc.data()));
        this.setState({ connectionData: datas });
      });
  }
  componentWillUnmount() {
    this.treeNodeWatcher();
    this.treeConnectionWatcher();
  }
  render() {
    return (
      <ErrorBoundary
        onError={(error: Error, componentStack: string) => console.error(error)}
        FallbackComponent={() => <div>{this.props.nodeId}</div>}
      >
        <Draggable
          draggableId={`${this.props.userId}/${this.props.nodeId}`}
          isDragDisabled={this.props.isDragDisabled}
        >
          {(provided, snapshot) => (
            <div className={this.props.classes.treeNodeRoot}>
              <div
                ref={provided.innerRef}
                style={{ color: this.props.color, ...provided.draggableStyle }}
                {...provided.dragHandleProps}
              >
                <Linkify className={this.props.classes.treeNodeContent}>
                  {this.state.nodeData.text}
                </Linkify>
                <Droppable
                  droppableId={`${this.props.userId}/${this.props.nodeId}`}
                  isDropDisabled={this.props.isDropDisabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={{
                        backgroundColor: idToColor(
                          `${this.props.userId}/${this.props.nodeId}`
                        )
                      }}
                    >
                      {this.state.connectionData.map(connectionData => (
                        <SingleNodes
                          key={connectionData.des}
                          nodeId={connectionData.des}
                          userId={this.props.userId}
                          isDragDisabled={false}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
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
})(VerticalNodes);

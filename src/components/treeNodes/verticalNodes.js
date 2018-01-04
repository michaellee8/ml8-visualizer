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

class VerticalNodes extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { nodeData: null, connectionData: null };
  }
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
  componentWillReceiveProps(nextProps) {
    if (this.treeNodeWatcher) {
      this.treeNodeWatcher();
    }
    if (this.treeConnectionWatcher) {
      this.treeConnectionWatcher();
    }
    this.treeNodeWatcher = firebase
      .firestore()
      .collection("users")
      .doc(nextProps.userId)
      .collection("nodes")
      .doc(nextProps.nodeId)
      .onSnapshot(doc => this.setState({ nodeData: doc.data() }));
    this.treeConnectionWatcher = firebase
      .firestore()
      .collection("users")
      .doc(nextProps.userId)
      .collection("connections")
      .where("src", "==", nextProps.nodeId)
      .orderBy("stamp", "desc")
      .onSnapshot(querySnapshot => {
        var datas = [];
        querySnapshot.forEach(doc => datas.push(doc.data()));
        this.setState({ connectionData: datas });
      });
  }
  componentWillUnmount() {
    if (this.treeNodeWatcher) {
      this.treeNodeWatcher();
    }
    if (this.treeConnectionWatcher) {
      this.treeConnectionWatcher();
    }
  }
  render() {
    return (
      <div style={{ display: "block" }}>
        <ErrorBoundary
          onError={(error: Error, componentStack: string) =>
            console.error(error)
          }
          FallbackComponent={() => <div>{this.props.nodeId}</div>}
        >
          {this.state.nodeData && this.state.connectionData ? (
            <Draggable
              type="COLUMN"
              draggableId={`${this.props.userId}/${this.props.nodeId}`}
              isDragDisabled={this.props.isDragDisabled}
            >
              {(provided, snapshot) => (
                <div>
                  <div
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: idToColor(
                        `${this.props.userId}/${this.props.nodeId}`
                      ),
                      ...provided.draggableStyle
                    }}
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
                          className={this.props.classes.treeNodeRoot}
                          ref={provided.innerRef}
                          style={{
                            backgroundColor: idToColor(
                              `${this.props.userId}/${this.props.nodeId}`
                            ),
                            minHeight: "12em"
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
          ) : (
            <div>loading</div>
          )}
        </ErrorBoundary>
      </div>
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
    padding: "0.5em",
    boxSizing: "border-box",
    flex: "1 1 auto"
  },
  treeNodeContent: {
    margin: "0.5em"
    // "mix-blend-mode": "difference"
  }
})(VerticalNodes);

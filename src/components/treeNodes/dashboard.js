import React from "react";
import firebase from "firebase";
import injectSheet from "react-jss";
import UpIcon from "material-ui-icons/ChangeHistory";
import EditIcon from "material-ui-icons/ModeEdit";
import BackIcon from "material-ui-icons/ArrowBack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HorizontalNodes from "./horizontalNodes";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import { withRouter } from "react-router";

type Props = { nodeId: string, userId: string, classes: any, history: any };
type State = {
  disableEditDrag: boolean,
  horizontalDropDisabled: boolean,
  editDialogOpen: boolean,
  editDialogMode: "edit" | "add",
  editDialogId: string,
  editDialogContent: string,
  editDialogBlockAction: boolean
};

class Dashboard extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.state = {
      disableEditDrag: false,
      horizontalDropDisabled: false,
      editDialogOpen: false,
      editDialogMode: "edit",
      editDialogId: "",
      editDialogContent: "",
      editDialogBlockAction: false
    };
  }
  handleEditDialogClose = () => this.setState({ editDialogOpen: false });
  handleEditDialogContentChange = event =>
    this.setState({ editDialogContent: event.target.value });
  handleEditDialogDelete = () => {
    if (this.state.editDialogBlockAction === true) {
      return;
    }
    this.setState({ editDialogBlockAction: true });
    if (!window.confirm("Do you sure you want to delete?")) {
      return;
    }
    return firebase
      .firestore()
      .collection("users")
      .doc(this.state.editDialogId.split("/")[0])
      .collection("connections")
      .where("des", "==", this.state.editDialogId.split("/")[1])
      .get()
      .then(querySnapshot =>
        Promise.all(querySnapshot.docs.map(doc => doc.ref.delete()))
      )
      .then(() =>
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.editDialogId.split("/")[0])
          .collection("connections")
          .where("src", "==", this.state.editDialogId.split("/")[1])
          .get()
      )
      .then(querySnapshot =>
        Promise.all(querySnapshot.docs.map(doc => doc.ref.delete()))
      )
      .then(() =>
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.editDialogId.split("/")[0])
          .collection("nodes")
          .doc(this.state.editDialogId.split("/")[1])
          .delete()
      )
      .then(() => {
        this.handleEditDialogClose();
        this.setState({ editDialogBlockAction: false });
      })
      .catch(err => {
        window.alert("Some promblem happened, delete failed");
        console.log(err);
      });
  };
  handleEditDialogAdd = () => {
    if (this.state.editDialogBlockAction === true) {
      return;
    }
    this.setState({ editDialogBlockAction: true });
    return firebase
      .firestore()
      .collection("users")
      .doc(this.state.editDialogId.split("/")[0])
      .collection("nodes")
      .add({ text: this.state.editDialogContent })
      .then(docRef =>
        firebase
          .firestore()
          .collection("users")
          .doc(this.state.editDialogId.split("/")[0])
          .collection("connections")
          .add({
            stamp: Date.now(),
            type: "primary",
            src: this.state.editDialogId.split("/")[1],
            des: docRef.id
          })
      )
      .then(() => {
        this.handleEditDialogClose();
        this.setState({ editDialogBlockAction: false });
      })
      .catch(err => {
        window.alert("Add nodes failed.");
        console.log(err);
      });
  };
  handleEditDialogEdit = () => {
    if (this.state.editDialogBlockAction === true) {
      return;
    }
    this.setState({ editDialogBlockAction: true });
    return firebase
      .firestore()
      .collection("users")
      .doc(this.state.editDialogId.split("/")[0])
      .collection("nodes")
      .doc(this.state.editDialogId.split("/")[1])
      .set({ text: this.state.editDialogContent }, { merge: true })
      .then(() => {
        this.handleEditDialogClose();
        this.setState({ editDialogBlockAction: false });
      })
      .catch(err => {
        window.alert("Edit nodes failed.");
        console.log(err);
      });
  };
  onDragStart(initial) {}
  onDragEnd(result) {
    // No destination
    if (!result.destination) {
      return;
    }

    // Drop to upDrop -> navigate
    if (
      result.destination.droppableId === "upDrop" ||
      result.destination.droppableId === "upDropCol"
    ) {
      this.props.history.push(`/${result.draggableId}`);
      return;
    }

    // Drop to editDrop -> edit component
    if (
      result.destination.droppableId === "editDrop" ||
      result.destination.droppableId === "editDropCol"
    ) {
      return firebase
        .firestore()
        .collection("users")
        .doc(result.draggableId.split("/")[0])
        .collection("nodes")
        .doc(result.draggableId.split("/")[1])
        .get()
        .then(doc =>
          this.setState({
            editDialogOpen: true,
            editDialogContent: doc.data().text,
            editDialogId: result.draggableId,
            editDialogMode: "edit"
          })
        )
        .catch(err => {
          window.alert("Edit nodes failed.");
          console.log(err);
        });
    }

    // Drag from editDrag -> insert new component
    if (
      result.draggableId === "editDrag" ||
      result.draggableId === "editDragCol"
    ) {
      return this.setState({
        editDialogOpen: true,
        editDialogContent: "",
        editDialogId: result.destination.droppableId,
        editDialogMode: "add"
      });
    }

    // Insert to correct place for reordering/inserting
    firebase
      .firestore()
      .collection("users")
      .doc(result.destination.droppableId.split("/")[0])
      .collection("connections")
      .where("src", "==", result.destination.droppableId.split("/")[1])
      .orderBy("stamp", "desc")
      .get()
      .then(querySnapshot => {
        var { docs } = querySnapshot;
        var stamp;
        if (result.destination.index === 0) {
          stamp = Date.now();
        } else if (result.destination.index === docs.length - 1) {
          stamp = docs[docs.length - 1].data().stamp - 1000;
        } else {
          stamp =
            (docs[result.destination.index].data().stamp +
              docs[result.destination.index - 1].data().stamp) /
            2;
        }
        return firebase
          .firestore()
          .collection("users")
          .doc(result.destination.droppableId.split("/")[0])
          .collection("connections")
          .where("des", "==", result.draggableId.split("/")[1])
          .get()
          .then(querySnapshot => {
            console.log(querySnapshot);
            return firebase
              .firestore()
              .collection("users")
              .doc(result.destination.droppableId.split("/")[0])
              .collection("connections")
              .doc(querySnapshot.docs[0].id)
              .set(
                {
                  stamp: stamp,
                  src: result.destination.droppableId.split("/")[1]
                },
                { merge: true }
              );
          });
      })
      .catch(err => console.log(err));
    return;
  }
  render() {
    return (
      <div>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.state.editDialogOpen}
          onClose={this.handleEditDialogClose}
        >
          <DialogTitle>{`${this.state.editDialogMode}ing ${
            this.state.editDialogId
          }`}</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              label="Content"
              value={this.state.editDialogContent}
              onChange={this.handleEditDialogContentChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions
            classes={{ root: this.props.classes.muiDialogActionsRoot }}
          >
            {this.state.editDialogMode === "edit" ? (
              <Button
                raised
                color="accent"
                onClick={this.handleEditDialogDelete}
              >
                DELETE
              </Button>
            ) : null}
            {this.state.editDialogMode === "edit" ? (
              <div style={{ width: "100%" }} className="" />
            ) : null}
            {this.state.editDialogMode === "edit" ? (
              <Button
                raised
                color="primary"
                onClick={this.handleEditDialogEdit}
              >
                EDIT
              </Button>
            ) : (
              <Button raised color="primary" onClick={this.handleEditDialogAdd}>
                ADD
              </Button>
            )}
            <Button color="secondary" onClick={this.handleEditDialogClose}>
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <div className={this.props.classes.appBar}>
            <Button
              className={this.props.classes.appBarButtonSmall}
              onClick={() =>
                firebase
                  .firestore()
                  .collection("users")
                  .doc(this.props.userId)
                  .collection("connections")
                  .where("des", "==", this.props.nodeId)
                  .get()
                  .then(
                    querySnapshot =>
                      querySnapshot.docs[0]
                        ? this.props.history.push(
                            `/${this.props.userId}/${
                              querySnapshot.docs[0].data().src
                            }`
                          )
                        : null
                  )
              }
            >
              <BackIcon />
            </Button>
            <div className={this.props.classes.appBarButton}>
              <Droppable droppableId="upDrop">
                {(provided, snapshot) => (
                  <div
                    className={this.props.classes.treeNodeRoot}
                    style={{ backgroundColor: "Yellow" }}
                    ref={provided.innerRef}
                  >
                    <div
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "table"
                      }}
                    >
                      <UpIcon
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "table"
                        }}
                      />{" "}
                      ROW
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className={this.props.classes.appBarButton}>
              <Droppable droppableId="editDrop">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    <Draggable
                      draggableId="editDrag"
                      isDragDisabled={this.state.disableEditDrag}
                    >
                      {(provided, snapshot) => (
                        <div>
                          <div
                            className={this.props.classes.treeNodeRoot}
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: "LightBlue",
                              height: "100%",
                              width: "auto",
                              /* maxWidth: "5em", */
                              ...provided.draggableStyle
                            }}
                            {...provided.dragHandleProps}
                          >
                            <div
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                display: "table"
                              }}
                            >
                              <EditIcon
                                style={{
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "table"
                                }}
                              />
                            </div>ROW
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className={this.props.classes.appBarButton}>
              <Droppable type="COLUMN" droppableId="upDropCol">
                {(provided, snapshot) => (
                  <div
                    className={this.props.classes.treeNodeRoot}
                    style={{ backgroundColor: "Yellow" }}
                    ref={provided.innerRef}
                  >
                    <div
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "table"
                      }}
                    >
                      <UpIcon
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "table"
                        }}
                      />{" "}
                      COLUMN
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className={this.props.classes.appBarButton}>
              <Droppable type="COLUMN" droppableId="editDropCol">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    <Draggable
                      type="COLUMN"
                      draggableId="editDragCol"
                      isDragDisabled={this.state.disableEditDrag}
                    >
                      {(provided, snapshot) => (
                        <div>
                          <div
                            className={this.props.classes.treeNodeRoot}
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: "LightBlue",
                              height: "100%",
                              width: "auto",
                              /* maxWidth: "5em", */
                              ...provided.draggableStyle
                            }}
                            {...provided.dragHandleProps}
                          >
                            <div
                              style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                display: "table"
                              }}
                            >
                              <EditIcon
                                style={{
                                  marginLeft: "auto",
                                  marginRight: "auto",
                                  display: "table"
                                }}
                              />
                            </div>COLUMN
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
          <HorizontalNodes
            nodeId={this.props.nodeId}
            userId={this.props.userId}
            isDropDisabled={this.state.horizontalDropDisabled}
            isDragDisabled={false}
          />
        </DragDropContext>
      </div>
    );
  }
}

export default withRouter(
  injectSheet({
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
    },
    appBar: {
      width: "100%",
      position: "static",
      "z-index": "1000",
      top: "0",
      left: "0",
      height: "50px",
      border: "none",
      "background-color": "rgba(255,255,255,1)",
      "box-shadow": "0px 3px 2px 0px rgba(50, 50, 50, 0.2)"
    },
    appBarButton: { width: "20%", height: "100%", display: "inline-block" },
    appBarButtonSmall: { width: "10%", height: "100%", display: "inline-block" }
  })(withMobileDialog()(Dashboard))
);

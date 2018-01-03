import React from "react";
import firebase from "firebase";
import injectSheet from "react-jss";
import UpIcon from "material-ui-icons/ChangeHistory";
import EditIcon from "material-ui-icons/ModeEdit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import HorizontalNodes from "./horizontalNodes";
import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";

type Props = { nodeId: string, userId: string, classes: any };
type State = { disableEditDrag: boolean, horizontalDropDisabled: boolean };

class Dashboard extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.state = { disableEditDrag: false, horizontalDropDisabled: false };
  }
  onDragStart(initial) {}
  onDragEnd() {}
  render() {
    return (
      <div>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          <div className={this.props.classes.appBar}>
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
              <Droppable type="COLUMN" droppableId="upDrop">
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
              <Droppable type="COLUMN" droppableId="editDrop">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    <Draggable
                      type="COLUMN"
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
  appBarButton: { width: "25%", height: "100%", display: "inline-block" }
})(Dashboard);

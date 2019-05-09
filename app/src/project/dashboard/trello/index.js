import React, { Component } from 'react'
import Board from 'react-trello'
import _ from 'lodash'
import CardComponent from './card'
import TodoTaskForm from './todoTask'
import DoneTaskForm from './doneTask'
import CreateTaskForm from './card/createTask'

var $ = window.$

/* CARD STYLING */
const cardStyle = {
    maxWidth:'50px',
    color:'#000',
    backgroundColor:'#fff',
    fontFamily: 'Exo 2'
}

/* LANE STYLING */
const lanesStyle = {
    color:'#fff',
    backgroundColor:'#f7931e',
    fontFamily: 'Exo 2'
}

class TrelloComponent extends Component {

  constructor(props){
    super(props);
    this.state = {eventBus: null, data : null}
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.onTaskChange = this.onTaskChange.bind(this)
    this.setEventBus = this.setEventBus.bind(this)
    this.eventBus = null
    this.cancel = this.cancel.bind(this)
  }
  setEventBus(handle){this.setState({eventBus: handle})}
  onTaskChange(nextData){this.setState({data:  nextData})}
  handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails){
         this.setState(
                {
                cancel:
                    {
                    type: 'MOVE_CARD',
                    fromLaneId: targetLaneId,
                    toLaneId: sourceLaneId,
                    cardId: cardId,
                    index: 0
                    },
                task: cardDetails
                }, () => {
                if(sourceLaneId === 'lane_done'){
                    this.cancel()
                }
                else if(sourceLaneId !== targetLaneId){
                    if(targetLaneId === 'lane_todo'){
                        $('#modal_todotask').modal('open');
                    }
                    if(targetLaneId === 'lane_done'){
                        $('#modal_donetask').modal('open');
                    }
                }
            })
  }

  cancel(){this.state.eventBus.publish(this.state.cancel)}

  componentDidMount(){
    this.updateTasks()
  }

  updateTasks(){
    var lanes = [
        {
          id: 'lane_backlog',
          title: 'BACKLOG',
          label: '?/?',
          cards: [],
          style: lanesStyle
        },
        {
          id: 'lane_todo',
          title: 'TODO',
          label: '?/?',
          cards: [],
          style: lanesStyle
        },
        {
          id: 'lane_done',
          title: 'DONE',
          label: '?/?',
          cards: [],
          style: lanesStyle
        }
     ]
     if(this.props.revision) {
      var  getParentRevisions = (revisionId, parentRevisionIds) => {
        parentRevisionIds.push(revisionId)
        var revision = this.props.revisions.filter(revision => revision._id === revisionId)[0]
        revision.prevLinks.map(prevLink => getParentRevisions(prevLink.revision,parentRevisionIds) )
      }
      var parentRevisionIds = []
      getParentRevisions(this.props.revision._id, parentRevisionIds)
 
      for (var task of this.props.tasks){
          for (var lane of lanes){
            if(lane.id === task.lane){
                  task.id = task._id
                  task.enabled = true
                  if(lane.id === 'lane_done'){
                      if(parentRevisionIds.includes(task.revision)){
                        lane.cards.push(task);
                      }
                  } else {
                    if( !this.props.revision || this.props.revision.status.includes(...task.actions)){
                      lane.cards.push(task);
                    }
                  }
            }
          }
        }
     } else {
      for (var task of this.props.tasks){
        for (var lane of lanes){
          if(lane.id === task.lane){
                task.id = task._id
                task.enabled = true
                    lane.cards.push(task);
          }
        }
      }
     }
     
    const data = {lanes: lanes}
    this.setState({data:data});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tasks !== this.props.tasks){
            this.updateTasks()
    }
    if (prevProps.revision !== this.props.revision){
            this.updateTasks()
    }
    $('#modal_task').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
    });
    $('#modal_createtask').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
    });
   }


  render() {
        let trelloComponent;
        let todoTaskFormComponent;
        let doneTaskFormComponent;
        let createTaskFormComponent;
        let createTaskButtonComponent;

        if (this.props.tasks){
          if (this.state.data){
            trelloComponent = <Board data={this.state.data} style= {
                    { backgroundColor:'transparent',
                    fontFamily: 'Exo 2'}
                }
                onDataChange={this.onTaskChange}
                handleDragEnd={this.handleDragEnd}
                eventBusHandle={this.setEventBus}
                customCardLayout
                draggable
                laneDraggable={false}
                >
                <CardComponent />
                </Board>
          }
          if (this.state.cancel){
            todoTaskFormComponent =  <TodoTaskForm  project={this.props.project}  revision= {this.props.revision} task={this.state.task} event={this.state.cancel} cancel={this.cancel} />
            doneTaskFormComponent =  <DoneTaskForm  project={this.props.project}  revision= {this.props.revision} task={this.state.task} event={this.state.cancel} cancel={this.cancel} />
          }
          createTaskButtonComponent = <a className="btn-floating waves-effect waves-light modal-trigger" href="#modal_createtask">
                                          <i className="material-icons">add</i>
                                      </a>
          createTaskFormComponent =  <CreateTaskForm project={this.props.project} revision= {this.props.revision}  />

        }
        return  (
         <div className="section">
                {createTaskButtonComponent}
                {createTaskFormComponent}
                {trelloComponent}
                {todoTaskFormComponent}
                {doneTaskFormComponent}
         </div>
        );
    }
}

export default TrelloComponent;
import React, { Component } from 'react'
import Board from 'react-trello'
import _ from 'lodash'
import CardComponent from './card'
import TodoTaskForm from './todoTask'
import DoneTaskForm from './doneTask'
import CreateTaskForm from './card/createTask'
import common from 'common'
var $ = window.$

/* CARD STYLING */
const normalCardStyle = {
    minWidth: '200px',
    width: '200px',
    maxWidth: '200px',
    marginBottom: '10px',
    color:'#000',
    backgroundColor:'#fff',
    padding: '0',
    fontFamily: 'Exo 2',
    textShadow:"-1px -1px 0 #fff, 1px -1px 0 #fff,  -1px 1px 0 #fff, 1px 1px 0 #fff"
}
const selectedCardStyle = {
    minWidth: '210px',
    width: '210px',
    maxWidth: '210px',
    marginBottom: '10px',
    color:'#000',
    backgroundColor:'#fff',
    padding: '0',
    fontFamily: 'Exo 2',
    textShadow:"-1px -1px 0 #fff, 1px -1px 0 #fff,  -1px 1px 0 #fff, 1px 1px 0 #fff"
}

/* LANE STYLING */
const lanesStyle = {
    minWidth: '220px',
    width: '220px',
    maxWidth: '220px',
    color:'#fff',
    backgroundColor:  'rgba(247,147,30, .5)',
    fontFamily: 'Exo 2',
    textShadow:"-2px -2px 2px #f7931e, 2px -2px 2px #f7931e,  -2px 2px 2px #f7931e, 2px 2px 2px #f7931e"
}

class TrelloComponent extends Component {

  constructor(props){
    super(props);
    this.state = {eventBus: null, data : null}
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.onTaskChange = this.onTaskChange.bind(this)
    this.onCardClick = this.onCardClick.bind(this)
    this.setEventBus = this.setEventBus.bind(this)
    this.eventBus = null
    this.cancel = this.cancel.bind(this)
  }
  setEventBus(handle){this.setState({eventBus: handle})}
  onTaskChange(nextData){this.setState({data:  nextData})}
  onCardClick(cardId, metadata, laneId){
    
  }
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
      for (var task of this.props.tasks){
        var prevTaskIds = [] 

        var ascend = (taskId, prevTaskIds) => {
          prevTaskIds.push(taskId)
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.prev.map((prevTaskId) => ascend(prevTaskId, prevTaskIds))
        }
        if(this.props.task) ascend(this.props.task._id, prevTaskIds)
        console.log(prevTaskIds)
        for (var lane of lanes){
          if(lane.id === task.lane){
                task.id = task._id
                task.enabled = true
                task.focused = false
                task.style = normalCardStyle
                if(task.lane !== "lane_done" && this.props.task && common.STATUS[this.props.task.action].includes(task.action)){
                    
                  lane.cards.push(task);
                }

                if(task.lane === "lane_done" && this.props.task && prevTaskIds.includes(task._id)){
                    task.focused = this.props.task._id === task._id
                    task.style =  task.focused? selectedCardStyle:normalCardStyle
                    lane.cards.push(task);
                }
                if(!this.props.task){
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
    if (prevProps.task !== this.props.task){
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
                onCardClick={this.onCardClick}
                customCardLayout
                draggable
                laneDraggable={false}
                >
                <CardComponent />
                </Board>
          }
          if (this.state.task && this.state.cancel){
            todoTaskFormComponent =  <TodoTaskForm  selectedTask={this.props.task} task={this.state.task} event={this.state.cancel} cancel={this.cancel} />
            doneTaskFormComponent =  <DoneTaskForm   selectedTask={this.props.task}  task={this.state.task} event={this.state.cancel} cancel={this.cancel} />
          }
          createTaskButtonComponent = <a className="btn-floating waves-effect waves-light modal-trigger" href="#modal_createtask">
                                          <i className="material-icons">add</i>
                                      </a>
          createTaskFormComponent =  <CreateTaskForm project={this.props.project} />

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
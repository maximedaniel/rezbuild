import React, { Component } from 'react'
import Board from 'react-trello'
import CardComponent from './card'
import BacklogTaskForm from './backlogTask'
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
    let cancel = {
      type: 'MOVE_CARD',
      fromLaneId: targetLaneId,
      toLaneId: sourceLaneId,
      cardId: cardId,
      index: 0
    }
    if(cardDetails.enabled){
      if(sourceLaneId === 'lane_backlog'){
        if(targetLaneId === 'lane_todo'){
          this.setState(
            {
            cancel: cancel,
            task: cardDetails
            }, () => {$('#modal_todotask').modal('open');})
          return
        }
        if(targetLaneId === 'lane_done'){
          this.setState(
            {
            cancel: cancel,
            task: cardDetails
            }, () => {$('#modal_donetask').modal('open');})
          return
        }
      }
      if(sourceLaneId === 'lane_todo'){
        if(targetLaneId === 'lane_backlog'){
          this.setState(
            {
            cancel: cancel,
            task: cardDetails
            }, () => {$('#modal_backlogtask').modal('open');})
          return
        }
        if(targetLaneId === 'lane_done'){
          this.setState(
            {
            cancel: cancel,
            task: cardDetails
            }, () => {$('#modal_donetask').modal('open');})
          return
        }
      }
      if(sourceLaneId === 'lane_done'){
        if(targetLaneId === 'lane_todo'){
          this.setState(
            {
            cancel: null,
            task: null
            }, () => {this.state.eventBus.publish(cancel);})
          return
        }
        if(targetLaneId === 'lane_backlog'){
          this.setState(
            {
            cancel: cancel,
            task: cardDetails
            }, () => {$('#modal_backlogtask').modal('open');})
          return
        }
      }
    }
    this.setState(
      {
      cancel: null,
      task: null
      }, () => {this.state.eventBus.publish(cancel);})
    return

    /*this.setState(
            {
            cancel: cancel,
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
        })*/
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

     lanes.forEach(lane => {
        this.props.tasks.forEach(task => {
          if(task.action === 'INIT') return
          if(lane.id === task.lane){
            task.id = task._id
            task.enabled = false
            task.focused = false
            task.dashed = false
            task.userDetails = task.user?this.props.users.filter(user => user._id === task.user)[0]: ''
            task.style = normalCardStyle
            if(this.props.task){
              /* BACKLOG */
              var prevTaskIds = [] 
              var ascend = (taskId, prevTaskIds) => {
                prevTaskIds.push(taskId)
                var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                currTask.prev.forEach((prevTaskId) => ascend(prevTaskId, prevTaskIds))
              }
              ascend(this.props.task._id, prevTaskIds)

              if(lane.id === 'lane_backlog'){
                if(common.STATUS[this.props.task.action].includes(task.action)){
                  task.enabled = true
                }

              }
              /* BACKLOG */
              if(lane.id === 'lane_todo'){
                task.enabled = prevTaskIds.includes(task._id)
                task.focused = task.dashed =  this.props.task._id === task._id
                
              }
              /* DONE */
              if(lane.id === 'lane_done'){
                task.enabled = prevTaskIds.includes(task._id)
                task.focused = this.props.task._id === task._id
              }
            }

            lane.cards.push(task);
          }
        })
     })
      /*for (var task of this.props.tasks){
        var prevTaskIds = [] 

        var ascend = (taskId, prevTaskIds) => {
          prevTaskIds.push(taskId)
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.prev.map((prevTaskId) => ascend(prevTaskId, prevTaskIds))
        }
        if(this.props.task) ascend(this.props.task._id, prevTaskIds)
        for (var lane of lanes){
          if(lane.id === task.lane){
                task.id = task._id
                task.enabled = false
                task.focused = false
                task.userDetails = task.user?this.props.users.filter(user => user._id === task.user)[0]: ''
                task.style = normalCardStyle
                if(task.lane !== "lane_done" && this.props.task && common.STATUS[this.props.task.action].includes(task.action)){
                  task.enabled = true    
                }

                if(task.lane === "lane_done" && this.props.task && prevTaskIds.includes(task._id)){
                    task.enabled = true    
                    task.focused = this.props.task._id === task._id
                    task.style =  task.focused? selectedCardStyle:normalCardStyle
                }
                if(!this.props.task){
                    task.enabled = true    
                }
                task.cardDraggable = task.enabled 
                lane.cards.push(task);
          }
        }
      }*/

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
        let backlogTaskFormComponent;
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
            backlogTaskFormComponent =  <BacklogTaskForm  setTask={this.props.setTask} selectedTask={this.props.task} tasks={this.props.tasks} task={this.state.task} users={this.props.users} event={this.state.cancel} cancel={this.cancel} />
            todoTaskFormComponent =  <TodoTaskForm  selectedTask={this.props.task} task={this.state.task} users={this.props.users} event={this.state.cancel} cancel={this.cancel} />
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
                {backlogTaskFormComponent}
                {todoTaskFormComponent}
                {doneTaskFormComponent}
         </div>
        );
    }
}

export default TrelloComponent;
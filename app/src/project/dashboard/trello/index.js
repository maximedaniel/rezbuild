/**
 * @class Trello
 * @extends Component
 * @description Create the trello part of the dashboard
 */
import React, { Component } from 'react'
import Board from 'react-trello'
import CardComponent from './card'
import BacklogTaskForm from './backlogTaskForm'
import TodoTaskForm from './todoTaskForm'
import DoneTaskForm from './doneTaskForm'
import CreateTaskForm from './card/createTaskForm'
import common from 'common'
var $ = window.$


/* CARD STYLING */
const normalCardStyle = {
    minWidth: '15em',
    width: '15em',
    maxWidth: '15em',
    marginBottom: '10px',
    color:'#000',
    backgroundColor:'#fff',
    padding: '0',
    fontFamily: 'Exo 2',
    textShadow:"-1px -1px 0 #fff, 1px -1px 0 #fff,  -1px 1px 0 #fff, 1px 1px 0 #fff"
}


/* LANE STYLING */
const lanesStyle = {
    minWidth: '18em',
    width: '18em',
    maxWidth: '18em',
    maxHeight:'100%',
    color:'#fff',
    backgroundColor:  'rgba(247,147,30, .5)',
    fontFamily: 'Exo 2',
    textShadow:"-2px -2px 2px #f7931e, 2px -2px 2px #f7931e,  -2px 2px 2px #f7931e, 2px 2px 2px #f7931e"
}

var lanesModel = [
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

var eventBus = undefined;

class TrelloComponent extends Component {

  constructor(props){
    super(props);
    this.state = {cancelForm:null, data : {lanes:lanesModel}};

  }

  setEventBus = (handle) => eventBus = handle;
  
  onTaskChange = (nextData) =>  {
      nextData.lanes = nextData.lanes.map(lane => {
        lane.cards = lane.cards.map( card => {
            card.laneId = card.lane;
            return card;
        });
        return lane;
    });
    this.setState({data:nextData});
  }
  cancel = () => eventBus.publish(this.state.cancelForm);

  handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {

    let cancelForm = {
      type: 'MOVE_CARD',
      fromLaneId: targetLaneId,
      toLaneId: sourceLaneId,
      cardId: cardId,
      index: 0
    }

    if(cardDetails.draggable){
      if(sourceLaneId === 'lane_backlog'){
        if(targetLaneId === 'lane_todo'){
          this.setState(
            {
              cancelForm: cancelForm,
              task: cardDetails
            }, () => $('#modal_todotask').modal('open'))
          return
        }
        if(targetLaneId === 'lane_done'){
          this.setState(
            {
              cancelForm: cancelForm,
            task: cardDetails
            }, () => $('#modal_donetask').modal('open'))
          return
        }
      }
      if(sourceLaneId === 'lane_todo'){
        if(targetLaneId === 'lane_backlog'){
          this.setState(
            {
              cancelForm: cancelForm,
            task: cardDetails
            }, () => $('#modal_backlogtask').modal('open'))
          return
        }
        if(targetLaneId === 'lane_done'){
          this.setState(
            {
              cancelForm: cancelForm,
            task: cardDetails
            }, () => $('#modal_donetask').modal('open'))
          return
        }
      }
      if(sourceLaneId === 'lane_done'){
        if(targetLaneId === 'lane_todo'){
          this.setState(
            {
            cancelForm: null,
            task: null
            }) //, () => eventBus && eventBus.publish(cancelForm)
          return false;
        }
        if(targetLaneId === 'lane_backlog'){
          this.setState(
            {
              cancelForm: cancelForm,
            task: cardDetails
            }, () => $('#modal_backlogtask').modal('open'))
          return
        }
      }
    }
    this.setState({
      cancelForm: null,
      task: null
    });//, () => {eventBus && eventBus.publish(cancelForm);});
    return false;
  }


  componentDidMount = () => this.update() &&  $('.tooltipped').tooltip({delay:0, html:true});

  componentWillUnount = () => $('.tooltipped').tooltip('remove');

  update = () => {

     /* REMOVE INIT TASK */

     var notInitTasks = this.props.tasks.filter(task => task.action !== 'INIT')
    
     var getRolesForTask = (task) => 
      Object.keys( common.ROLES)
      .filter((key, index)  =>  common.ROLES[key].actions.filter(action => action === task.action).length > 0);
      ///.map((key, index) => key);
     
     /* DONE TASKS */
     var doneTasks = notInitTasks.filter(task => task.lane === 'lane_done')
     var doneCards = doneTasks.map(doneTask => {
      doneTask.id = doneTask._id;
      doneTask.laneId = doneTask.lane;
      doneTask.draggable = false;
      doneTask.focused = false;
      doneTask.dashed = false;
      doneTask.userDetails = doneTask.user?this.props.users.filter(user => user._id === doneTask.user)[0]: '';
      doneTask.style = normalCardStyle;

      doneTask.roles = getRolesForTask(doneTask);
      if(this.props.task){
        /* if task selected then get previous tasks */
        var prevTaskIds = [];
        var ascend = (taskId, prevTaskIds) => {
          prevTaskIds.push(taskId);
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.prev.forEach((prevTaskId) => ascend(prevTaskId, prevTaskIds));
        }
        ascend(this.props.task._id, prevTaskIds);

        /* DONE LANE */
        doneTask.draggable = prevTaskIds.includes(doneTask._id);
        doneTask.focused = this.props.task._id === doneTask._id;
      }
      return doneTask;
     });

     /* TODO TASKS */
     var todoTasks = notInitTasks.filter(task => task.lane === 'lane_todo');
     var todoCards = todoTasks.map(todoTask => {
      todoTask.id = todoTask._id;
      todoTask.laneId = todoTask.lane;
      todoTask.draggable = false;
      todoTask.focused = false;
      todoTask.dashed = false;
      todoTask.userDetails = todoTask.user?this.props.users.filter(user => user._id === todoTask.user)[0]: '';
      todoTask.style = normalCardStyle;
      todoTask.roles = getRolesForTask(todoTask);
      if(this.props.task){
        /* if task selected then get previous tasks */
        var prevTaskIds = [] ;
        var ascend = (taskId, prevTaskIds) => {
          prevTaskIds.push(taskId);
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.prev.forEach((prevTaskId) => ascend(prevTaskId, prevTaskIds));
        }
        ascend(this.props.task._id, prevTaskIds);

        /* TODO LANE */
        todoTask.draggable = prevTaskIds.includes(todoTask._id);
        todoTask.focused = todoTask.dashed =  this.props.task._id === todoTask._id;
      }
      return todoTask;
     });

     /* BACKLOG TASKS */
     var backlogTasks = notInitTasks.filter(task => task.lane === 'lane_backlog')
     var backlogCards = backlogTasks.map(backlogTask => {
      backlogTask.id = backlogTask._id;
      backlogTask.laneId = backlogTask.lane;
      backlogTask.draggable = false;
      backlogTask.focused = false;
      backlogTask.dashed = false;
      backlogTask.userDetails = backlogTask.user?this.props.users.filter(user => user._id === backlogTask.user)[0]: '';
      backlogTask.style = normalCardStyle;
      backlogTask.roles = getRolesForTask(backlogTask);

      if(this.props.task){
        /* if task selected then get previous tasks */
        var prevTaskIds = [];
        var ascend = (taskId, prevTaskIds) => {
          prevTaskIds.push(taskId);
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.prev.forEach((prevTaskId) => ascend(prevTaskId, prevTaskIds));
        }
        ascend(this.props.task._id, prevTaskIds)

        /* BACKLOG LANE */
         /* Is there a todo card draggable ? */
         var aTodoCardIsDraggable = !todoCards.filter(todoCard => todoCard.draggable === true).length;
         
         // Check is the user can perform the task according to his roles
         var actionIsAvailableForUser = this.props.user.roles
          .filter(role => common.ROLES.hasOwnProperty(role))
          .map(role => common.ROLES[role].actions)
          .reduce( (accumulator, currentValue) => accumulator.concat(currentValue), [])
          .filter(action => action === backlogTask.action)
          .length > 0;

         if(aTodoCardIsDraggable
            && common.STATUS[this.props.task.action].includes(backlogTask.action)
            && actionIsAvailableForUser
         ){
          backlogTask.draggable = true
          // prevent multiple branches of KPI
          if(this.props.task.action.includes('MODEL') && backlogTask.action.includes('KPI')){
           var nextTasks = this.props.task.next.map(nextTaskId => this.props.tasks.filter((task) => task._id === nextTaskId)[0]);
           if(nextTasks.length > 0) {
            var nextKpiTasks = nextTasks.filter(nextTask => nextTask.action === backlogTask.action);
            if(nextKpiTasks.length > 0) backlogTask.draggable = false;
           }
          }
         }
      }
      return backlogTask;
     });

     lanesModel[0].cards = backlogCards;
     lanesModel[1].cards = todoCards;
     lanesModel[2].cards = doneCards;

    this.setState({data:{lanes: lanesModel}});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.tasks !== this.props.tasks || prevProps.task !== this.props.task) {
        this.update();
    }

    $('#modal_task').modal({
      dismissible: false, 
    });

    $('#modal_createtask').modal({
      dismissible: true,
    });
   }

  render = () => {
        return  (
         <div>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal_createtask">
              <i className="material-icons left">add</i> NEW 
            </a>
            <Board
              data={this.state.data} 
              eventBusHandle={this.setEventBus}
              onDataChange= {this.onTaskChange}
              handleDragEnd= {this.handleDragEnd}
              onCardClick= {() => {}}
              cardStyle= {normalCardStyle}
              components= {{Card: CardComponent, laneDraggable: false}}
              style= {{ backgroundColor:'transparent',fontFamily: 'Exo 2', padding:'0'}} 
            />
            { this.props.project && <CreateTaskForm project={this.props.project} />}
            { 
              (this.state.task && this.state.cancelForm && this.props.project) ?
                <div>
                  <BacklogTaskForm  setTask={this.props.setTask} selectedTask={this.props.task} tasks={this.props.tasks} task={this.state.task} users={this.props.users} event={this.state.cancelForm} cancel={this.cancel} />
                  <TodoTaskForm  project={this.props.project} selectedTask={this.props.task} task={this.state.task} users={this.props.users} event={this.state.cancelForm} cancel={this.cancel} />
                  <DoneTaskForm   selectedTask={this.props.task}  task={this.state.task} event={this.state.cancelForm} cancel={this.cancel} />
                </div>
              : <div/>
            }
         </div>
        );
    }
}

export default TrelloComponent;
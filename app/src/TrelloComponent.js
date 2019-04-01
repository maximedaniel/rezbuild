import React, { Component } from 'react'
import Board from 'react-trello'
import SocketContext from './SocketContext'
import _ from 'lodash'
import CardComponent from './CardComponent'
import TaskForm from './forms/TaskForm'
import CreateTaskForm from './forms/CreateTaskForm'

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

class TrelloCore extends Component {

  constructor(props){
    super(props);
    this.state = {eventBus: null, data : null}
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.onTaskChange = this.onTaskChange.bind(this)
    this.setEventBus = this.setEventBus.bind(this)
    this.eventBus = null
    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  setEventBus(handle){
    this.setState({eventBus: handle})
  }

  submit(){
    if(this.state.cancel.fromLaneId == 'lane_done'){
        var create = {file : 'model.ifc',  project: this.props.project._id, prev:[this.props.revision._id]}
        this.props.socket.emit('/api/revision/create', create, res => {
            if(res.revisions) {
                var next_revision = res.revisions
                var filter = {_id: this.props.revision._id}
                var update = {"$push" : {next : next_revision._id}}
                this.props.socket.emit('/api/revision/update', filter, update, res => {
                    if(res.revisions) {
                        for(var lane of this.state.data.lanes){
                            if(lane.id != "lane_backlog"){
                                for(var card of lane.cards){
                                   var create = {
                                      title: card.title,
                                      lane: lane.id,
                                      revision:  next_revision._id,
                                      assignements: [],
                                      assessments: [],
                                      inputs: [],
                                      outputs: []
                                   }
                                   this.props.socket.emit('/api/task/create', create, res => {});
                                }
                            }
                        }
                        this.props.setRevision(next_revision)
                    }
                    if (res.error) {

                    }
                });
            }
            if (res.error) {
                console.log(res.error)
            }
        });
    }
    else {
       if(this.state.task._id){ //existing task
           var filter = {_id: this.state.task._id}
           var update = {"$set" : {lane : this.state.cancel.fromLaneId}}
           this.props.socket.emit('/api/task/update', filter, update, res => {});
       }
       else { // non existing task
           var create = {
              title: this.state.task.title,
              lane: this.state.cancel.fromLaneId,
              revision:  this.props.revision._id,
              assignements: [],
              assessments: [],
              inputs: [],
              outputs: []
           }
           this.props.socket.emit('/api/task/create', create, res => {});
            }
        }
  }

  onTaskChange(nextData){
    this.setState({data:  nextData})
  }

  handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails){
        if(sourceLaneId !== targetLaneId){
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
                $('#modal_task').modal('open');
            })
       }
  }

  cancel(){
   this.state.eventBus.publish(this.state.cancel)
  }


  componentDidMount(){
    this.getTasks()
  }

  getTasks(){
    this.setState({tasks: [], error : false, pending : true}, () => {
        var filter = {revision: this.props.revision._id}
        this.props.socket.emit('/api/task/get', filter, res => {
            if(res.tasks) {
                this.setState({tasks: res.tasks, error : false, pending : false}, () => {
                    this.update()
                })
            }
            if (res.error) {
                this.setState({tasks: [], error : res.error, pending : false})
            }
        })
    });
  }

  update(){
    var lanes = [
        {
          id: 'lane_backlog',
          title: 'BACKLOG',
          label: '?/?',
          cards: [
            {id: '0',
            title: 'Manual preassessment',
            date: '',
            lane:  '',
            revision:  '',
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
            },
            {id: '1',
            title: 'Update needs',
            date: '',
            lane:  '',
            revision: '',
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
            },
            {id: '2',
            title: 'Upload IS model',
            date: '',
            lane:  '',
            revision:  '',
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
            },
            {id: '3',
            title: 'Upload TO-BE model',
            date: '',
            lane:  '',
            revision:  '',
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
            },
            {id: '4',
            title: 'LCA Indicator',
            date: '',
            lane:  '',
            revision:  '',
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
            }
          ],
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
          id: 'lane_inprogress',
          title: 'IN PROGRESS',
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

    for (var task of this.state.tasks){
        for (var lane of lanes){
            if(lane.id === task.lane){
                lane.cards.push(task)
            }
        }
    }
   const data = {lanes: lanes}
   this.setState({data:data});
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevProps.revision !== this.props.revision){
            this.getTasks()
      }
    $('#modal_task').modal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
    });
    $('#modal_createtask').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
    });
   }



  render() {

        let errorComponent;
        let preloaderComponent;
        let trelloComponent;
        let taskFormComponent;
        let createTaskFormComponent;
        let createTaskButtonComponent;

        if (this.state.error){
            errorComponent = <div className="row">
                                <div className="col s12">
                                    <h6 className='rezbuild-text'>{this.state.error}</h6>
                                </div>
                            </div>

        }


        if (this.state.pending){
            preloaderComponent = <div className="preloader-wrapper small active">
                                    <div className="spinner-layer">
                                      <div className="circle-clipper left">
                                        <div className="circle"></div>
                                      </div><div className="gap-patch">
                                        <div className="circle"></div>
                                      </div><div className="circle-clipper right">
                                        <div className="circle"></div>
                                      </div>
                                    </div>
                                  </div>
        } else {
            if (this.state.tasks && this.state.data){
                trelloComponent = <Board data={this.state.data} style= {
                        {padding: '0',
                        backgroundColor:'transparent',
                        fontFamily: 'Exo 2'}
                    }
                    onDataChange={this.onTaskChange}
                    handleDragEnd={this.handleDragEnd}
                    eventBusHandle={this.setEventBus}
                    customCardLayout
                    draggable
                    >
                    <CardComponent />
                    </Board>

            }
            if (this.state.task && this.state.cancel){
                taskFormComponent =  <TaskForm submit={this.submit} cancel={this.cancel} event={this.state.cancel} task={this.state.task}/>
            }
            createTaskButtonComponent = <a className="btn-floating waves-effect waves-light modal-trigger" href="#modal_createtask">
                                            <i className="material-icons">add</i>
                                        </a>
            createTaskFormComponent =  <CreateTaskForm/>

        }
        return  (
         <div className="section">
                {preloaderComponent}
                {createTaskButtonComponent}
                {createTaskFormComponent}
                {errorComponent}
                {trelloComponent}
                {taskFormComponent}
         </div>
        );
    }
}

const TrelloComponent = props => (
  <SocketContext.Consumer>
  {socket => <TrelloCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default TrelloComponent;
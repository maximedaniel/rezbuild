import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../../../../SocketContext'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"
axios.defaults.withCredentials = true

var $ = window.$

class BacklogTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.state = {
       error : false,
       pending : false,
       startDate: this.props.task.startDate,
       endDate: this.props.task.endDate
   }
   this.handleStartDateChange = this.handleStartDateChange.bind(this);
   this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  handleStartDateChange(date) {
    this.setState({startDate: date});
  }

  handleEndDateChange(date) {
    this.setState({endDate: date});
  }

 submit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
        var nextTaskIds = [] 
        var descend = (taskId, nextTaskIds) => {
            nextTaskIds.push(taskId)
          var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
          currTask.next.map((nextTaskId) => descend(nextTaskId, nextTaskIds))
        }
        descend(this.props.task._id, nextTaskIds)
        var filter = {_id: {$in: nextTaskIds}}
        this.props.socket.emit('/api/task/delete', filter, res => {
            if(res.tasks){
                var filter = {_id: {$in: this.props.task.prev}}
                var update = { $pull: {next: this.props.task._id}}
                this.props.socket.emit('/api/task/update', filter, update, res => {
                    if(res.tasks){
                        this.setState({pending:false, error: false}, () => {
                            $("#modal_backlogtask").modal('close')
                            this.props.setTask(this.props.tasks.filter(task => task._id === this.props.task.prev[0])[0])
                            this.props.socket.emit('/api/task/done')
                        })
                    }
                    if(res.error){
                        this.setState({pending:false, error: res.error})
                    }
                });
            }
            if(res.error){
                this.setState({pending:false, error: res.error})
            }
       });
    })
  }


  cancel(){
    this.props.cancel()
    $('#modal_backlogtask').modal('close');
  }

  componentDidMount(){
    $(document).ready(() => {
        $('#modal_backlogtask').modal();
        $('select').material_select();
    })
  }

  render() {
    let formBody;
    let body;
    if(this.props.task){
        formBody =  <div>
                        <div className="col s12 center">
                        <h5 className="rezbuild-text">Do you want to remove <strong style={{fontWeight:'900'}}>{this.props.task.name}</strong> ?</h5>
                        </div>
                    </div>

    body =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>{this.props.task.name}</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        {formBody}
                     </div>
                     <div className="row" style={{marginTop:'250px'}}>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light" href='#!' onClick={this.submit}>SUBMIT</a>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}>CANCEL</a>
                      </div>
                     </div>
                  </form>
            </div>
        </div>
    }

    return (
    <div id="modal_backlogtask" className="modal" style={{minHeight:'500px'}}>
        {body}
    </div>
    );
  }
}

const BacklogTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <BacklogTaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default BacklogTaskForm;

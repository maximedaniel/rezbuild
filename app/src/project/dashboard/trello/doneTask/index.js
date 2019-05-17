import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../../../../SocketContext'
import DatePicker from 'react-datepicker'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"
import common from 'common'
//import fs, {createReadStream} from 'fs';
axios.defaults.withCredentials = true

var $ = window.$

class DoneTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.cancel = this.cancel.bind(this);
   this.state = {
       newTaskId: false,
       error : false,
       pending : false,
       progress : 0,
   }
  }

  submit(event){
   event.preventDefault()
   this.setState({pending:true, error: false}, () => {
    if(this.props.task.lane === "lane_todo"){
        this.props.uploader.submitFiles(this.refs.files.files)
        if(this.refs.file) this.props.uploader.submitFiles(this.refs.file.files)
        var filter = {_id: this.props.task._id}
        var update = {
            user: "token",
            lane: 'lane_done',
            files: Array.from(this.refs.files.files).map(file => file.name),
            value:  (this.refs.file)? this.refs.file.files[0].name : this.refs.value.value
        }
        this.props.socket.emit('/api/task/update', filter, update, res => {
            if(res.tasks){
                this.setState({pending:false, error: false}, () => {
                    $("#modal_donetask").modal('close')
                    this.props.socket.emit('/api/task/done')
                })
            }
            if(res.error){
                this.setState({pending:false, error: res.error})
            }
        }) 
    }
    if(this.props.task.lane === "lane_backlog"){
        var create = {
            project: this.props.task.project,
            lane:   'lane_done',
            name: this.props.task.name,
            content: this.props.task.content,
            startDate: this.props.task.startDate,
            endDate: this.props.task.endDate,
            date: new Date(),
            user: 'token',
            roles: this.props.task.roles,
            action: this.props.task.action,
            value: this.props.task.value,
            format:  this.props.task.format,
            files: this.props.task.files,
            prev: [this.props.selectedTask._id],
            next: []
        }
        this.props.socket.emit('/api/task/create', create, res => {
            if(res.tasks){
                this.setState({newTaskId: res.tasks._id}, () =>{
                    this.props.uploader.submitFiles(this.refs.files.files)
                    if(this.refs.file) this.props.uploader.submitFiles(this.refs.file.files)

                    var filter = {_id: this.state.newTaskId}
                    var update = {
                        files: Array.from(this.refs.files.files).map(file => file.name),
                        value:  (this.refs.file)? this.refs.file.files[0].name : this.refs.value.value
                    }
                    this.props.socket.emit('/api/task/update', filter, update, res => {
                        if(res.tasks){
                            var filter = {_id: this.props.selectedTask._id}
                            var update = { $push: {next: this.state.newTaskId}}
                            this.props.socket.emit('/api/task/update', filter, update, res => {
                                if(res.tasks){
                                    $("#modal_donetask").modal('close')
                                    this.props.socket.emit('/api/task/done')
                                }
                                if(res.error){
                                    this.setState({pending:false, error: res.error})
                                }
                            }) 
                        }
                        if(res.error){
                            this.setState({pending:false, error: res.error})
                        }
                    }) 

                    

                })
            }
            if(res.error){
                this.setState({pending:false, error: res.error})
            }
        });
    }
    })
  }


  cancel(){
    this.props.cancel()
    $('#modal_donetask').modal('close');
  }

  componentDidMount(){
    this.props.uploader.addEventListener("start", (event) => {
        event.file.meta.taskId = this.state.newTaskId;
    });

    $(document).ready(() => {
        $('#modal_donetask').modal();
        this.props.uploader.addEventListener("progress", (event) => {
            this.setState({progress: (event.bytesLoaded / event.file.size * 100).toFixed(0)}, () => {
                //console.log("File is", this.state.progress, "percent loaded");
            })
        });
        this.props.uploader.addEventListener("complete", (event) => {
            //console.log(event.success);
            //console.log(event.file);
        });
    })
  }

  componentWillUnmount(){
        this.props.uploader.removeEventListener("start");
  }

  render() {

    let formBody;
    let body;
    let fileBody;

    if(this.props.task){
        formBody =  <div>
                        {
                            this.props.task.format.startsWith('.') ? 
                            <div>
                                <div className="col l2 m4">
                                    { !this.props.task.action.includes('NEW') ?
                                        <a className="btn white col s6"  id= {"button_"+ this.props.task.action}  style={{height:'3rem', lineHeight:'3rem'}}>
                                            <i className="material-icons rezbuild-text ">cloud_download</i>
                                        </a> : ""}
                                </div> 
                                <div className="file-field input-field col l10 m8 pull-l1 pull-m2" style={{marginTop:'0'}}>
                                        <div className="btn rezbuild col s1">
                                        <i className="material-icons white-text">cloud_upload</i>
                                        <input required type="file" id={"file_"+this.props.task.action} ref="file" accept={this.props.task.format}/>
                                        </div>
                                        <div className="file-path-wrapper col s11">
                                        <input className="file-path validate" type="text"
                                            placeholder={"Upload " + this.props.task.action.replace('_',' ').toLowerCase()}
                                        />
                                        </div>
                                </div>
                            </div>
                            :
                            <div className="input-field col s12 m6 l4">
                                <input required id={"value_" + this.props.task._id}  ref="value" type="number" className="validate" />
                                <label htmlFor={this.props.task.action}>{this.props.task.name.replace('_',' ')} ({this.props.task.format.toLowerCase()})</label>
                            </div>
                        }
                        <div className="file-field input-field col l10 m8 push-l1 pull-m2" style={{marginTop:'0'}}>
                                <div className="btn rezbuild col s1">
                                <i className="material-icons white-text">cloud_upload</i>
                                <input required type="file" id={"files_" + this.props.task._id}  ref= "files" multiple/>
                                </div>
                                <div className="file-path-wrapper col s11">
                                <input className="file-path validate" type="text"
                                    placeholder="Upload attached file(s)"
                                />
                                </div>
                        </div>

                    </div>

    body =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Actions to complete <b>{this.props.task.name}</b></h4>
            </div>
            <div className="modal-content">
                  <form className="col s12" onSubmit={this.submit}>
                     <div className="row">
                        {formBody}
                     </div>
                    { this.state.pending ?
                     <div className="preloader-wrapper small active">
                        <div className="spinner-layer">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div><div className="gap-patch">
                            <div className="circle"></div>
                          </div><div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div> : ''
                    }

                    { this.state.error ?
                    <div className="row">
                        <div className="col s12">
                            <h6 className='rezbuild-text'>{this.state.error}</h6>
                        </div>
                    </div> : ''
                    }

                    { this.state.progress ?
                    <div className="progress">
                      <div className="determinate" style={{width: this.state.progress+"%"}}></div>
                    </div> : ''
                    }
                     <div className="row" style={{marginTop:'250px'}}>
                      <div className="input-field col s6 center">
                          <button className="btn waves-effect waves-light" href='#!' type="submit" id="button_submit_task_done">SUBMIT</button>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!'  onClick={this.cancel}>CANCEL</a>
                      </div>
                     </div>
                  </form>
            </div>
        </div>
    }

    return (
    <div id="modal_donetask" className="modal" style={{minHeight:'500px'}}>
        {body}
    </div>
    );
  }
}

const DoneTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <DoneTaskFormCore {...props} socket={context.socket} uploader={context.uploader}/>}
  </SocketContext.Consumer>
)

export default DoneTaskForm;

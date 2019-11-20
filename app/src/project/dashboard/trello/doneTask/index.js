import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../../../../SocketContext'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"
import sanitize from 'sanitize-filename'

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
   this.setState({newTaskId: this.props.task._id, pending:true, error: false}, () => {
    if(this.props.task.lane === "lane_todo"){
        var filter = {_id: this.props.task._id}
        var update = {
            user: "token",
            lane: 'lane_done',
            names: [],
            values: [],
            files: []
        }

        var allAttachedFiles = [];

        this.props.task.names.forEach((name, index) => {
            update.names.push(name)
            
            var value = (this.refs[name].files)?this.refs[name].files[0].name:this.refs[name].value
            update.values.push(value)
            
            var file = ""
            if(this.refs['files_'+name].files.length)  {
                console.log("this.refs['files_'+name].files[0]:", this.refs['files_'+name].files[0])
                allAttachedFiles.push(this.refs['files_'+name].files[0])

                file = sanitize(this.refs['files_'+name].files[0].name)
                update.files.push(file)
            }

            if(this.refs[name].files && this.refs[name].files.length){
                console.log("this.refs[name].files[0]:", this.refs[name].files[0])
                allAttachedFiles.push(this.refs[name].files[0])
            }
        })

        this.props.uploader.submitFiles(allAttachedFiles)

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
            names: this.props.task.names,
            values: this.props.task.values,
            formats:  this.props.task.formats,
            files: this.props.task.files,
            prev: [this.props.selectedTask._id],
            next: []
        }
        this.props.socket.emit('/api/task/create', create, res => {
            if(res.tasks){
                this.setState({newTaskId: res.tasks._id}, () =>{
                    var filter = {_id: this.state.newTaskId}
                    var update = {
                        names: [],
                        values: [],
                        files: []
                    }
                    
                    var allAttachedFiles = [];

                    this.props.task.names.forEach((name, index) => {
                        update.names.push(name)
                        
                        var value = (this.refs[name].files)?this.refs[name].files[0].name:this.refs[name].value
                        update.values.push(value)

                        var file = ""
                        //console.log("this.refs['files_'+name].files.length : ", this.refs['files_'+name].files.length)
                        if(this.refs['files_'+name].files.length)  {
                            console.log("this.refs['files_'+name].files[0]:", this.refs['files_'+name].files[0])
                            allAttachedFiles.push(this.refs['files_'+name].files[0])

                            file = sanitize(this.refs['files_'+name].files[0].name)
                            update.files.push(file)
                        }

            
                        if(this.refs[name].files && this.refs[name].files.length){
                            console.log("this.refs[name].files[0]:", this.refs[name].files[0])
                            allAttachedFiles.push(this.refs[name].files[0])
                        }
                    })
                    
                    this.props.uploader.submitFiles(allAttachedFiles)

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
        $('#modal_donetask').modal({dismissible: false});
        this.props.uploader.addEventListener("progress", (event) => {
            this.setState({progress: (event.bytesLoaded / event.file.size * 100).toFixed(0)}, () => {
            })
        });
        this.props.uploader.addEventListener("complete", (event) => {
        });
    })
  }

  componentWillUnmount(){
        this.props.uploader.removeEventListener("start");
  }

  render() {

    let formBody;
    let body;

    if(this.props.task){
        formBody =  <div>
                        {  
                            this.props.task.names.map((name, index) => 
                                <div className="row">
                                {
                                    this.props.task.formats[index].startsWith('.') ? 
                                        <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                                            <h6 className="grey-text">{name}</h6>
                                            <div className="btn rezbuild col s1">
                                            <i className="material-icons white-text">cloud_upload</i>
                                            <input required type="file" id={"values_"+this.props.task._id+'_'+name}  ref={name} accept={this.props.task.formats[index]}/>
                                            </div>
                                            <div className="file-path-wrapper col s11">
                                            <input className="file-path validate" type="text"
                                                placeholder={"Upload " + name}
                                            />
                                            </div>
                                        </div>
                                        :
                                        <div className="input-field col s6">
                                            <input required id={"values_"+this.props.task._id+'_'+name}  ref={name} type="number" step="any"  className="validate"  defaultValue={this.props.task.values[index]}/>
                                            <label className="active" htmlFor={"values_"+this.props.task._id+'_'+name}>{name} ({this.props.task.formats[index]})</label>
                                        </div>
                                }
                                <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                                        <h6 className="grey-text">Attached file</h6>
                                        <div className="btn rezbuild col s1">
                                        <i className="material-icons white-text">cloud_upload</i>
                                        <input type="file" id={"files_" +this.props.task._id+'_'+name}  ref= {'files_'+name}/>
                                        </div>
                                        <div className="file-path-wrapper col s11">
                                        <input className="file-path validate" type="text"
                                            placeholder="Upload attached file"
                                        />
                                        </div>
                                </div>
                                </div>
                            )
                        }
                    </div>
    body =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Actions to complete <b>{this.props.task.name}</b></h4>
            </div>
            <div className="modal-content" style={{padding:0}}>
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
                          <button className="btn waves-effect waves-light" href='#!' type="submit" id="button_submit_task_done"><i className="material-icons right">send</i>SUBMIT</button>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!'  onClick={this.cancel}><i className="material-icons left">cancel</i>CANCEL</a>
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

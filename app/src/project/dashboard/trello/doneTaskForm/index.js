/**
 * @class DoneTaskForm
 * @extends Component
 * @description Create the form for a DONE task
 */
import React, { Component } from 'react'
import common from 'common'
import axios from 'axios'
import SocketContext from '../../../../SocketContext'
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css"
import sanitize from 'sanitize-filename'

axios.defaults.withCredentials = true
var $ = window.$
var allAttachedFiles = [];
var uploadedAttachedFiles = [];

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
    generateForm = (task, name, index) => {
        var minValue, maxValue;
        switch(common.ACTIONS[task.action].typeValues[index]) {
            case Number:
                minValue = common.ACTIONS[task.action].minValues[index];
                maxValue = common.ACTIONS[task.action].maxValues[index];
                return (<div className="input-field col s6">
                    <input 
                    required 
                    id={"values_"+task._id+'_'+name}
                    key={"values_"+task._id+'_'+name} 
                    ref={"values_"+task._id+'_'+name}
                    type="number" 
                    step="any" 
                    className="validate"  
                    min={minValue>maxValue?maxValue:minValue}
                    max={maxValue>minValue?maxValue:minValue}
                    defaultValue={task.values[index]}
                    />
                    <label className="active" htmlFor={"values_"+task._id+'_'+name}>{name} ({minValue}-{maxValue}{task.formats[index]})</label>
                </div>)
            case Boolean:
                minValue = common.ACTIONS[task.action].minValues[index];
                maxValue = common.ACTIONS[task.action].maxValues[index];
                
                return (
                <div className="input-field col s6">
                    <select 
                    required
                    id={"values_"+task._id+'_'+name}
                    key={"values_"+task._id+'_'+name}
                    ref={"values_"+task._id+'_'+name} 
                    defaultValue={Number(task.values[index])}
                    >
                    <option  value={Number(minValue)} id={"values_"+task._id+'_'+name}>False</option>
                    <option  value={Number(maxValue)} id={"values_"+task._id+'_'+name}>True</option>
                    </select>
                    <label className="active" htmlFor={"values_"+task._id+'_'+name}>{name} ({minValue}-{maxValue}{task.formats[index]})</label>
                </div>);
            case Object:
                return(
                <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                    <h6 className="grey-text">{name}</h6>
                    <div className="btn rezbuild col s1">
                    <i className="material-icons white-text">cloud_upload</i>
                    <input required 
                    type="file" 
                    id={"values_"+task._id+'_'+name} 
                    key={"values_"+task._id+'_'+name}
                    ref={"values_"+task._id+'_'+name} 
                    defaultValue={""}
                    accept={task.formats[index]}/>
                    </div>
                    <div className="file-path-wrapper col s11">
                    <input className="file-path validate"
                    type="text"
                    placeholder={"Upload " + name}
                    />
                    </div>
                </div>
                 );
            default:
                return;
        }
    }
  submit(event){
   event.preventDefault()
   this.setState({newTaskId: this.props.task._id, pending:true, error: false, progress: 0}, () => {
    if(this.props.task.lane === "lane_todo"){
        var filter = {_id: this.props.task._id}
        var update = {
            user: "token",
            lane: 'lane_done',
            names: [],
            values: [],
            files: []
        }

        allAttachedFiles  = []; 
        uploadedAttachedFiles = [];

        this.props.task.names.forEach((name, index) => {
            var valuesRefName = "values_"+this.props.task._id+'_'+name;
            var filesRefName = "files_"+this.props.task._id+'_'+name;

            update.names.push(name)
            
            var value = (this.refs[valuesRefName].files)?this.refs[valuesRefName].files[0].name:this.refs[valuesRefName].value
            update.values.push(value)
            
            var file = ""
            if(this.refs[filesRefName].files.length)  {
                allAttachedFiles.push(this.refs[filesRefName].files[0])
                file = sanitize(this.refs[filesRefName].files[0].name)
            }
            update.files.push(file);

            if(this.refs[valuesRefName].files && this.refs[valuesRefName].files.length){
                allAttachedFiles.push(this.refs[valuesRefName].files[0])
            }
        })

        this.props.uploader.submitFiles(allAttachedFiles)

        this.props.socket.emit('/api/task/update', filter, update, res => {
            if(res.tasks){
                this.setState({pending:false, error: false}, () => {
                    if(uploadedAttachedFiles.length >= allAttachedFiles.length){
                        $("#modal_donetask_form").trigger('reset');
                        $("#modal_donetask").modal('close');
                        this.props.socket.emit('/api/task/done');
                    }
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
                    
                    allAttachedFiles = [];
                    uploadedAttachedFiles = [];

                    this.props.task.names.forEach((name, index) => {
                        var valuesRefName = "values_"+this.props.task._id+'_'+name;
                        var filesRefName = "files_"+this.props.task._id+'_'+name;

                        update.names.push(name);
                        var value = (this.refs[valuesRefName].files)?this.refs[valuesRefName].files[0].name:this.refs[valuesRefName].value;
                        update.values.push(value);

                        var file = ""
                        if(this.refs[filesRefName].files.length)  {
                            allAttachedFiles.push(this.refs[filesRefName].files[0])
                            file = sanitize(this.refs[filesRefName].files[0].name)
                        }
                        update.files.push(file);
                        
                        if(this.refs[valuesRefName].files && this.refs[valuesRefName].files.length){
                            allAttachedFiles.push(this.refs[valuesRefName].files[0])
                        }
                    })
                    
                    this.props.uploader.submitFiles(allAttachedFiles)

                   this.props.socket.emit('/api/task/update', filter, update, res => {
                        if(res.tasks){
                            var filter = {_id: this.props.selectedTask._id}
                            var update = { $push: {next: this.state.newTaskId}}
                            this.props.socket.emit('/api/task/update', filter, update, res => {
                                if(res.tasks){
                                    this.setState({pending:false, error: false}, () => {
                                        if(uploadedAttachedFiles.length >= allAttachedFiles.length){
                                            $("#modal_donetask_form").trigger('reset');
                                            $("#modal_donetask").modal('close');
                                            this.props.socket.emit('/api/task/done');
                                        }
                                    })
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
        this.setState({progress: 0}, () => {
        })
    });

    $(document).ready(() => {
        $('#modal_donetask').modal({dismissible: false});
        this.props.uploader.addEventListener("progress", (event) => {
            this.setState({progress: (event.bytesLoaded / event.file.size * 100).toFixed(0)}, () => {
            })
        });
        this.props.uploader.addEventListener("complete", (event) => {
            this.setState({progress: 0}, () => {
                uploadedAttachedFiles.push(event.file);
                if(uploadedAttachedFiles.length >= allAttachedFiles.length){
                    $("#modal_donetask_form").trigger('reset');
                    $("#modal_donetask").modal('close');
                    this.props.socket.emit('/api/task/done');
                }
            })
        });
    })
  }

  componentWillUnmount(){
        this.props.uploader.removeEventListener("start");
        this.props.uploader.removeEventListener("progress");
        this.props.uploader.removeEventListener("complete");
  }

  render() {
    return (
    <div id="modal_donetask" className="modal" style={{minHeight:'500px'}}>
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Actions to complete <b>{this.props.task.name}</b></h4>
            </div>
            <div className="modal-content" style={{padding:0}}>
                <form className="col s12" onSubmit={this.submit} id="modal_donetask_form">
                    <div className="row">
                        { 
                            this.props.task.names.map((name, index) => 
                                <div className="row" key={index}>
                                    {this.generateForm(this.props.task, name, index)}
                                    <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                                            <h6 className="grey-text">Attached file</h6>
                                            <div className="btn rezbuild col s1">
                                            <i className="material-icons white-text">cloud_upload</i>
                                            <input type="file"
                                            id={"files_" +this.props.task._id+'_'+name} 
                                            key={"files_" +this.props.task._id+'_'+name} 
                                            ref= {'files_'+this.props.task._id+'_'+name} 
                                            defaultValue=""
                                            />
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

                    {
                    this.state.progress?
                    <div className="progress">
                    <div className="determinate" style={{width: this.state.progress+"%"}}></div>
                    </div>
                    :<div className="row" style={{marginTop:'250px'}}>
                    <div className="input-field col s6 center">
                        <button className="btn waves-effect waves-light" href='#!' type="submit" id="button_submit_task_done"><i className="material-icons right">send</i>SUBMIT</button>
                    </div>
                    <div className="input-field col s6 center">
                        <a className="btn waves-effect waves-light rezbuild-text white" href='#!'  onClick={this.cancel}><i className="material-icons left">cancel</i>CANCEL</a>
                    </div>
                    </div>
                    }
                </form>
            </div>
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

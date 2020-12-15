/**
 * @class EditDoneTaskForm
 * @extends Component
 * @description Create the form for edit a DONE task
 */
import React, { Component } from 'react'
import common from 'common'
import SocketContext from '../../../../SocketContext'
import sanitize from 'sanitize-filename'

var $ = window.$
var allAttachedFiles = [];
var uploadedAttachedFiles = [];

class EditDoneTaskFormCore extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.componentId = "modal_editdonetask_"+this.props.task._id;
        this.formId = "modal_editdonetask_form_"+this.props.task._id;
        this.state = {
            error : false,
            pending : false,
            progress : 0
        }
    }

    generateFormLine = (task, name, index) => {
        var minValue, maxValue;
        var idv = "values_" + task._id + "_" + index;
        switch(common.ACTIONS[task.action].typeValues[index]) {
            case Number:
                minValue = common.ACTIONS[task.action].minValues[index];
                maxValue = common.ACTIONS[task.action].maxValues[index];
                return (<div className="input-field col s6">
                    <input required id={idv} key={idv} ref={idv}
                        type="number" step="any" className="validate"  
                        min={minValue>maxValue?maxValue:minValue}
                        max={maxValue>minValue?maxValue:minValue}
                        defaultValue={task.values[index]}
                    />
                    <label className="active" htmlFor={idv}>{name} ({minValue}-{maxValue}{task.formats[index]})</label>
                </div>)

            case Boolean:
                return (
                <div className="input-field col s6">
                    <select required id={idv} key={idv} ref={idv} defaultValue={Number(task.values[index])}>
                        <option value="0" id={idv}>False</option>
                        <option value="1" id={idv}>True</option>
                    </select>
                    <label className="active" htmlFor={idv}>{name}</label>
                </div>);
            
            case Text:
                return (
                <div className="input-field col s6">
                    <input 
                    required 
                    id={"values_"+task._id+'_'+name}
                    key={"values_"+task._id+'_'+name} 
                    ref={"values_"+task._id+'_'+name}
                    type="text" 
                    // step="any" 
                    // className="validate"  
                    defaultValue={task.values[index]}
                    />
                    <label className="active" htmlFor={"values_"+task._id+'_'+name}>{name} {task.formats[index]}</label>
                </div>);

            case Object:
                return(
                <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                    <h6 className="grey-text">{name}</h6>
                    <div className="btn rezbuild col s1">
                    <i className="material-icons white-text">cloud_upload</i>
                    <input required type="file" id={idv} key={idv} ref={idv} defaultValue={task.files[index]}
                        accept={task.formats[index]}/>
                    </div>
                    <div className="file-path-wrapper col s11">
                        <input className="file-path validate" type="text" placeholder={task.files[index] ? task.files[index] : "Upload attached file"} />
                    </div>
                </div>
                 );
            default:
                return;
        }
    }
    
    submit(event) {
        event.preventDefault()
        this.setState({pending:true, error: false, progress: 0}, () => {

            var filter = {_id: this.props.task._id}
            var update = {
                user: "token",
                names: [],
                values: [],
                files: []
            }

            allAttachedFiles  = []; 
            uploadedAttachedFiles = [];

            this.props.task.names.forEach((name, index) => {
                var valuesRefName = "values_"+this.props.task._id+'_'+index;
                var filesRefName = "files_"+this.props.task._id+'_'+index;

                update.names.push(name)
                
                var value = (this.refs[valuesRefName].files)?this.refs[valuesRefName].files[0].name:this.refs[valuesRefName].value
                update.values.push(value)
                
                var file = this.props.task.files[index]
                if (this.refs[filesRefName].files.length)  {
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
                            this.close();
                            this.props.socket.emit('/api/task/done');
                        }
                    })
                }
                if(res.error){
                    this.setState({pending:false, error: res.error})
                }
            })
        })
    }

    removeFileUploadListeners() {
        this.props.uploader.removeEventListener("start");
        this.props.uploader.removeEventListener("progress");
        this.props.uploader.removeEventListener("complete");
    }

    onClose = (e) => {
        this.props.onClose && this.props.onClose(e);
    }

    close() {
        $("#" + this.formId).trigger('reset');
        $("#" + this.componentId).scrollTop(0);
        $("#" + this.componentId).modal('close');
    }

    cancel() {
        this.close()
    }

    addFileUploadListeners() {
        this.props.uploader.addEventListener("start", (event) => {
            event.file.meta.taskId = this.props.task._id;
            this.setState({progress: 0}, () => {
            })
        });
        this.props.uploader.addEventListener("progress", (event) => {
            this.setState({progress: (event.bytesLoaded / event.file.size * 100).toFixed(0)}, () => {
            })
        });
        this.props.uploader.addEventListener("complete", (event) => {
            this.setState({progress: 0}, () => {
                uploadedAttachedFiles.push(event.file);
                if(uploadedAttachedFiles.length >= allAttachedFiles.length){
                    this.close();
                    this.props.socket.emit('/api/task/done');
                }
            })
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.task !== this.props.task){
            this.componentId = "modal_editdonetask_"+this.props.task._id;
            this.formId = "modal_editdonetask_form_"+this.props.task._id;
            this.setState({
                error : false,
                pending : false,
                progress : 0
            });
        }
        if (prevProps.show != this.props.show) {
            if (this.props.show) {
                this.addFileUploadListeners();
                $("#" + this.componentId).modal('open');
            } else {
                this.removeFileUploadListeners();
            }
        }
    }
    
    componentDidMount() {
        $(document).ready(() => {
            $("#" + this.componentId).modal({dismissible: false});
        })
    }

    componentWillUnmount(){
    }

    render() {
        return (
    <div id={this.componentId} className="modal" style={{minHeight:'500px'}}>
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Edit <b>{this.props.task.name}</b></h4>
        </div>
        <div className="modal-content" style={{padding:0}}>
            <form className="col s12" onSubmit={this.submit} id={this.formId} lang="en">
                <div className="row">
                    { this.props.task.names.map((name, index) => 
                    <div className="row" key={index}>
                    { this.generateFormLine(this.props.task, name, index) }
                        <div className="file-field input-field col s6" style={{marginTop:'0'}}>
                            <h6 className="grey-text">Attached file</h6>
                            <div className="btn rezbuild col s1">
                                <i className="material-icons white-text">cloud_upload</i>
                                <input type="file"
                                    id={"files_" +this.props.task._id+'_'+index} 
                                    key={"files_" +this.props.task._id+'_'+index} 
                                    ref= {'files_'+this.props.task._id+'_'+index} 
                                    defaultValue=""
                                />
                            </div>
                            <div className="file-path-wrapper col s11">
                                <input className="file-path validate" type="text" placeholder={this.props.task.files[index] ? this.props.task.files[index] : "Upload attached file"}/>
                            </div>
                        </div>
                    </div>
                    )}
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
                </div>
                :
                <div className="row" style={{marginTop:'250px'}}>
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

const EditDoneTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <EditDoneTaskFormCore {...props} socket={context.socket} uploader={context.uploader}/>}
  </SocketContext.Consumer>
)

export default EditDoneTaskForm;

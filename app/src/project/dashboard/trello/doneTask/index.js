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
       newRevisionId: false,
       error : false,
       pending : false,
       progress : 0,
   }
  }

  submit(event){
   event.preventDefault()
   this.setState({pending:true, error: false}, () => {
        var filter = { _id : "token" }
        this.props.socket.emit('/api/user/get', filter, res => {
            if (res.users) {
                var user = res.users[0]
                var create = {
                    project: this.props.revision.project,
                    status: common.STATUS[this.props.task.actions[0]],
                    prevLinks: [{revision:this.props.revision._id, task:this.props.task.id}],
                    nextLinks: []
               }
               this.props.socket.emit('/api/revision/create', create, res => {
                   if(res.revisions){
                       var newRevisionId = res.revisions._id
                       var filter = {_id: this.props.revision._id}
                       var update = { '$push': { nextLinks: {revision: newRevisionId, task:this.props.task.id}}}
                       this.props.socket.emit('/api/revision/update', filter, update, res => {
                           if(res.revisions){
                               var newTask = this.props.task
                               newTask.lane = 'lane_done'
                               delete newTask._id
                               newTask.revision = newRevisionId
                               newTask.doneDate = new Date()
                               newTask.doneUser = user._id
                               var create = newTask
                               this.props.socket.emit('/api/task/create', create, res => {
                                   if(res.tasks){
                                       this.setState({pending:false, error: false}, () => {
                                           $("#modal_donetask").modal('close')
                                           this.props.socket.emit('/api/task/done')
                                           }
                                       )
                                   }
                                   if(res.error){
                                       this.setState({pending:false, error: res.error})
                                   }
                               });
                           }
                           if(res.error){
                               this.setState({pending:false, error: res.error})
                           }
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

       


    //      /* GET USER */
    //     this.props.socket.emit('/api/token', {}, res => {
    //         var userId = res.user._id
    //         /* CREATE NEW REVISION */
    //         var create = {
    //         project: this.props.revision.project,
    //         name: 'Revision',
    //         prevLinks: [{revision:this.props.revision._id, task:this.props.task.id}],
    //         nextLinks: []
    //         }
    //         this.props.socket.emit('/api/revision/create', create, res => {
    //             if(res.revisions){
    //                 this.setState({newRevisionId: res.revisions._id}, () => {
    //                     var filter = {_id: this.state.newRevisionId}
    //                     var update = {}
    //                     common.ACTIONS.map((action, index) => update[action.name] = this.props.revision[action.name])
    //                     Object.keys(this.refs).forEach((ref) => {
    //                             if(this.refs[ref].files){
    //                                 this.props.uploader.submitFiles(this.refs[ref].files)
    //                                 var fileNameList = []
    //                                 Array.from(this.refs[ref].files).forEach(file => {
    //                                     fileNameList.push(this.state.newRevisionId + '_' + file.name)
    //                                 });
    //                                 if(Array.isArray(update[ref])){
    //                                     update[ref] = update[ref].concat(fileNameList)
    //                                 } else  update[ref] = fileNameList
    //                             } else {
    //                                 update[ref] = this.refs[ref].value
    //                             }
    //                     })
    //                     /* UPDATE NEW REVISION WITH FILES */
    //                     this.props.socket.emit('/api/revision/update', filter, update, res => {
    //                         if(res.revisions){
    //                             var filter = {_id: this.props.revision._id}
    //                             var update = { '$push': { nextLinks: {revision: this.state.newRevisionId, task:this.props.task.id}}}
    //                             this.props.socket.emit('/api/revision/update', filter, update, res => {
    //                                 if(res.revisions){
    //                                     /* UPDATE NEW REVISION WITH TASKS */
    //                                     this.copyTasksFromTo(this.props.revision._id, this.state.newRevisionId)
    //                                     this.setState({pending:false, error: false})
    //                                 }
    //                                 if(res.error){
    //                                     this.setState({pending:false, error: res.error})
    //                                 }
    //                             })                         
    //                         }
    //                         if(res.error){
    //                             this.setState({pending:false, error: res.error})
    //                         }
    //                     });
    //                 })
    //             }
    //             if(res.error){
    //                 this.setState({pending:false, error: res.error})
    //             }
    //         });
    //     })
    })
  }


  cancel(){
    this.props.cancel()
    $('#modal_donetask').modal('close');
  }

  componentDidMount(){
    this.props.uploader.addEventListener("start", (event) => {
        event.file.meta.revision = this.props.task.revision;
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

    if(this.props.task){
        formBody =  <div>
                        {
                            this.props.task.actions.map((action, index) => {
                                var actionProps =  common.ACTIONS[action]
                                if(actionProps.value.type.name === 'String'){
                                    return (
                                        <div>
                                            <div className="col l2 m4">
                                                <a className="btn white col s6" style={{height:'3rem', lineHeight:'3rem'}}>
                                                    <i className="material-icons rezbuild-text ">cloud_download</i>
                                                </a>
                                            </div>
                                            <div className="col l2 m4">
                                                <a className="btn white col s6"  id= {"button_"+ action}  style={{height:'3rem', lineHeight:'3rem'}}>
                                                    <i className="material-icons rezbuild-text ">cloud_upload</i>
                                                </a>
                                            </div>
                                            <div className="file-field input-field col l4 m8 pull-l1 pull-m2" style={{marginTop:'0'}}>
                                                  <div className="btn rezbuild col s3">
                                                    <i className="material-icons white-text">cloud_upload</i>
                                                    <input required type="file" id={"file_"+action} ref={action} multiple  accept={actionProps.format}/>
                                                  </div>
                                                  <div className="file-path-wrapper col s9">
                                                    <input className="file-path validate" type="text"
                                                        placeholder={"Upload one or more " + action.replace('_',' ').toLowerCase()}
                                                    />
                                                  </div>
                                            </div>
                                        </div>
                                        );

                                }
                                if(Array.isArray(actionProps.value.type)){
                                    return (
                                        <div>
                                            <div className="col l2 m4">
                                                <a className="btn white col s6" style={{height:'3rem', lineHeight:'3rem'}}>
                                                    <i className="material-icons rezbuild-text ">cloud_download</i>
                                                </a>
                                            </div>
                                            <div className="file-field input-field col l4 m8 pull-l1 pull-m2" style={{marginTop:'0'}}>
                                                  <div className="btn rezbuild col s3">
                                                    <i className="material-icons white-text">cloud_upload</i>
                                                    <input required type="file" id={"file_"+action} ref={action} accept={actionProps.format}/>
                                                  </div>
                                                  <div className="file-path-wrapper col s9">
                                                    <input className="file-path validate" type="text"
                                                        placeholder={"Upload one or more " + actionProps.name.replace('_',' ').toLowerCase()}
                                                    />
                                                  </div>
                                            </div>
                                        </div>
                                   );
                                }
                                if(actionProps.value.type.name === 'Number'){
                                    return (
                                            <div className="input-field col s12 m6 l4">
                                                <input required id={action} id={action} ref={action} type="number" className="validate" />
                                                <label htmlFor={action}>{actionProps.name.replace('_',' ')} ({actionProps.format.toLowerCase()})</label>
                                            </div>
                                    );
                                }
                            })
                        }
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

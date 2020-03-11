/**
 * @class JoinProjectForm
 * @extends Component
 * @description Create the form for joining a project
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'

var $ = window.$

class JoinProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.handleJoinProject = this.handleJoinProject.bind(this);
   this.state = {projects: null, error : false, pending : false}
  }

 // get projects not of the users
  update(){
    this.setState({projects: null, error : false, pending : true}, () => {
        var get = {users: { "$nin" : ["token"] }}
        this.props.socket.emit('/api/project/get', get, res => {
            if (res.projects) {
                this.setState({projects : res.projects, error : false, pending : false}, () =>{
                        var data = {}
                        this.state.projects.map((project, index) => (data[String(project.name+"|"+project._id)] = null))
                        $('#input_autocomplete_joinproject').autocomplete({data: data});
                });
            }
            if(res.error){
                this.setState({projects : null, error : res.error, pending : false});
            }
        });
    });
  }

  componentDidMount() {
    this.update()
    this.props.socket.on('/api/project/done', () => {this.update()})
  }

   // add the user to the project
  handleJoinProject(event){
   event.preventDefault();
   this.setState({projects: this.state.projects, error : false, pending : true}, () => {
       var project = this.state.projects.filter((project, index) => {
            return project._id === this.refs.projectname.value.split('|')[1];
       })[0]
       if(!project){
            this.setState({error : 'Unknown project', pending : false});
       } else {
           var filter = {_id: project._id}
           var update = {"$push" : {users : "token"}}
           this.props.socket.emit('/api/project/update', filter, update, res => {
                if (res.projects) {
                    this.setState({error : false, pending : false}, () => {
                        $('#modal_joinproject').modal('close');
                    })
                }
                if (res.error) {
                    this.setState({error : res.error, pending : false});
                }
           });
       }
   })
  };


  componentWillUnmount() {
    this.props.socket.off('/api/project/done', () => {this.update()})
  }

  render() {
    let preloaderComponent;

    if (this.state.pending){
        preloaderComponent = <div className="row">
                              <div className="preloader-wrapper small active center">
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
                             </div>
    }

    let errorComponent;

    if (this.state.error){
        errorComponent = <div className="row">
                            <div className="col s12 center">
                                <h6 className='rezbuild-text'>{this.state.error}</h6>
                            </div>
                        </div>
    }

    let unauthorizedprojectlistComponent =
          <div className="row">
              <div className="input-field col l12 m9 s12">
                  <input placeholder="Search a project..." id="input_autocomplete_joinproject" type="text"  ref="projectname"  className="autocomplete" required />
                  <label htmlFor="input_autocomplete_joinproject">Project</label>
              </div>
              <div className="input-field col s6 right-align">
                  <button className="btn waves-effect waves-light" type="submit">SUBMIT<i className="material-icons right">send</i></button>
             </div>
              <div className="input-field col s6 left-align">
                  <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={() => $("#modal_joinproject").modal('close')}> <i className="material-icons left">cancel</i>CANCEL</a>
              </div>
          </div>

    return (
    <div id="modal_joinproject" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Join project</h4>
        </div>
       <div className="modal-content">
          <form className="col s12" onSubmit={this.handleJoinProject} autoComplete="off">
              {unauthorizedprojectlistComponent}
              {preloaderComponent}
              {errorComponent}
          </form>
       </div>
    </div>
    );
  }
}

const JoinProjectForm = props => (
  <SocketContext.Consumer>
  { (context) => <JoinProjectFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default JoinProjectForm


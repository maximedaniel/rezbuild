import React, { Component } from 'react'
//import $ from 'jquery'
//import M from "materialize-css/dist/js/materialize.js";
import SocketContext from '../SocketContext'
import axios from 'axios'

axios.defaults.withCredentials = true

var $ = window.$

class JoinProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.handleJoinProject = this.handleJoinProject.bind(this);
   this.state = {unauthorizedProjects: null, error : false, pending : false}
  }
  updateUnauthorizedProjectList(){
    this.setState({unauthorizedProjects: null, error : false, pending : true}, () =>{
        this.props.socket.emit('/api/user/unauthorizedprojects', {});
        this.props.socket.on('/api/user/unauthorizedprojects', res => {
            if (res.unauthorizedProjects) {
                this.setState({unauthorizedProjects : res.unauthorizedProjects, error : false, pending : false}, () =>{
                        var data = {}
                        this.state.unauthorizedProjects.map((project, index) => (data[String(project.name)] = null))
                        $('#input_autocomplete_joinproject').autocomplete({data: data});
                });
            }
            if(res.error){
                this.setState({unauthorizedProjects : null, error : res.error, pending : false});
            }
        });
    });
        /*axios.get('/api/user/listunauthorizedproject')
        .then(res => {
            this.setState({unauthorizedprojectlist: res.data.unauthorizedprojectlist, error : false, pending : false})
            var data = {}
            this.state.unauthorizedprojectlist.map((project, index) => (data[String(project.name)] = null))
            $('#input_autocomplete_joinproject').autocomplete({data: data});
        })
        .catch(err => {
            console.log(err)
            if(err && err.response && err.response.data){
                this.setState({unauthorizedprojectlist: null, error : err.response.data, pending : false});
            } else {
                this.setState({unauthorizedprojectlist: null, error : 'Network error', pending : false});
            }
        });*/
  }
  componentDidMount() {
    this.updateUnauthorizedProjectList()

     // $(document).ready(function() {
    //    M.Modal.init($('#modal_joinproject'), {onOpenStart: () => {this.updateUnauthorizedProjectList()}});
     //   M.Autocomplete.init($('#input_autocomplete_joinproject'), {});
    //    this.updateUnauthorizedProjectList();
     // });
    this.props.socket.on('/api/user/removeproject', res =>{
        this.updateUnauthorizedProjectList()
    });

  }

  handleJoinProject(event){
   event.preventDefault();
   this.setState({unauthorizedProjects: this.state.unauthorizedProjects, error : false, pending : true}, () => {
       var joinedProject = this.state.unauthorizedProjects.filter((project, index) => {
            return project.name === this.refs.projectname.value;
       })[0]
       console.log(joinedProject)
       this.props.socket.emit('/api/user/joinproject', { _id: joinedProject._id});
       this.props.socket.on('/api/user/joinproject', res => {
            if (res.updatedUser) {
                console.log(res.updatedUser)
                this.setState({error : false, pending : false}, () => {
                    $('#modal_joinproject').modal('close');
                })
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
       });
   })
  };

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
              <div className="input-field col l10 m9 s12">
                  <input id="input_autocomplete_joinproject" type="text"  ref="projectname"  className="autocomplete" required />
                  <label htmlFor="input_autocomplete_joinproject">Name</label>
              </div>
              <div className="input-field col l2 m3  s12 center">
                  <button className="btn waves-effect waves-light" type="submit">JOIN</button>
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
  {socket => <JoinProjectFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default JoinProjectForm


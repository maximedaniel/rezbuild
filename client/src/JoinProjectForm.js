import React, { Component } from 'react'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'

axios.defaults.withCredentials = true

class JoinProjectForm extends Component {

  constructor(props){
   super(props);
   this.handleJoinProject = this.handleJoinProject.bind(this);
   this.state = {unauthorizedprojectlist: null, error : false, pending : false}
  }

  componentDidMount() {
  this.setState({unauthorizedprojectlist: null, error : false, pending : true})
    axios.get('http://localhost:3001/api/unauthorizedprojectlist')
    .then(res => {
        this.setState({unauthorizedprojectlist: res.data.unauthorizedprojectlist, error : false, pending : false})
        var data = {}
        this.state.unauthorizedprojectlist.map((project, index) => (data[String(project.name)] = null))
        M.Modal.init($('#modal_joinproject'), {});
        M.Autocomplete.init($('#input_autocomplete_joinproject'), {});
        M.Autocomplete.getInstance($('#input_autocomplete_joinproject')).updateData(data);
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({unauthorizedprojectlist: null, error : err.response.data, pending : false});
        } else {
            this.setState({unauthorizedprojectlist: null, error : 'Network error', pending : false});
        }
    });
  }

  handleJoinProject(event){
   event.preventDefault();
   this.setState({unauthorizedprojectlist: this.state.unauthorizedprojectlist, error : false, pending : true})

   var poid = false;
   this.state.unauthorizedprojectlist.map((project, index) => {
    (project.name == this.refs.projectname.value) ? poid = project.oid : null;
   })

   if(poid){
    axios.post('http://localhost:3001/api/joinproject', {poid:poid})
    .then(res => {
        this.setState({unauthorizedprojectlist: this.state.unauthorizedprojectlist, error : false, pending : false})
        M.Modal.getInstance($('#modal_joinproject')).close()
        this.props.updateProjectList()
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({unauthorizedprojectlist: null, error : err.response.data, pending : false});
        } else {
            this.setState({unauthorizedprojectlist: null, error : 'Network error', pending : false});
        }
    });
   }

  };

  render() {
    return (
    <div id="modal_joinproject" className="modal">
       <div className="modal-content">
          <form className="col s12" onSubmit={this.handleJoinProject}>
              <div className="col s12 center">
              <h5 className="rezbuild-text"><strong>Join project</strong></h5>
              </div>
              <div className="input-field col s6">
                  <input id="input_autocomplete_joinproject" type="text"  ref="projectname" className="autocomplete" required />
                  <label htmlFor="input_autocomplete_joinproject">Project Name</label>
              </div>
              <div className="input-field col s12 center">
                  <button className="btn waves-effect waves-light" type="submit">JOIN</button>
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
          </form>
       </div>
    </div>
    );
  }
}

export default JoinProjectForm;

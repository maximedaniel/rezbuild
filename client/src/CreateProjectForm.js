import React, { Component } from 'react'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'

axios.defaults.withCredentials = true

class CreateProjectForm extends Component {

  constructor(props){
   super(props);
   this.handleCreateProject = this.handleCreateProject.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    var elem = $('#modal_createproject');
    M.Modal.init(elem, {});
  }

  handleCreateProject(event){
   event.preventDefault();
    this.setState({error : false, pending : true})
    axios.post('http://localhost:3001/api/createproject', {
        name : this.refs.name.value,
        timestamp : new Date().getTime()
    })
    .then(res => {
        this.setState({error : false, pending : false})
        M.Modal.getInstance($('#modal_createproject')).close()
        this.props.updateProjectList()
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({error : err.response.data, pending : false});
        } else {
            this.setState({error : 'Network error', pending : false});
        }
    });
  };

  render() {
    return (
    <div id="modal_createproject" className="modal">
       <div className="modal-content">
          <form className="col s12" onSubmit={this.handleCreateProject}>
              <div className="col s12 center">
              <h5 className="rezbuild-text"><strong>Create project</strong></h5>
              </div>
              <div className="input-field col s6">
                  <input id="input_name" type="text"  ref="name" required />
                  <label htmlFor="input_name">Project Name</label>
              </div>
              <div className="input-field col s12 center">
                  <button className="btn waves-effect waves-light" type="submit">CREATE</button>
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

export default CreateProjectForm;

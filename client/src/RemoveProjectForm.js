import React, { Component } from 'react'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
import axios from 'axios'

axios.defaults.withCredentials = true

class RemoveProjectForm extends Component {

  constructor(props){
   super(props);
   this.handleRemoveProject = this.handleRemoveProject.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    var elem = $("#modal_createproject_"+this.props.project.oid);
    M.Modal.init(elem, {});
  }

  handleRemoveProject(event){
   event.preventDefault();
    this.setState({error : false, pending : true})
    axios.post('http://localhost:3001/api/removeproject', {poid:this.props.project.oid})
    .then(res => {
        this.setState({error : false, pending : false})
        M.Modal.getInstance($('#modal_createproject_'+this.props.project.oid)).close()
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
    <div id={"modal_createproject_"+this.props.project.oid} className="modal">
       <div className="modal-content">
          <form className="col s12" >
              <div className="col s12 center">
              <h5 className="rezbuild-text">Do you want to remove <strong>{this.props.project.name}</strong> ?</h5>
              </div>
              <div className="input-field col s6 right-align">
                  <button className="btn waves-effect waves-light" onClick={this.handleRemoveProject}>YES</button>
              </div>
              <div className="input-field col s6 left-align">
                  <button className="btn waves-effect waves-light white rezbuild-text modal-close">NO</button>
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

export default RemoveProjectForm;

import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../SocketContext'

axios.defaults.withCredentials = true

var $ = window.$

class CreateProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.state = {error : false, pending : false}
  }

  submit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
        var create = {name : this.refs.name.value, owner: "token", users: ["token"]}
        this.props.socket.emit('/api/project/create', create, res => {
            if (res.projects){
                console.log(res.projects)
                this.setState({error : false, pending : false}, () => {
                    $('#modal_createproject').modal('close');
                })
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
        });
    })




   /* axios.post('/api/user/createproject', {
        name : this.refs.name.value
    })
    .then(res => {
        this.setState({error : false, pending : false})
        $('#modal_createproject').modal('close');
        this.props.updateProjectList()
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({error : err.response.data, pending : false});
            $('#modal_createproject').modal('close');
        } else {
            this.setState({error : 'Network error', pending : false});
            $('#modal_createproject').modal('close');
        }
    });*/
  };

  render() {
    return (
    <div id="modal_createproject" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Create project</h4>
        </div>
        <div className="modal-content">
          <form className="col s12" onSubmit={this.submit}>
             <div className="row">
                <div className="col s12 m12 l4 center">
                    <h5 className="rezbuild-text">Construction</h5>
                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="name" />
                          <label htmlFor="input_name">Name</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="country" />
                          <label htmlFor="input_name">Country</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="city" />
                          <label htmlFor="input_name">City</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="address" />
                          <label htmlFor="input_name">Address</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="year" />
                          <label htmlFor="input_name">Year</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="windows" />
                          <label htmlFor="input_name">Windows</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="doors" />
                          <label htmlFor="input_name">Doors</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="surface" />
                          <label htmlFor="input_name">Surface</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="style" />
                          <label htmlFor="input_name">Style</label>
                    </div>
                 </div>
                <div className="col s12 m12 l4 center">

                    <h5 className="rezbuild-text">Constraints</h5>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="budge" />
                          <label htmlFor="input_name">Budget</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="norm" />
                          <label htmlFor="input_name">Norm</label>
                    </div>
                    <h5 className="rezbuild-text">Criteria</h5>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="social" />
                          <label htmlFor="input_name">Social</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="ecological" />
                          <label htmlFor="input_name">Ecological</label>
                    </div>

                    <div className="input-field col s12">
                          <input id="input_name" type="text"  ref="economical" />
                          <label htmlFor="input_name">Economical</label>
                    </div>
                </div>
                <div className="col s12 m12 l4 center">
                    <h5 className="rezbuild-text">Vision</h5>
                    <div className="input-field col s12">
                              <textarea id="textarea1" className="materialize-textarea"></textarea>
                              <label htmlFor="textarea1">Vision</label>
                    </div>
                </div>
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

const CreateProjectForm = props => (
  <SocketContext.Consumer>
  {socket => <CreateProjectFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default CreateProjectForm;

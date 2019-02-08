import React, { Component } from 'react'
import axios from 'axios'
import {browserHistory} from 'react-router'

axios.defaults.withCredentials = true

var $ = window.$

class SettingsForm extends Component {
  // Initialize the state
  constructor(props){
   super(props);
   this.handleSubmit = this.handleSubmit.bind(this);
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
    this.props.user.roles.map((role, index) => $("#"+role).prop( "checked", true ))
  }

  handleSubmit(event){
   event.preventDefault();
   this.setState({error : false, pending : true})
   axios.post('http://localhost:3001/settings', {
        roles : $("input[name='roles']:checked").map(function() {return $(this).val();}).get(),
   })
    .then(res => {
        this.setState({error : false, pending : false})
        $('#modal_settings').modal('close')
        browserHistory.push('/')
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({error : err.response.data, pending : false});
            $('#modal_settings').modal('close')
            browserHistory.push('/')
        } else {
            this.setState({error : 'Network error', pending : false});
            $('#modal_settings').modal('close')
            browserHistory.push('/')
        }
    });
  }

  render() {
    return (
    <div id="modal_settings" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Settings</h4>
        </div>
       <div className="modal-content">
            <form className="col s12" onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="input-field col s12 m3 l2">
                    <input type="checkbox"  name="roles" value="Customer" id="Customer"/><label htmlFor="Customer">Customer</label>
                    </div>
                    <div className="input-field col s12 m3 l2">
                    <input type="checkbox"  name="roles" value="Designer" id="Designer"/><label htmlFor="Designer">Designer</label>
                    </div>
                    <div className="input-field col s12 m3 l2">
                    <input type="checkbox"  name="roles" value="Analyst" id="Analyst"/><label htmlFor="Analyst">Analyst</label>
                    </div>
                { this.state.pending ?
                 <div className="preloader-wrapper small active">
                    <div className="spinner-layer">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div class="gap-patch">
                        <div className="circle"></div>
                      </div><div class="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div> : ''
                }

                { this.state.error ?
                <div className="row">
                    <div className="col s12 center">
                        <h6 className='rezbuild-text'>{this.state.error}</h6>
                    </div>
                </div> : ''
                }
                    <div className=" col s12 m3 l2 center">
                          <button className="btn waves-effect waves-light" type="submit">SAVE</button>
                    </div>
                </div>
              </form>
       </div>
    </div>
    );
  }
}
export default SettingsForm;
import React, { Component } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import Dashboard from './Dashboard'
import {browserHistory} from 'react-router'

var $ = window.$

class Project extends Component {

  constructor(props){
    super(props);
    this.state = {user : null, project : null, error : false, pending : false}
    //{this.props.location.pathname}
  }

  componentDidMount(){
    this.setState({user: null, project: null, error : false, pending : false})
     axios.get('/api/user/project/'+this.props.params._id)
           .then(res => {
                   this.setState({user : res.data.user, project : res.data.project, error : false, pending : false})
           })
           .catch(err => {
                console.log(err)
                if(err && err.response && err.response.data){
                    this.setState({user: null, project: null, error : err.response.data, pending : false});
                } else {
                    this.setState({user: null, project: null, error : 'Network error', pending : false});
                }
                browserHistory.push('/')
           });
  }

  render() {
        let preloaderComponent;

        if (this.state.pending){
            preloaderComponent = <div className="preloader-wrapper small active">
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
        }
        let errorComponent;

        if (this.state.error){
            errorComponent = <div className="row">
                                <div className="col s12">
                                    <h6 className='rezbuild-text'>{this.state.error}</h6>
                                </div>
                            </div>
        }
        let navbarComponent;

        if (this.state.user){
            navbarComponent =  <Navbar user={this.state.user} path={['Projects', this.state.project.name]}/>
        }

        let projectComponent;

        if(this.state.project){
            projectComponent = <h1> Project {this.state.project._id}</h1>
        }


        return  (
        <div>
            {navbarComponent}
            <Dashboard />
         </div>
        );
    }
}
export default Project;
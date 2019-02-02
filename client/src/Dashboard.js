import React, { Component } from 'react'
import axios from 'axios'
import {browserHistory} from 'react-router'

class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {user : null, project : null, error : false, pending : false}
    //{this.props.location.pathname}
  }

  componentDidMount(){
    this.setState({user: null, project: null, error : false, pending : false})
     axios.get('http://localhost:3001/api/project/'+this.props.params.oid)
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
        return  (
        <div>
         <h1> Project {this.props.params.oid}</h1>
         </div>
        );
    }
}
export default Dashboard;
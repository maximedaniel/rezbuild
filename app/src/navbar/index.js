import React, { Component } from 'react'
import {Link} from 'react-router'
import {browserHistory} from 'react-router'
import SocketContext from '../SocketContext'
import axios from 'axios'
import SettingsForm from './settings'
import common from 'common'

axios.defaults.withCredentials = true

var $ = window.$

class NavbarCore extends Component {

  constructor(props){
    super(props);
    this.handleSignout = this.handleSignout.bind(this);
    this.update = this.update.bind(this)
    this.state = {user: null, error : false, pending : false}
  }

  update(){
    $('.button-collapse').sideNav('hide')
    this.setState({user : null, error : false, pending : true}, () => {
        var filter = { _id : "token" }
        this.props.socket.emit('/api/user/get', filter, res => {
            if (res.users) {
                this.setState({user : res.users[0], error : false, pending : false})
            }
            else {
                if(res.error){
                    this.setState({user : null, error : res.error, pending : false}, () => {browserHistory.push('/signin')})

                } else {
                    this.setState({user : null, error : 'Network error', pending : false})
                }
            }
        });
    })
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevState.user !== this.state.user) {
        $(".button-collapse").sideNav();
        $('#modal_settings').modal();
      }
  }

  handleSignout(event){
   event.preventDefault();
   this.setState({error : false, pending : true}, () => {
       this.props.socket.emit('/api/signout', {}, res => {
            if (res.user) {
                this.setState({error : null, pending : false}, () => {
                    $('.button-collapse').sideNav('hide')
                    browserHistory.push('/signin')
                });
            }
       });
    });
  };

  render() {
    if(this.state.user) {
        let pathComponent;
        pathComponent = this.props.path.map((level, index) =>

                    <Link to={ (index === 0) ? '/' : '#!'} className="breadcrumb" key={index}>{level}</Link>
        );
        return (
           <nav>
             <div>
              <ul id="slide-out" className="side-nav">
                <li className="row rezbuild center" style={{lineHeight:'30px'}}>
                    <div className="col s12"> <i className="material-icons" style={{fontSize:'4rem'}}>account_circle</i></div>
                    <div className="col s12" style={{fontWeight:'bold'}}> {this.state.user.firstname} {this.state.user.lastname}</div>
                    <div className="col s12">
                    {
                      this.state.user.roles.map(role => common.ROLES[role].name).join()
                    }
                    </div>
                </li>

                <li><a className="modal-trigger" href="#modal_settings" ><i className="material-icons">settings</i>Settings</a></li>
                <li><a href="#!" onClick={this.handleSignout}><i className="material-icons">arrow_back</i>Sign out</a></li>

              </ul>
            <div className="nav-wrapper">
              <a href="#!" data-activates="slide-out" className="button-collapse" style={{padding:'0', display:'inline-flex'}} onClick={() => $('.button-collapse').sideNav('show')}> <i className="material-icons">menu</i></a>

              <ul className="right">
                <li><a href="#!"><img  className="brand-logo right" src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} /></a></li>
              </ul>
              <div className="col s12 left">
                {pathComponent}
                <SettingsForm user={this.state.user} update={this.update}/>
              </div>

            </div>
           </div>
          </nav>
        );
    } else return <div/>;
  }
}

const NavbarComponent = props => (
  <SocketContext.Consumer>
  { (context) => <NavbarCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default NavbarComponent;
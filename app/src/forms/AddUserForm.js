import React, { Component } from 'react'
import SocketContext from '../SocketContext'
import axios from 'axios'

axios.defaults.withCredentials = true

var $ = window.$

class AddUserFormCore extends Component {

  constructor(props){
   super(props);
   this.handleAddUser = this.handleAddUser.bind(this);
   this.handleCopyUrl = this.handleCopyUrl.bind(this);
   this.state = {unauthorizedUsers: null, error : false, pending : false}
  }
  updateUnauthorizedUsers(){
    this.setState({unauthorizedUsers: null, error : false, pending : true}, () =>{
        this.props.socket.emit('/api/user/unauthorizedusersproject',  { pid: this.props.project._id });
        this.props.socket.on('/api/user/unauthorizedusersproject', res => {
            if (res.unauthorizedUsers) {
                console.log(res.unauthorizedUsers)
                this.setState({unauthorizedUsers : res.unauthorizedUsers, error : false, pending : false}, () =>{
                        var data = {}
                        this.state.unauthorizedUsers.map((user, index) => (data[String(user.firstname+" "+user.lastname + " (" + user.roles + ") - " + user._id)] = null))
                        $('#input_autocomplete_adduser').autocomplete({data: data});
                });
            }
            if(res.error){
                this.setState({unauthorizedUsers : null, error : res.error, pending : false});
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
    $('#modal_adduser').modal();
    this.updateUnauthorizedUsers()

     // $(document).ready(function() {
    //    M.Modal.init($('#modal_joinproject'), {onOpenStart: () => {this.updateUnauthorizedProjectList()}});
     //   M.Autocomplete.init($('#input_autocomplete_joinproject'), {});
    //    this.updateUnauthorizedProjectList();
     // });
    this.props.socket.on('/api/user/adduserproject', res => {
        this.updateUnauthorizedUsers()
    });

  }

  handleCopyUrl(event){
   event.preventDefault();
   console.log("handleCopyUrl")
   $('#input_projecturl').select();
   document.execCommand('copy');

  }

  handleAddUser(event){
   event.preventDefault();
   console.log("handleAddUser")
   this.setState({error : false, pending : true}, () => {
       var id = this.refs.username.value.split('-')[1].trim();
       var addedUser = this.state.unauthorizedUsers.filter((user, index) => {
            console.log(user._id, id)
            return user._id === id;
       })[0]
       console.log(addedUser)
       this.props.socket.emit('/api/user/adduserproject', { uid: addedUser._id,  pid: this.props.project._id});
       this.props.socket.on('/api/user/adduserproject', res => {
            if (res.addedUser) {
                console.log(res.addedUser)
                this.setState({error : false, pending : false}, () => {
                    $('#modal_adduser').modal('close');
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

    let unauthorizedUsersComponent =
          <div className="row">
              <div className="input-field col l10 m9 s12">
                  <input id="input_autocomplete_adduser" type="text"  ref="username"  className="autocomplete" required />
                  <label htmlFor="input_autocomplete_adduser">Find an existing user...</label>
              </div>
              <div className="input-field col l2 m3  s12 center">
                  <button className="btn waves-effect waves-light" type="submit">ADD</button>
              </div>
          </div>

    return (
    <div id="modal_adduser" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Invite user</h4>
        </div>
       <div className="modal-content">
          <form className="col s12" onSubmit={this.handleAddUser} autoComplete="off">
              {unauthorizedUsersComponent}
              {preloaderComponent}
              {errorComponent}
          </form>
          <form className="col s12"   onSubmit={this.handleCopyUrl} autoComplete="off">
          <div className="row">
            <div className="input-field col l10 m9 s12">
              <input id="input_projecturl" type="text" ref="input_projecturl"    className="validate"  value={window.location.href.replace('#!','')  + '/signin'} />
              <label  class="active" htmlFor="input_projecturl">Or share this url...</label>
            </div>
              <div className="input-field col l2 m3 s12 center">
                  <button className="btn waves-effect waves-light" type="submit">COPY</button>
              </div>
          </div>
          </form>

       </div>

    </div>
    );
  }
}

const AddUserForm = props => (
  <SocketContext.Consumer>
  {socket => <AddUserFormCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default AddUserForm


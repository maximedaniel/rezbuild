import React, { Component } from 'react'
import SocketContext from '../SocketContext'

var $ = window.$

class AddUserFormCore extends Component {

  constructor(props){
   super(props);
   this.handleAddUser = this.handleAddUser.bind(this);
   this.handleCopyUrl = this.handleCopyUrl.bind(this);
   this.state = {users: null, error : false, pending : false}
  }

  update(){
    this.setState({users : null, error : false, pending : true}, () => {
        var filter = {_id: this.props.project._id }
        this.props.socket.emit('/api/project/get', filter, res => {
            console.log(res.projects)
            if(res.projects){
                var filter = {_id: { "$nin" : res.projects[0].users}}
                this.props.socket.emit('/api/user/get', filter, res => {
                    if(res.users){
                        this.setState({users : res.users, error : false, pending : false}, () =>{
                            var data = {}
                            this.state.users.map((user, index) => (data[String(user.firstname+" "+user.lastname + " (" + user.roles + ") - " + user._id)] = null))
                            $('#input_autocomplete_adduser').autocomplete({data: data});
                        });
                    }
                    if(res.error){
                        this.setState({users : null, error : false, pending : false});
                    }
                });
            }
            if(res.error){
                this.setState({users : null, error : false, pending : false});
            }
        });
    })
  }

  componentDidMount() {
    $('#modal_adduser').modal();
    this.update()
    this.props.socket.on('/api/project/done', () => {this.update()})
  }

  handleCopyUrl(event){
   event.preventDefault();
   console.log("handleCopyUrl")
   $('#input_projecturl').select();
   document.execCommand('copy');

  }

  handleAddUser(event){
   event.preventDefault();
   if (this.refs.username.value.split('-').length < 2) {
        this.setState({error : 'unknown user', pending : false});

   } else {
       this.setState({error : false, pending : true}, () => {
            var id = this.refs.username.value.split('-').trim();
           var user = this.state.users.filter((user, index) => {
                console.log(user._id, id)
                return user._id === id;
           })[0]
           var filter = {_id: this.props.params._id}
           var update = {"$push" : {users : user._id}}
           this.props.socket.emit('/api/project/update', filter, update, res => {
                console.log(res)
                if (res.projects) {
                    this.setState({error : false, pending : false}, () => {
                        $('#modal_adduser').modal('close');
                    })
                }
                if (res.error) {
                    this.setState({error : res.error, pending : false});
                }
           });
       })
   }
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

    let usersComponent =
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
              {usersComponent}
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


/**
 * @class RemoveTaskForm
 * @extends Component
 * @description Create the form for removing a task
 */
import React, { Component } from 'react'
import SocketContext from '../../../../../SocketContext'

var $ = window.$

class RemoveTaskFormCore extends Component {

  constructor(props){
   super(props);
   this.cancel = this.cancel.bind(this)
   this.state = {error : false, pending : false}
  }

  componentDidMount() {
      $("#modal_removetask").modal({dismissible: false});
  }


  cancel(){
    this.props.cancel()
    $('#modal_removetask').modal('close');
  }


  render() {
    return (
    <div id="modal_removetask" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Remove task</h4>
        </div>
          <form className="col s12">
          <div className="row">
              <div className="col s12 center">
              <h5 className="rezbuild-text">Do you want to remove <strong style={{fontWeight:'900'}}>{this.props.task.name}</strong> ?</h5>
              </div>
              <div className="input-field col s6 right-align">
                  <a className="btn waves-effect waves-light" href="#!">YES<i className="material-icons right">check</i></a>
              </div>
              <div className="input-field col s6 left-align">
                  <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={this.cancel}><i className="material-icons left">clear</i>NO</a>
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
          </div>
          </form>
    </div>
    );
  }
}

const RemoveTaskForm = props => (
  <SocketContext.Consumer>
  { (context) => <RemoveTaskFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default RemoveTaskForm;

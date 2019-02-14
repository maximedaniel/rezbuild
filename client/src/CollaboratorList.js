import React, { Component } from 'react'
import axios from 'axios'


class CollaboratorList extends Component {
  constructor(props){
    super(props);
    this.state = {user: null, collaboratorList : null, error : false, pending : false}
  }
  updateCollaboratorList(){
    this.setState({user : null, collaboratorList : null, error : false, pending : true})
    axios.get('/api/user/'+this.props.project._id+'/users')
    .then(res => {
        this.setState({user: res.data.user, collaboratorList : res.data.users, error : false, pending : false})
       // M.FloatingActionButton.init($('.fixed-action-btn'), {});
        //M.Tooltip.init($('.tooltipped'), {});
    })
    .catch(err => {
        console.log(err)
        if(err && err.response && err.response.data){
            this.setState({user : null,  collaboratorList : null, error : err.response.data, pending : false});
        } else {
            this.setState({user : null,  collaboratorList : null, error : 'Network error', pending : false});
        }
    });
  }
  componentDidMount() {
    this.updateCollaboratorList()
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

        let collaboratorListComponent;

        if (this.state.collaboratorListComponent){
            collaboratorListComponent = this.state.collaboratorListComponent.map((collaborator, index) =>
                    <h5 key={index}>{collaborator.name}</h5>
            );
        }
        return (
                <div>
                    {collaboratorListComponent}
                    {preloaderComponent}
                    {errorComponent}
               </div>
        );
  }
}

export default CollaboratorList;

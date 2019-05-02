import React, { Component } from 'react'
import TrelloComponent from './TrelloComponent'
import GraphComponent from './GraphComponent'
import TeamComponent from './TeamComponent'
import { ParentSize } from '@vx/responsive'
import SocketContext from './SocketContext'

var $ = window.$

const lanesStyle = {
    color:'#fff',
    backgroundColor:'#f7931e',
    fontFamily: 'Exo 2'
}

const cardStyle = {
    maxWidth:'50px',
    color:'#000',
    backgroundColor:'#fff',
    fontFamily: 'Exo 2'
}

class DashboardCore extends Component {

  constructor(props){
    super(props);
    this.state = {revision: null, revisions: [], error: false, pending: false}
    this.setRevision = this.setRevision.bind(this)
  }

  update(){
        var filter = {project: this.props.project._id}
        this.setState({error : false, pending : true}, () => {
                this.props.socket.emit('/api/revision/get', filter, res => {
                    if(res.revisions) {
                        console.log(res.revisions)
                        this.setState({revisions: res.revisions, error : false, pending : false})
                    }
                    if (res.error) {
                        this.setState({revisions: [], error : res.error, pending : false});
                    }
                });
        });
  }

  setRevision(revision){
    this.setState({revision: revision}, () => {
        this.update()
    })
  }

  componentDidMount(){
  $(document).ready(function(){
    $('.tabs').tabs();
  });
   this.update()

  }

  render() {
        return  (
           <div>
           <div className="row">
                    <div className="col s12">
                      <ul className="tabs">
                        <li className="tab col s3"><a className="active" href="#tab_board">Workspace</a></li>
                        <li className="tab col s3"><a href="#tab_project">Tools</a></li>
                        <li className="tab col s3"><a href="#tab_team">Settings</a></li>
                      </ul>
                    </div>
           </div>
           <div id="tab_board" className="col s12">
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                 <div className="row transparent"  style={{marginBottom:0}}>
                      <div className="col s12 transparent">
                                <h5 className="rezbuild-text">Revisions</h5>
                                 <div className="section" style={{height:'250px', paddingBottom:0}}>
                                  {(this.state.revisions.length > 0) ?
                                  <GraphComponent
                                        revisions={this.state.revisions}
                                        revision={this.state.revision}
                                        setRevision={this.setRevision}
                                  />
                                  : <div className="preloader-wrapper small active">
                                    <div className="spinner-layer">
                                      <div className="circle-clipper left">
                                        <div className="circle"></div>
                                      </div><div className="gap-patch">
                                        <div className="circle"></div>
                                      </div><div className="circle-clipper right">
                                        <div className="circle"></div>
                                      </div>
                                    </div>
                                  </div>}
                                 </div>
                      </div>
                 </div>
             </div>
             <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
              <div className='row'   style={{marginBottom:0}}>
                 <div className="col s12 transparent">
                                <h5 className="rezbuild-text">Tasks</h5>
                                 { (this.state.revision) ?
                                     <TrelloComponent
                                       project = {this.props.project}
                                       revision = {this.state.revision}
                                       setRevision = {this.setRevision}
                                      />
                                  : ''}
                 </div>
              </div>
             </div>
             <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
              <div className='row'   style={{marginBottom:0}}>
                 <div className="col s12 transparent">
                 <h5 className="rezbuild-text">3D model</h5>
                     <div className="section" style={{height:'250px', paddingBottom:0}}>
                     </div>
                 </div>
              </div>
             </div>
           </div>

           <div id="tab_team" className="col s12">
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                 <div className="row transparent"  style={{marginBottom:0}}>
                      <div className="col l6 s12 transparent">
                            <h5 className="rezbuild-text">Team</h5>
                             <div className="section" style={{height:'250px', paddingBottom:0}}>
                                <TeamComponent project={this.props.project} params={this.props.params}/>
                             </div>
                      </div>
                      <div className="col l6 s12 transparent">
                            <h5 className="rezbuild-text">Project</h5>
                             <div className="section" style={{height:'250px', paddingBottom:0}}>
                             </div>
                      </div>
                 </div>
              </div>
           </div>
         </div>
        );
    }
}

const DashboardComponent = props => (
  <SocketContext.Consumer>
  { (context) => <DashboardCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default DashboardComponent;
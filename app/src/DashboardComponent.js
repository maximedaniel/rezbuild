import React, { Component } from 'react'
import TrelloComponent from './TrelloComponent'
import GraphComponent from './GraphComponent'
import CollaboratorListComponent from './CollaboratorListComponent'
import { ParentSize } from '@vx/responsive'
import SocketContext from './SocketContext'


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
   this.update()

  }

  render() {
        return  (
           <div>
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                 <div className="row transparent"  style={{marginBottom:0}}>
                      <div className="col s12 m3 l3 transparent">
                            <h5 className="rezbuild-text">Collaborators</h5>
                             <div className="divider rezbuild"></div>
                             <div className="section" style={{height:'300px', paddingBottom:0}}>
                                <CollaboratorListComponent project={this.props.project} params={this.props.params}/>
                             </div>
                      </div>
                      <div className="col s12 m9 l9 transparent">
                                <h5 className="rezbuild-text">Board</h5>
                                 <div className="divider rezbuild"></div>
                                 <div className="section" style={{height:'300px', paddingBottom:0}}>
                                  <ParentSize>
                                    {parent => (
                                      <GraphComponent
                                        parentWidth={parent.width}
                                        parentHeight={parent.height}
                                        parentTop={parent.top}
                                        parentLeft={parent.left}
                                        // this is the referer to the wrapper component
                                        parentRef={parent.ref}
                                        // this function can be called inside MySuperCoolVxChart to cause a resize of the wrapper component
                                        resizeParent={parent.resize}
                                        nodes={this.state.revisions}
                                        node={this.state.revision}
                                        setNode={this.setRevision}
                                      />
                                     )}
                                  </ParentSize>
                                 </div>
                      </div>
                 </div>
             </div>
             <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
              <div className='row'   style={{marginBottom:0}}>
                 <div className="col s12 transparent">
                                <h5 className="rezbuild-text">Task</h5>
                                 <div className="divider rezbuild"></div>
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
         </div>
        );
    }
}

const DashboardComponent = props => (
  <SocketContext.Consumer>
  {socket => <DashboardCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default DashboardComponent;
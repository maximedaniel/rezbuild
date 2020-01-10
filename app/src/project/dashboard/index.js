import React, { Component } from 'react'
import TrelloComponent from './trello'
import FileExplorerComponent from './fileExplorer'
import GraphComponent from './graph'
import TeamComponent from './team'
import ProjectInformationComponent from './projectInformation'
import { ParentSize } from '@vx/responsive'
import SocketContext from '../../SocketContext'
import VersionComparatorComponent from './VersionComparator'

var $ = window.$

class DashboardCore extends Component {

  constructor(props){
    super(props);
    this.state = {compareMode: false, selectedTasks: [], tasks: [], users: [],  error: false, pending: false};
    this.setTask = this.setTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.toggleCompareMode = this.toggleCompareMode.bind(this);
  }
  toggleCompareMode(){
    this.setState({compareMode:!this.state.compareMode});
  }
  fetchTasks(){
    var filter = {project: this.props.project._id}
    this.setState({tasks: [], error : false, pending : true}, () => {
            this.props.socket.emit('/api/task/get', filter, res => {
                if(res.tasks) {
                    this.setState({tasks: res.tasks, error : false, pending : false})
                }
                if (res.error) {
                    this.setState({tasks: [], error : res.error, pending : false});
                }
            });
    });
  }

  fetchUsers(){
    this.setState({users: [], error : false, pending : true}, () => {
      var filter = {_id: this.props.project._id }
      this.props.socket.emit('/api/project/get', filter, res => {
          if(res.projects){
              var filter = {_id: { "$in" : res.projects[0].users}}
              this.props.socket.emit('/api/user/get', filter, res => {
                  if(res.users){
                      this.setState({users : res.users, error : false, pending : false})
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
    });
  }

  update(){
    this.fetchTasks()
    this.fetchUsers()
  }

  setTask(task){
    if(task) this.setState({selectedTasks: [task]})
    else this.setState({selectedTasks: []})
  }

  addTask(task){
    console.log('addTask' , task)
    this.setState({selectedTasks: this.state.selectedTasks.concat([task])});
  }
  removeTask(task){
    console.log('removeTask', task) 
    this.setState({selectedTasks: this.state.selectedTasks.filter( selectedTask => selectedTask._id !== task._id)});
  }

  componentDidMount(){
    $(document).ready(function(){
      $('.tabs').tabs();
      $('.tooltipped').tooltip({delay:0, html:true});
    });
    this.update()
    this.props.socket.on('/api/task/done', () => {
    this.fetchTasks()
    });
    this.props.socket.on('/api/user/done', () => {
    this.fetchUsers()
    });
  }
  componentWillUnmount(){
    $('.tooltipped').tooltip('remove');
  }

  render() {
    let loaderComponent =  <div className="preloader-wrapper small active">
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
        return  (
           <div>
           <div className="row">
                    <div className="col s12 white">
                      <ul className="tabs">
                        <li className="tab col s2 tooltipped" data-position="top" data-tooltip="Manage project tasks, versions and files"><a className="active" href="#tab_board">Workspace</a></li>
                        <li className="tab col s2 tooltipped" data-position="top" data-tooltip="Make use of project tools"><a href="#tab_tools">Tools</a></li>
                        <li className="tab col s2 tooltipped" data-position="top" data-tooltip="Invite and communicate with collaborators"><a href="#tab_team">Team</a></li>
                        <li className="tab col s3 tooltipped" data-position="top" data-tooltip="Update general and specific information"><a href="#tab_project">Project Information</a></li>
                      </ul>
                    </div>
           </div>

           <div id="tab_board" className="col s12">
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:0, marginTop:'1rem'}}>
                 <div className="row transparent"  style={{marginBottom:0}}>
                      <div className="col s12 transparent">
                                <h5 className="rezbuild-text   tooltipped" data-position="top" data-tooltip="Click on a node to select a version of the project"> Navigation </h5>
                                {
                                  (this.state.tasks.length > 0) ?
                                    <div className='col s12'>
                                      <div className="switch">
                                        <label>
                                          TASK MODE
                                          <input type="checkbox"
                                          checked={this.state.compareMode}
                                          ref="compareMode"
                                          onChange={() => this.toggleCompareMode()}
                                          />
                                          <span class="lever"/>
                                          COMPARE MODE
                                        </label>
                                      </div>
                                    </div>
                                    :''
                                }

                                <div className="section" style={{height:'400px', paddingBottom:0}}>
                                  { this.state.tasks.length > 0  ?
                                  <ParentSize>
                                  {
                                    parent => (
                                    <GraphComponent
                                      parentWidth={parent.width}
                                      parentHeight={parent.height}
                                      parentTop={parent.top}
                                      parentLeft={parent.left}
                                      // this is the referer to the wrapper component
                                      parentRef={parent.ref}
                                      // this function can be called inside MySuperCoolVxChart to cause a resize of the wrapper component
                                      resizeParent={parent.resize}
                                      tasks={this.state.tasks}
                                      selectedTasks={this.state.selectedTasks}
                                      setTask={this.setTask}
                                      addTask={this.addTask}
                                      removeTask={this.removeTask}
                                      compareMode={this.state.compareMode}
                                    />
                                    )
                                   }
                                  </ParentSize>
                                   : loaderComponent}
                                 </div>
                      </div>
                 </div>
                {!this.state.compareMode ?
                  ((this.state.tasks.length > 0 && this.state.selectedTasks.length > 0)?
                  <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingTop:'0.2rem'}}>
                      <div className='row'>
                        <div className="col l12 m12 s12 transparent">
                            {/*<h5 className="rezbuild-text  tooltipped" data-position="top" data-tooltip="Explore the BIM models and KPI data of this version of the project">Version</h5>  */}
                            <div className="section">
                                  <FileExplorerComponent
                                    project = {this.props.project}
                                    tasks = {this.state.tasks}
                                    //selectedTasks={this.state.selectedTasks}
                                    task = {this.state.selectedTasks[0]}
                                    setTask={this.setTask}
                                    addTask={this.addTask}
                                    removeTask={this.removeTask}
                                    />
                            </div>
                        </div>
                      </div>
                    </div> : '')
                  :
                  ((this.state.tasks.length > 0 && this.state.selectedTasks.length > 0)?
                  <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingTop:'0.2rem'}}>
                      <div className='row'>
                        <div className="col l12 m12 s12 transparent">
                            {/*<h5 className="rezbuild-text  tooltipped" data-position="top" data-tooltip="Explore the BIM models and KPI data of this version of the project">Version</h5>  */}
                            <div className="section">
                                  <VersionComparatorComponent
                                  project = {this.props.project}
                                  tasks = {this.state.tasks}
                                  selectedTasks={this.state.selectedTasks}
                                  setTask={this.setTask}
                                  addTask={this.addTask}
                                  removeTask={this.removeTask}
                                  />
                            </div>
                        </div>
                      </div>
                    </div>:'')
                  }
             </div>
              <div className="section" style={{display:this.state.compareMode?'none':'block', marginLeft:'2%', marginRight:'2%', paddingTop:'0.2rem'}}>
                <div className='row'>
                  <div className="col l12 m12 s12 transparent">
                                  <h5 className="rezbuild-text   tooltipped" data-position="top" data-tooltip="Drag-And-Drop cards to assign or perform tasks at this version of the project">Tasks</h5>
                                  <div className="section">
                                    { (this.state.tasks.length > 0 && this.state.users.length > 0) ?
                                      <TrelloComponent
                                        project = {this.props.project}
                                        users = {this.state.users}
                                        tasks = {this.state.tasks}
                                        // selectedTasks={this.state.selectedTasks}
                                        task = {this.state.selectedTasks[0]}
                                        setTask={this.setTask}
                                        addTask={this.addTask}
                                        removeTask={this.removeTask}
                                        />
                                        : loaderComponent}
                                  </div>
                  </div>
                </div>
              </div>
           </div>
          <div id="tab_tools" className="col s12">
            <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                <div className="row transparent"  style={{marginBottom:0}}>
                    <div className="col s12 transparent">
                            <div className="section" style={{height:'250px', paddingBottom:0}}>
                              <div className="col s12 m6">
                                <div className="card white">
                                  <div className="card-content black-text">
                                    <span className="card-title rezbuild-text">OpenBimLibraryTool</span>
                                    <p>Description of OpenBimLibraryTool...</p>
                                  </div>
                                  <div className="card-action">
                                    <a className="btn waves-effect waves-light rezbuild white-text" target="_blank" rel="noopener noreferrer" href="/technologies">OPEN IN NEW TAB <i className="material-icons right">open_in_new</i></a>
                                  </div>
                                </div>
                              </div>
                              <div className="col s12 m6">
                                <div className="card white">
                                  <div className="card-content black-text">
                                    <span className="card-title rezbuild-text">RankingTechnologyTool</span>
                                    <p>Description of RankingTechnologyTool...</p>
                                  </div>
                                  <div className="card-action">
                                    <a className="btn waves-effect waves-light rezbuild white-text" target="_blank" rel="noopener noreferrer" href="http://rezbuild-sorter.herokuapp.com">OPEN IN NEW TAB <i className="material-icons right">open_in_new</i></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                    </div>
                </div>
            </div>
          </div>
           <div id="tab_team" className="col s12">
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                 <div className="row transparent">
                      <div className="col s12 transparent">
                             <div className="section">
                                <TeamComponent project={this.props.project} params={this.props.params}/>
                             </div>
                      </div>
                 </div>
              </div>
           </div>
          <div id="tab_project" className="col s12">
            <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                <div className="row transparent">
                    <div className="col s12 transparent">
                            <div className="section">
                              <ProjectInformationComponent  project={this.props.project} params={this.props.params}/>
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
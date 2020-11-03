/**
 * @class FileExplorer
 * @extends Component
 * @description Create the file explorer part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
import RadarRechartComponent from '../RadarRechart'
import moment from 'moment'
import ComputeVersion from '../ComputeVersion'
import { ParentSize } from '@vx/responsive'
import ModelViewerComponent from '../ModelViewer'
import IndicatorExplorerComponent from '../IndicatorExplorer'
import EditDoneTaskForm from '../trello/editDoneTaskForm'

var $ = window.$;

class FileExplorerCore extends Component {

    constructor(props){
        super(props)
        this.state = {

            modelTask : null,
            modelMode :false,
            economicTask :null,
            socialTask : null,
            energyTask : null,
            comfortTask : null,
            expandedTasks : [false,false,false,false],
            editedTasks : [false,false,false,false],
            error: false,
            pending: false
        };
        this.renderKPIsOfTask = this.renderKPIsOfTask.bind(this);
        this.renderKpiViewer = this.renderKpiViewer.bind(this);
    }

    getTaskIndex = (taskType) => {
        switch (taskType) {
            case "economic" : return 0;
            case "social"   : return 1;
            case "energy"   : return 2;
            case "comfort"  : return 3;
            default : return -1;
        }
    }

    getTaskExpanded = (taskType) => {
        var i = this.getTaskIndex(taskType);
        if (i != -1)
            return this.state.expandedTasks[i];
        return false;
    }

    switchTaskExpanded = (taskType) => {
        var i = this.getTaskIndex(taskType);
        if (i != -1) {
            var _expandedTasks = this.state.expandedTasks;
            _expandedTasks[i] = !_expandedTasks[i]
            this.setState({expandedTasks: _expandedTasks})
        }
    }

    getTaskEdited = (taskType) => {
        var i = this.getTaskIndex(taskType);
        if (i != -1)
            return this.state.editedTasks[i];
        return false;
    }

    editTask(taskType, edit) {
        var i = this.getTaskIndex(taskType);
        if (i != -1) {
            var _editedTasks = this.state.editedTasks;
            _editedTasks[i] = edit;
            this.setState({editedTasks: _editedTasks})
        }
    }

    // Fetch the tasks by category
    fetch() {
        if(this.props.task)
            this.setState(ComputeVersion.fetchRelevantTasks(this.props.task, this.props.tasks));
            this.setState({expandedTasks : [false,false,false,false], editedTasks : [false,false,false,false]});
    }
    
   componentDidMount(){
       this.fetch()
       $(document).ready(() => {
         $('.tooltipped').tooltip({delay:0, html:true});
        // window.scrollTo(0, 0);
       });
    }

    /*componentWillUpdate(){
        window.scrollTo(0, 0);
    }*/

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.task !== this.props.task){
        this.fetch()
        $('.tooltipped').tooltip({delay:0, html:true});
     }
    }

    componentWillUnmount(){
        $('.tooltipped').tooltip('remove');
    }

    renderKPIsOfTask(task){
        return (
            <span className="col s12"> 
                  {
                        task.names.map((name, index) => 
                        <div key={index}>
                            <div className="col s10 left-align" style={{padding:0}}>
                                <h6 className="black-text">{name}</h6>
                                <h6>{task.values[index] + ' ' + task.formats[index]}</h6>
                            </div>
                            {task.files[index] ? 
                                 <a className="col s2 btn rezbuild right-align tooltipped secondary-content" 
                                 data-position="top" 
                                 data-tooltip="Download" 
                                 style={{marginTop:'0.5rem'}}
                                href={window.location.protocol + "//" + this.props.host + "/" + task._id + "/" + task.files[index]}>
                                        <i className="material-icons white-text">cloud_download</i>
                                </a>
                             : ''}
                        </div>
                        )
                  }
            </span>
        );
    };

    renderKpiViewer(_task, _taskType, _caption) {
        if (_task) {
            var kpiViewer = this.renderKPIsOfTask(_task);

            return (
                <div className='col s12'>
                    <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                        <h6 className="rezbuild-text left-align col s10" style={{padding:0}}>{_caption}</h6>
                        <button className="btn-flat center col s2 waves-effect waves-light" 
                            onClick={ (e) => { e.preventDefault(); this.switchTaskExpanded(_taskType); }}>
                            <i className="material-icons rezbuild-text">{ this.getTaskExpanded(_taskType)?"expand_less":"expand_more" }</i>
                        </button>
                        <div>
                            <EditDoneTaskForm task={_task} show={this.getTaskEdited(_taskType)} onClose={(e) => { e.preventDefault(); this.editTask(_taskType, false); }} />
                        </div>
                        <a className="modal-trigger" href="" onClick = { (e) => { e.preventDefault(); this.editTask(_taskType, true); }}>
                            <i className="material-icons rezbuild-text">edit</i>
                        </a>
                    </div>
                    { this.getTaskExpanded(_taskType)?kpiViewer: '' }
                </div>
            );
        }
        return '';
    }

    render(){
        
        var kpiScores = ComputeVersion.computeScoreOfRelevantTask(this.props.tasks, this.props.task);
           
        var KpiFileExplorer = 
            <div className="col s12">
                { this.renderKpiViewer(this.state.economicTask, "economic", "ECONOMIC AND FINANCIAL") }
                { this.renderKpiViewer(this.state.socialTask, "social", "SOCIAL") }
                { this.renderKpiViewer(this.state.energyTask, "energy", "ENERGY AND ENVIRONMENTAL") }
                { this.renderKpiViewer(this.state.comfortTask, "comfort", "COMFORT") }
            </div>;

        return (
         <div className="section white white-text z-depth-1" style={{paddingTop:0}}>
             <div className= "row" style={{marginBottom:0}}>
                    <div className="col s12 center rezbuild">
                        <h6 className="white-text col s12" style={{marginBottom:'0.1rem'}}>
                            <b>{this.props.task.action}</b>
                        </h6>
                        <br/>
                        <h6 className="white-text col s12" style={{fontSize:'10px', marginTop:'0.1rem'}}>
                            {moment(this.props.task.date).format('LLL')}
                        </h6>
                    </div>
                     <div className="col s12 white grey-text">
                         <div className="col s6">
                         <h6>BIM MODEL</h6>
                         <ModelViewerComponent modelTask={this.state.modelTask} allowFullScreen={true}/>
                         <h6>ATTACHED FILE</h6>
                         <IndicatorExplorerComponent modelTask={this.state.modelTask}/>
                          <h6>KPI DATA</h6>
                         {KpiFileExplorer}
                        </div>
                        <div className="col s6">
                         <h6>KPI CHART</h6>
                        {
                            kpiScores.map((kpiScore, index) => 
                                <ParentSize key={index}>
                                {
                                    parent => (
                                        <div>
                                        {(kpiScore.data && kpiScore.data.length >0)?<h6 className="rezbuild-text col s12 center-align"  style={{padding:0}}>{kpiScore.category} SCORE</h6>:''}
                                        <RadarRechartComponent 
                                            // key={kpiScore.id + kpiScore.category}
                                            highlightedTask = {this.props.task} 
                                            data={kpiScore.data}
                                            parentTask={kpiScore.parentTask}
                                            parentWidth={parent.width}
                                            parentTop={parent.top}
                                            parentLeft={parent.left}
                                            parentRef={parent.ref}
                                            resizeParent={parent.resize}
                                        />
                                        </div>
                                    )
                                }
                                </ParentSize>
                                )
                        }
                        </div>
                     </div>
             </div>
         </div>
        );
    }
}

const FileExplorerComponent = props => (
    <SocketContext.Consumer>
    { (context) => <FileExplorerCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
    </SocketContext.Consumer>
  )
  export default FileExplorerComponent;
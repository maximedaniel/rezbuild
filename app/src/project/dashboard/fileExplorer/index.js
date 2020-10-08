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
var $ = window.$;


class FileExplorerCore extends Component {
    constructor(props){
        super(props)
        this.state = {

            modelTask : null,
            modelMode :false,
            environmentalTask : null,
            environmentalMode :false,
            economicTask :null,
            economicMode :false,
            socialTask : null,
            socialMode :false,
            energyTask : null,
            energyMode :false,
            comfortTask : null,
            comfortMode :false,
            error: false,
            pending: false
        };
        this.renderKPIsOfTask = this.renderKPIsOfTask.bind(this);
    }
    
   // Fetch the files of the tasks
    fetch() {
        if(this.props.task)this.setState(ComputeVersion.fetchRelevantTasks(this.props.task, this.props.tasks));
            
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

    render(){
       let KpiFileExplorer;
       let economicKpiViewer;
       let socialKpiViewer;
       let environmentalKpiViewer;
       let comfortKpiViewer;
       let energyKpiViewer;
       
       if(this.state.economicTask) economicKpiViewer = this.renderKPIsOfTask(this.state.economicTask);
       if(this.state.energyTask) energyKpiViewer = this.renderKPIsOfTask(this.state.energyTask);
       if(this.state.socialTask) socialKpiViewer = this.renderKPIsOfTask(this.state.socialTask);
       if(this.state.environmentalTask) environmentalKpiViewer = this.renderKPIsOfTask(this.state.environmentalTask);
       if(this.state.comfortTask) comfortKpiViewer = this.renderKPIsOfTask(this.state.comfortTask);

        var kpiScores = ComputeVersion.computeScoreOfRelevantTask(this.props.tasks, this.props.task);
           
        KpiFileExplorer = 
            <div className="col s12">
                {/*
                !(this.state.economicTask 
                || this.state.environmentalTask 
                || this.state.socialTask 
                || this.state.energyTask
                || this.state.comfortTask)?
                <i className="material-icons rezbuild-text center">block</i>: ''*/
                }
                {this.state.economicTask?
                    <div className='col s12'>
                    <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10" style={{padding:0}}>ECONOMIC AND FINANCIAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light" 
                    onClick={(e) => {e.preventDefault();this.setState({economicMode:!this.state.economicMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.economicMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.economicMode?economicKpiViewer: ''}
                </div> : ''}
                {this.state.environmentalTask?
                <div className='col s12'>
                <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10"  style={{padding:0}}>ENVIRONMENTAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light"
                    onClick={(e) => {e.preventDefault();this.setState({environmentalMode:!this.state.environmentalMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.environmentalMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.environmentalMode?environmentalKpiViewer: ''}
                </div>:''}

                {this.state.socialTask?
                <div className='col s12'>
                <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10"  style={{padding:0}}>SOCIAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light"
                    onClick={(e) => {e.preventDefault();this.setState({socialMode:!this.state.socialMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.socialMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.socialMode?socialKpiViewer: ''}
                </div>:''}

                {this.state.energyTask?
                <div className='col s12'>
                <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10"  style={{padding:0}}>ENERGY AND ENVIRONMENTAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light"
                    onClick={(e) => {e.preventDefault();this.setState({energyMode:!this.state.energyMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.energyMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.energyMode?energyKpiViewer: ''}
                </div>:''}

                {this.state.comfortTask?
                <div className='col s12'>
                <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10"  style={{padding:0}}>COMFORT</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light"
                    onClick={(e) => {e.preventDefault();this.setState({comfortMode:!this.state.comfortMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.comfortMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.comfortMode?comfortKpiViewer: ''}
                </div> : ''}
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
                                            key={kpiScore.id + kpiScore.category}
                                            highlightedTask = {this.props.task} 
                                            data={kpiScore.data}
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
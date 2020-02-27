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
var $ = window.$;


class FileExplorerCore extends Component {
    constructor(props){
        super(props)
        this.state = {

            modelTask : null,
            modelMode :false,
            environmentalTask : null,
            environmentalMode :false,
            economicalTask :null,
            economicalMode :false,
            socialTask : null,
            socialMode :false,
            energicalTask : null,
            energicalMode :false,
            comfortTask : null,
            comfortMode :false,
            error: false,
            pending: false
        };
        this.renderKPIsOfTask = this.renderKPIsOfTask.bind(this);
    }
    openFullscreen = (elem) => {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
      }
   // Fetch the files of the tasks
    fetchFiles() {
        if(this.props.task){
               this.setState(ComputeVersion.fetchRelevantTasks(this.props.task, this.props.tasks));
            }
    }
   /*componentWillMount(){
    window.scrollTo(0, 0);
   }*/

   componentDidMount(){
       this.fetchFiles()
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
        this.fetchFiles()
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
       let modelViewer;
       let modelFileExplorer;
       let KpiFileExplorer;
       let economicalKpiViewer;
       let socialKpiViewer;
       let environmentalKpiViewer;
       let comfortKpiViewer;
       let energicalKpiViewer;
       
       if(this.state.modelTask){
        modelViewer = <div>
                            {
                                this.state.modelTask.values.length ?
                                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                                    <iframe
                                    title="ASIS MODEL VIEWER"
                                    width="100%"
                                    height="100%"
                                    style={
                                        (this.state.modelMode)?
                                        {backgroundColor:'white', position:"fixed", top:0, left:0, bottom:0, right:0, width:'100%', height:'100%', border:'none', margin:0, padding:0, overflow:'hidden', zIndex:999998}
                                        :{backgroundColor:'white', position:"absolute", top:"10px", right:"10px"}
                                    }
                                    src={window.location.protocol + "//" + this.props.host + "/Rezbuild/Visualize/" + this.state.modelTask._id + "_" + this.state.modelTask.values[0].split('.ifc')[0]}
                                    frameBorder="0"
                                    allowFullScreen
                                    >
                                    </iframe>
                                    <a className="btn rezbuild right-align tooltipped" data-position="top" data-tooltip="Download"
                                     style={
                                        (this.state.modelMode)?
                                        {position:"fixed", top:"10px", right:"10px", zIndex:999999}
                                        :{position:"absolute", top:"10px", right:"10px"}
                                    }
                                    href={window.location.protocol + "//" + this.props.host + "/" + this.state.modelTask._id + "/" + this.state.modelTask.values[0]} >
                                    <i className=" material-icons white-text">cloud_download</i>
                                    </a>
                                    <button className="btn rezbuild right-align tooltipped" data-position="top" data-tooltip="Download"
                                    style={
                                        (this.state.modelMode)?
                                        {position:"fixed", bottom:"10px", right:"10px", zIndex:999999}
                                        :{position:"absolute", bottom:"10px", right:"10px"}
                                    }
                                    onClick={  (e) => {
                                        e.preventDefault();
                                        if(this.state.modelMode){
                                            $('html, body').css({
                                                overflow: 'auto',
                                                height: 'auto'
                                            });
                                        }else {
                                            $('html, body').css({
                                                overflow: 'hidden',
                                                height: '100%'
                                            });
                                        }
                                        this.setState({modelMode:!this.state.modelMode});

                                    }}
                                    >
                                    <i className=" material-icons white-text">{(this.state.modelMode)?'fullscreen_exit':'fullscreen'}</i>
                                    </button>
                                </div> : ""
                            }
                            </div>
        if(this.state.modelTask.files.length){
            modelFileExplorer = 
            <div>
                <h6>ATTACHED FILE</h6>
                <ul className="collection black-text">
                    {
                        this.state.modelTask.files.map((filename, index) => 
                                    <li className="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{filename} </p>
                                        <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                            href={window.location.protocol + "//" + this.props.host + "/" + this.state.modelTask._id + "/" + filename}>
                                        <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li>)
                    }
                </ul>
            </div>
        } 
       }
       if(this.state.economicalTask) economicalKpiViewer = this.renderKPIsOfTask(this.state.economicalTask);
       if(this.state.energicalTask) energicalKpiViewer = this.renderKPIsOfTask(this.state.energicalTask);
       if(this.state.socialTask) socialKpiViewer = this.renderKPIsOfTask(this.state.socialTask);
       if(this.state.environmentalTask) environmentalKpiViewer = this.renderKPIsOfTask(this.state.environmentalTask);
       if(this.state.comfortTask) comfortKpiViewer = this.renderKPIsOfTask(this.state.comfortTask);

        var {series, categories} = ComputeVersion.computeScoreOfRelevantTask(this.props.task, this.props.tasks);
        var data = categories.map( (category, index) => {
            let row = {}
            row['category'] = category;
            row[series[0].id] = series[0].data[index];
            return row;
        });
           
        KpiFileExplorer = 
            <div className="col s12">
                {/*
                !(this.state.economicalTask 
                || this.state.environmentalTask 
                || this.state.socialTask 
                || this.state.energicalTask
                || this.state.comfortTask)?
                <i className="material-icons rezbuild-text center">block</i>: ''*/
                }
                {this.state.economicalTask?
                    <div className='col s12'>
                    <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10" style={{padding:0}}>ECONOMICAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light" 
                    onClick={(e) => {e.preventDefault();this.setState({economicalMode:!this.state.economicalMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.economicalMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.economicalMode?economicalKpiViewer: ''}
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

                {this.state.energicalTask?
                <div className='col s12'>
                <div className='valign-wrapper col s12' style={{padding:0, paddingRight:'0.75rem', paddingBottom:'0.5rem'}}>
                    <h6 className="rezbuild-text left-align col s10"  style={{padding:0}}>ENERGICAL</h6>
                    <button className="btn-flat center col s2 waves-effect waves-light"
                    onClick={(e) => {e.preventDefault();this.setState({energicalMode:!this.state.energicalMode})}}
                    >
                    <i className="material-icons rezbuild-text">{this.state.energicalMode?"expand_less":"expand_more"}</i></button>
                    </div>
                     { this.state.energicalMode?energicalKpiViewer: ''}
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
                         <div className="col s4">
                         <h6>BIM MODEL</h6>
                         {modelViewer}
                         {modelFileExplorer}
                         </div>
                         {/*<div className="col s4">
                         <h6>KPI SCORE</h6>
                         <ParentSize>
                            {
                                parent => (
                                    <RadarRechartComponent 
                                        key={this.props.task._id}
                                        highlightedTask = {this.props.task} 
                                        categories={categories} 
                                        series={series} 
                                        data={data} 
                                        parentWidth={parent.width}
                                        parentTop={parent.top}
                                        parentLeft={parent.left}
                                        parentRef={parent.ref}
                                        resizeParent={parent.resize}
                                    />
                                )
                            }
                            </ParentSize>
                        </div>*/}
                         <div className="col s4">
                         <h6>KPI DATA</h6>
                         {KpiFileExplorer}
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
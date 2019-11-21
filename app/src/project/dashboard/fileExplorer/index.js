import React, { Component } from 'react';
import SocketContext from '../../../SocketContext';

var $ = window.$;


class FileExplorerCore extends Component {

    constructor(props){
        super(props)
        this.state = {error: false, pending: false}
    }

    fetchFiles() {
        this.setState({asisTask: null, tobeTask: null, kpiTask: null, error: false, pending: true}, () => {
            if(this.props.task){
                var getLastParentTaskWithAction = (taskId, action) => {
                    var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                    if(currTask.action.includes(action) && currTask.lane !=='lane_todo') return currTask // && currTask.lane !=='lane_todo'
                    return currTask.prev.map((prevTaskId) => getLastParentTaskWithAction(prevTaskId, action))[0]
                }
                /*var getLastChildrenTaskWithAction = (taskId, action) => {
                    var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                    if(currTask.action.includes(action)) return currTask
                    return currTask.next.map((nextTaskId) => getLastChildrenTaskWithAction(nextTaskId, action))[0]
                }*/
                this.setState({
                asisModelTask :getLastParentTaskWithAction(this.props.task._id, 'MODEL_ASIS'),
                asisEnvironmentalTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_ENVIRONMENTAL_ASIS'),
                asisEconomicalTask :getLastParentTaskWithAction(this.props.task._id, 'KPI_ECONOMICAL_ASIS'),
                asisSocialTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_SOCIAL_ASIS'),
                asisEnergicalTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_ENERGICAL_ASIS'),
                asisComfortTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_COMFORT_ASIS'),
                tobeModelTask : getLastParentTaskWithAction(this.props.task._id, 'MODEL_TOBE'),
                tobeEconomicalTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_ECONOMICAL_TOBE'),
                tobeEnvironmentalTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_ENVIRONMENTAL_TOBE'),
                tobeSocialTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_SOCIAL_TOBE'),
                tobeEnergicalTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_ENERGICAL_TOBE'),
                tobeComfortTask : getLastParentTaskWithAction(this.props.task._id, 'KPI_COMFORT_TOBE'),
                error: false, pending: false})
            }
        })
    }
   
   componentDidMount(){
       this.fetchFiles()
       $(document).ready(function(){
         $('ul.tabs').tabs();
         $('.tooltipped').tooltip({delay:0, html:true});
       });

   }

    componentWillUnmount(){
    $('.tooltipped').tooltip('remove');
    }

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.task !== this.props.task){
       this.fetchFiles()
       $('ul.tabs').tabs();
       $('.tooltipped').tooltip({delay:0, html:true});
     }
    }
 

    render(){
       let asisModelViewer;
       let asisModelFileExplorer;
       let asisEconomicalKpiViewer;
       let asisSocialKpiViewer;
       let asisEnvironmentalKpiViewer;
       let asisComfortKpiViewer;
       let asisEnergicalKpiViewer;
       let tobeModelViewer;
       let tobeModelFileExplorer;
       let tobeEconomicalKpiViewer;
       let tobeSocialKpiViewer;
       let tobeEnvironmentalKpiViewer;
       let tobeComfortKpiViewer;
       let tobeEnergicalKpiViewer;
       
       if(this.state.asisModelTask){
        asisModelViewer = <div>
                            <h6>MODEL</h6>
                            {
                                this.state.asisModelTask.values.length ?
                                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                                    <iframe
                                    title="ASIS MODEL VIEWER"
                                    width="100%"
                                    height="100%"
                                    src={"https://" + this.props.host + "/Rezbuild/Visualize/" + this.state.asisModelTask._id + "_" + this.state.asisModelTask.values[0].split('.ifc')[0]}
                                    frameBorder="0"
                                    allowFullScreen
                                    >
                                    </iframe>
                                    <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    
                                    href={"http://" + this.props.host + "/" + this.state.asisModelTask._id + "/" + this.state.asisModelTask.values[0]} >
                                    <i className="material-icons white-text">cloud_download</i>
                                    </a>
                                </div> : ""
                            }
                            </div>
        asisModelFileExplorer = 
            <div>
                <h6>ATTACHED FILE</h6>
                <ul className="collection black-text">
                    { this.state.asisModelTask.files.length ?
                        this.state.asisModelTask.files.map((filename, index) => 
                                    <li className="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{filename} </p>
                                        <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                            href={"http://" + this.props.host + "/" + this.state.asisModelTask._id + "/" + filename}>
                                        <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li>
                        ) : ""
                    }
                </ul>
            </div>

       }
       if(this.state.asisEconomicalTask){
        asisEconomicalKpiViewer = 
        <div>
        <h6>ECONOMICAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.asisEconomicalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.asisEconomicalTask.values[index]}</td>
                                <td>{this.state.asisEconomicalTask.formats[index]}</td>
                                <td>
                                    { this.state.asisEconomicalTask.files[index] !== "" ? 
                                    <li className="collection-item valign-wrapper" value={this.state.asisEconomicalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.asisEconomicalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                        href={"http://" + this.props.host + "/" + this.state.asisEconomicalTask._id + "/" + this.state.asisEconomicalTask.files[index]}>
                                        <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }
       if(this.state.asisEnergicalTask){
        asisEnergicalKpiViewer = 
        <div>
        <h6>ENERGICAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.asisEnergicalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.asisEnergicalTask.values[index]}</td>
                                <td>{this.state.asisEnergicalTask.formats[index]}</td>
                                <td>
                                    { this.state.asisEnergicalTask.files[index] !== "" ? 
                                    <li className="collection-item valign-wrapper" value={this.state.asisEnergicalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.asisEnergicalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.asisEnergicalTask._id + "/" + this.state.asisEnergicalTask.files[index]}>
                                        <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
            </div>
       }
       if(this.state.asisSocialTask){
        asisSocialKpiViewer = 
        <div>
        <h6>SOCIAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.asisSocialTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.asisSocialTask.values[index]}</td>
                                <td>{this.state.asisSocialTask.formats[index]}</td>
                                <td>
                                    { this.state.asisSocialTask.files[index] !== "" ? 
                                    <li className="collection-item valign-wrapper" value={this.state.asisSocialTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.asisSocialTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.asisSocialTask._id + "/" + this.state.asisSocialTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
            </div>
       }
       if(this.state.asisEnvironmentalTask){
        asisEnvironmentalKpiViewer = 
        <div>
        <h6>ENVIRONMENTAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.asisEnvironmentalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.asisEnvironmentalTask.values[index]}</td>
                                <td>{this.state.asisEnvironmentalTask.formats[index]}</td>
                                <td>
                                    { this.state.asisEnvironmentalTask.files[index] !== "" ? 
                                    <li className="collection-item valign-wrapper" value={this.state.asisEnvironmentalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.asisEnvironmentalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.asisEnvironmentalTask._id + "/" + this.state.asisEnvironmentalTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }
       
       if(this.state.asisComfortTask){
        asisComfortKpiViewer = 
        <div>
        <h6>COMFORT KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.asisComfortTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.asisComfortTask.values[index]}</td>
                                <td>{this.state.asisComfortTask.formats[index]}</td>
                                <td>
                                    { this.state.asisComfortTask.files[index] !== "" ?  <li className="collection-item valign-wrapper" value={this.state.asisComfortTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.asisComfortTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                        href={"http://" + this.props.host + "/" + this.state.asisComfortTask._id + "/" + this.state.asisComfortTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }




       if(this.state.tobeModelTask){
        tobeModelViewer = <div>
                            <h6>MODEL</h6>
                            {
                                this.state.tobeModelTask.values.length ?
                                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                                    <iframe
                                    title="TOBE MODEL VIEWER"
                                    width="100%"
                                    height="100%"
                                    src={"https://" + this.props.host + "/Rezbuild/Visualize/" + this.state.asisModelTask._id + "_" + this.state.asisModelTask.values[0].split('.ifc')[0]}
                                    frameBorder="0"
                                    allowFullScreen
                                    >
                                    </iframe>
                                    <a className="btn rezbuild col s2 right-align"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    href={"http://" + this.props.host + "/" + this.state.tobeModelTask._id + "/" + this.state.tobeModelTask.values[0]} >
                                        <i className="material-icons white-text">cloud_download</i>
                                    </a>
                                </div> : ""
                            }
                            </div>
        tobeModelFileExplorer = 
        <div>
            <h6>ATTACHED FILE</h6>
            <ul className="collection black-text">
                { this.state.tobeModelTask.files.length ?
                    this.state.tobeModelTask.files.map((filename, index) => 
                                <li className="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                    <p className="col s10">{filename} </p>
                                    <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                    href={"http://" + this.props.host + "/" + this.state.tobeModelTask._id + "/" + filename}>
                                        <i className="material-icons white-text">cloud_download</i>
                                    </a>
                                </li>
                    ) : ""
                }
            </ul>
        </div>

       }
       if(this.state.tobeEconomicalTask){
        tobeEconomicalKpiViewer = 
        <div>
        <h6>ECONOMICAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.tobeEconomicalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.tobeEconomicalTask.values[index]}</td>
                                <td>{this.state.tobeEconomicalTask.formats[index]}</td>
                                <td>
                                    { this.state.tobeEconomicalTask.files[index] !== "" ? <li className="collection-item valign-wrapper" value={this.state.tobeEconomicalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.tobeEconomicalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.tobeEconomicalTask._id + "/" + this.state.tobeEconomicalTask.files[index]}>
                                                <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : '' }
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }
       if(this.state.tobeEnergicalTask){
        tobeEnergicalKpiViewer = 
        <div>
        <h6>ENERGICAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.tobeEnergicalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.tobeEnergicalTask.values[index]}</td>
                                <td>{this.state.tobeEnergicalTask.formats[index]}</td>
                                <td>
                                    
                                    { this.state.tobeEnergicalTask.files[index] !== "" ? <li className="collection-item valign-wrapper" value={this.state.tobeEnergicalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.tobeEnergicalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.tobeEnergicalTask._id + "/" + this.state.tobeEnergicalTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }
       if(this.state.tobeSocialTask){
        tobeSocialKpiViewer = 
        <div>
        <h6>SOCIAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.tobeSocialTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.tobeSocialTask.values[index]}</td>
                                <td>{this.state.tobeSocialTask.formats[index]}</td>
                                <td>
                                    { this.state.tobeSocialTask.files[index] !== "" ?  <li className="collection-item valign-wrapper" value={this.state.tobeSocialTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.tobeSocialTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                        href={"http://" + this.props.host + "/" + this.state.tobeSocialTask._id + "/" + this.state.tobeSocialTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
        </div>
       }
       if(this.state.tobeEnvironmentalTask){
        tobeEnvironmentalKpiViewer = 
            <div>
            <h6>ENVIRONMENTAL KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.tobeEnvironmentalTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.tobeEnvironmentalTask.values[index]}</td>
                                <td>{this.state.tobeEnvironmentalTask.formats[index]}</td>
                                <td>
                                    { this.state.tobeEnvironmentalTask.files[index] !== "" ? <li className="collection-item valign-wrapper" value={this.state.tobeEnvironmentalTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.tobeEnvironmentalTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                        href={"http://" + this.props.host + "/" + this.state.tobeEnvironmentalTask._id + "/" + this.state.tobeEnvironmentalTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
            </div>
       }
       
       if(this.state.tobeComfortTask){
        tobeComfortKpiViewer = 
            <div>
            <h6>COMFORT KPIs</h6>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Format</th>
                    <th>File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        this.state.tobeComfortTask.names.map((name, index) => 
                            <tr>
                                <td>{name}</td>
                                <td>{this.state.tobeComfortTask.values[index]}</td>
                                <td>{this.state.tobeComfortTask.formats[index]}</td>
                                <td>
                                    {  this.state.tobeComfortTask.files[index] !== "" ? <li className="collection-item valign-wrapper" value={this.state.tobeComfortTask.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        <p className="col s10">{this.state.tobeComfortTask.files[index]} </p>
                                        <a className="btn rezbuild col s2 right-align  tooltipped" data-position="top" data-tooltip="Download"
                                         href={"http://" + this.props.host + "/" + this.state.tobeComfortTask._id + "/" + this.state.tobeComfortTask.files[index]}>
                                            <i className="material-icons white-text">cloud_download</i>
                                        </a>
                                    </li> : ''}
                                </td>
                            </tr>
                        )
                  }
              </tbody>
            </table>
            </div>
       }       
        /*var sectionStyle = {
            borderRadius: '3px',
            margin: '5px 5px',
            padding:'10px', 
            backgroundColor:  'rgba(247,147,30,.5)'
        }*/
        /*var titleStyle = {
            textShadow:"-2px -2px 2px #f7931e, 2px -2px 2px #f7931e,  -2px 2px 2px #f7931e, 2px 2px 2px #f7931e"
            color: '#000'
        }*/
        
        return (
         <div>
            <div className="section white white-text z-depth-1" style={{paddingTop:0}}>
                <div className= "row" style={{marginBottom:0}}>
                        <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s5"><a href="#asis">ASIS</a></li>
                            <li className="tab col s5"><a href="#tobe">TOBE</a></li>
                        </ul>
                        </div>
                        <div id="asis" className="col s12 grey-text">
                            {asisModelViewer}
                            {asisModelFileExplorer}
                            {asisEconomicalKpiViewer}
                            {asisEnergicalKpiViewer}
                            {asisSocialKpiViewer}
                            {asisEnvironmentalKpiViewer}
                            {asisComfortKpiViewer}
                        </div>
                        <div id="tobe" className="col s12 grey-text">
                            {tobeModelViewer}
                            {tobeModelFileExplorer}
                            {tobeEconomicalKpiViewer}
                            {tobeEnergicalKpiViewer}
                            {tobeSocialKpiViewer}
                            {tobeEnvironmentalKpiViewer}
                            {tobeComfortKpiViewer}
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
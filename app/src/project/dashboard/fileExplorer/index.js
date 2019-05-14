import React, { Component } from 'react';
/*import SocketContext from './SocketContext'
import common from 'common'
import FileBrowser, {Icons}  from 'react-keyed-file-browser';
import { throws } from 'assert';*/
import SocketContext from '../../../SocketContext'
import common from 'common'
var $ = window.$


class FileExplorerCore extends Component {

    constructor(props){
        super(props)
        var attributes = [...new Set(Object.keys(common.ACTIONS).map(key =>  {var arg = key.split('_'); arg.shift(); return arg.join('_') }))]
        this.state = {attributes: attributes, error: false, pending: false}
    }

    fetchFiles() {
        this.setState({asisTask: null, tobeTask: null, kpiTask: null, error: false, pending: true}, () => {
            if(this.props.task){
                var getLastAsisTask = (taskId) => {
                    var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                    if(currTask.action.includes('ASIS')) return currTask
                    return currTask.prev.map((prevTaskId) => getLastAsisTask(prevTaskId))[0]
                }
    
                var getLastTobeTask = (taskId) => {
                    var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                    if(currTask.action.includes('TOBE')) return currTask
                    return currTask.prev.map((prevTaskId) => getLastTobeTask(prevTaskId))[0]
                }
    
                var getLastKpiTask = (taskId) => {
                  var currTask = this.props.tasks.filter((task) => task._id === taskId)[0];
                  if(currTask.action.includes('KPI')) return currTask
                  return currTask.prev.map((prevTaskId) => getLastKpiTask(prevTaskId))[0]
                }
    
                this.setState({
                    asisTask: getLastAsisTask(this.props.task._id),
                    tobeTask: getLastTobeTask(this.props.task._id),
                    kpiTask:  getLastKpiTask(this.props.task._id),
                    error: false, pending: false})
            }
        })
    }
   
   componentDidMount(){
       this.fetchFiles()
   }

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.task !== this.props.task){
       this.fetchFiles()
     }
    }
 

    render(){
       let asisModelViewer;
       let asisFileExplorer;
       let tobeModelViewer;
       let tobeFileExplorer;
       let kpiValueViewer;
       let kpiFileExplorer;
       
       if(this.state.asisTask){
        asisModelViewer = <div>
                            {
                                this.state.asisTask.files ?
                                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                                    <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/suNadRnHy-U"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    >é
                                    </iframe>
                                    <a className="btn rezbuild col s2 right-align"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    href={"http://" + this.props.host + "/" + this.state.asisTask._id + "/" + this.state.asisTask.value} >
                                    <i className="material-icons white-text">cloud_download</i>
                                    </a>
                                </div> : ""
                            }
                            </div>
        asisFileExplorer = <ul class="collection black-text">
                                { this.state.asisTask.files ?
                                    this.state.asisTask.files.map((filename, index) => {
                                        
                                                return <li class="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                                    <p className="col s10">{filename} </p>
                                                    <a className="btn rezbuild col s2 right-align" href={"http://" + this.props.host + "/" + this.state.asisTask._id + "/" + filename}>
                                                        <i className="material-icons white-text">cloud_download</i>
                                                    </a>
                                                </li>
                                    }) : ""
                                }
                            </ul>

       }
       if(this.state.tobeTask){
        tobeModelViewer = <div>
                            {
                                this.state.tobeTask.files ?
                                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                                    <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/suNadRnHy-U"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    >é
                                    </iframe>
                                    <a className="btn rezbuild col s2 right-align"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    href={"http://" + this.props.host + "/" + this.state.tobeTask._id + "/" + this.state.tobeTask.value} >
                                    <i className="material-icons white-text">cloud_download</i>
                                    </a>
                                </div> : ""
                            }
                            </div>
        tobeFileExplorer = <ul class="collection black-text">
                                { this.state.tobeTask.files ?
                                    this.state.tobeTask.files.map((filename, index) => {
                                        
                                                return <li class="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                                    <p className="col s10">{filename} </p>
                                                    <a className="btn rezbuild col s2 right-align" href={"http://" + this.props.host + "/" + this.state.tobeTask._id + "/" + filename}>
                                                        <i className="material-icons white-text">cloud_download</i>
                                                    </a>
                                                </li>
                                    }) : ""
                                }
                            </ul>

        }
        if(this.state.kpiTask){
        kpiFileExplorer = <ul class="collection black-text">
                                { this.state.kpiTask.files ?
                                    this.state.kpiTask.files.map((filename, index) => {
                                        
                                                return <li class="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                                    <p className="col s10">{filename} </p>
                                                    <a className="btn rezbuild col s2 right-align" href={"http://" + this.props.host + "/" + this.state.kpiTask._id + "/" + filename}>
                                                        <i className="material-icons white-text">cloud_download</i>
                                                    </a>
                                                </li>
                                    }) : ""
                                }
                            </ul>

        }
        var sectionStyle = {
            borderRadius: '3px',
            margin: '5px 5px',
            padding:'10px', 
            backgroundColor:  'rgba(247,147,30,.5)'
        }
        var titleStyle = {
            textShadow:"-2px -2px 2px #f7931e, 2px -2px 2px #f7931e,  -2px 2px 2px #f7931e, 2px 2px 2px #f7931e"
        }
        return (
         <div>
            <div className="section  white-text" style={sectionStyle}>
                <div className= "row" style={{marginBottom:0}}>
                    <h6 style={titleStyle}><b>ASIS MODEL & FILES</b></h6>
                    {asisModelViewer}
                    {asisFileExplorer}

                </div>
            </div>

            <div className="section  white-text" style={sectionStyle}>
                <div className= "row" style={{marginBottom:0}}>
                    <h6 style={titleStyle}><b>TOBE MODEL & FILES</b></h6>
                    {tobeModelViewer}
                    {tobeFileExplorer}
                </div>
            </div>
            <div className="section  white-text" style={sectionStyle}>
                <div className= "row" style={{marginBottom:0}}>
                    <h6 style={titleStyle}><b>KPI & FILES</b></h6>
                    {kpiValueViewer}
                    {kpiFileExplorer}
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
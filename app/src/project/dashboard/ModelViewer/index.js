/**
 * @class FileExplorer
 * @extends Component
 * @description Create the file explorer part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
var $ = window.$;



class ModelViewerCore extends Component {
    constructor(props){
        super(props)
        this.state = {modelMode :false};
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

   componentDidMount(){
       $(document).ready(() => {
         $('.tooltipped').tooltip({delay:0, html:true});
       });
    }

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.modelTask !== this.props.modelTask){
         $('.tooltipped').tooltip({delay:0, html:true});
     }
    }

    componentWillUnmount(){
        $('.tooltipped').tooltip('remove');
    }

    render(){
        return (
            <div>
            {
                (this.props.modelTask && this.props.modelTask.values.length &&  this.props.modelTask.values[0] !== "")?
                <div style={{width:"auto", height:'315px', position: 'relative'}}>
                    <iframe
                    title="ASIS MODEL VIEWER"
                    width="100%"
                    height="100%"
                    style={
                        this.state.modelMode ?
                        {backgroundColor:'white', position:"fixed", top:0, left:0, bottom:0, right:0, width:'100%', height:'100%', border:'none', margin:0, padding:0, overflow:'hidden', zIndex:9999}
                        :{backgroundColor:'white', position:"absolute", top:0, right:0, zIndex:"inherit"}
                    }
                    src={window.location.protocol + "//" + this.props.host + "/Rezbuild/Visualize/" + this.props.modelTask._id + "_" + this.props.modelTask.values[0].split('.ifc')[0]}
                    frameBorder="0"
                    allowFullScreen
                    >
                    </iframe>
                    <a className="btn rezbuild right-align tooltipped" data-position="left" data-tooltip="Download"
                     style={
                        this.state.modelMode ?
                        {position:"fixed", top:"10px", right:"10px", zIndex:9999}
                        :{position:"absolute", top:"10px", right:"10px", zIndex:"inherit"}
                    }
                    href={window.location.protocol + "//" + this.props.host + "/" + this.props.modelTask._id + "/" + this.props.modelTask.values[0]} >
                    <i className=" material-icons white-text">cloud_download</i>
                    </a>
                    
                    { this.props.allowFullScreen ?
                        <button className="btn rezbuild right-align tooltipped" data-position="left" data-tooltip={(this.state.modelMode)?'Normalscreen':'Fullscreen'}
                            style={
                                (this.state.modelMode)?
                                {position:"fixed", bottom:"10px", right:"10px", zIndex:9999}
                                :{position:"absolute", bottom:"10px", right:"10px", zIndex:"inherit"}
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
                            }
                        }
                        >
                    <i className=" material-icons white-text">{(this.state.modelMode)?'fullscreen_exit':'fullscreen'}</i>
                    </button> : ''
                    }
                </div> : ""
            }
            </div>
        );
    }
}

const ModelViewerComponent = props => (
    <SocketContext.Consumer>
    { (context) => <ModelViewerCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
    </SocketContext.Consumer>
  )
  export default ModelViewerComponent;
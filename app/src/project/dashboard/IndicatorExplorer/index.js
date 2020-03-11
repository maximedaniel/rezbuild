/**
 * @class FileExplorer
 * @extends Component
 * @description Create the file explorer part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
var $ = window.$;


class IndicatorExplorerCore extends Component {
    
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
                (this.props.modelTask && this.props.modelTask.files.length &&  this.props.modelTask.files[0] !== "")?
                        <ul className="collection black-text">
                            {
                                this.props.modelTask.files.map((filename, index) => 
                                            <li className="collection-item row valign-wrapper" value={filename} key={index} style={{padding: '0px 10px'}}>
                                                <p className="col s10">{filename} </p>
                                                <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                                    href={window.location.protocol + "//" + this.props.host + "/" + this.props.modelTask._id + "/" + filename}>
                                                <i className="material-icons white-text">cloud_download</i>
                                                </a>
                                            </li>)
                            }
                        </ul>
                    : ''
            }
            </div>
        );
    }
}

const IndicatorExplorerComponent = props => (
    <SocketContext.Consumer>
    { (context) => <IndicatorExplorerCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
    </SocketContext.Consumer>
  )
  export default IndicatorExplorerComponent;
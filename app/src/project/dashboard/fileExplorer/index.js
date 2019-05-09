import React, { Component } from 'react';
/*import SocketContext from './SocketContext'
import common from 'common'
import FileBrowser, {Icons}  from 'react-keyed-file-browser';
import { throws } from 'assert';*/
var $ = window.$



class FileExplorerComponent extends Component {

    constructor(props){
        super(props)
        /*this.state = {error:false, pending:false,
            files: [
            {
              key: 'photos/animals/cat in a hat.png',
              //modified: +Moment().subtract(1, 'hours'),
              size: 1.5 * 1024 * 1024,
            },
            {
              key: 'photos/animals/kitten_ball.png',
              //modified: +Moment().subtract(3, 'days'),
              size: 545 * 1024,
            },
            {
              key: 'photos/animals/elephants.png',
              //modified: +Moment().subtract(3, 'days'),
              size: 52 * 1024,
            },
            {
              key: 'photos/funny fall.gif',
              //modified: +Moment().subtract(2, 'months'),
              size: 13.2 * 1024 * 1024,
            },
            {
              key: 'photos/holiday.jpg',
              //modified: +Moment().subtract(25, 'days'),
              size: 85 * 1024,
            },
            {
              key: 'documents/letter chunks.doc',
              //modified: +Moment().subtract(15, 'days'),
              size: 480 * 1024,
            },
            {
              key: 'documents/export.pdf',
              //modified: +Moment().subtract(15, 'days'),
              size: 4.2 * 1024 * 1024,
            },
          ],}*/
    }

    componentDidMount() {

   }

    render(){
        /*
       var FileList  =  <ul class="collection">
                            { (this.props.revision)?
                                common.ACTIONS.map((action, index) => {
                                    if(Array.isArray(action.type)){
                                        return (
                                            <li class="collection-item row valign-wrapper" value={action.name} key={index} style={{padding: '0px 10px'}}>
                                                <p className="col s8">{action.name} </p>
                                                <a className={"btn rezbuild col s4 right-align" + (this.props.revision[action.name].length ? "" : " disabled")}>
                                                    <i className="material-icons white-text">cloud_download</i>
                                                </a>
                                            </li>
                                        )
                                    }
                                    if(action.type.name === 'String'){
                                        return (
                                            <li class="collection-item row valign-wrapper" value={action.name} key={index} style={{padding: '0px 10px'}}>
                                                <p className="col s8">{action.name} </p>
                                                <a className={"btn rezbuild col s4 right-align" + (this.props.revision[action.name] ? "" : " disabled")}>
                                                    <i className="material-icons white-text">cloud_download</i>
                                                </a>
                                            </li>
                                        )
                                    }
                                    if(action.type.name === 'Number'){
                                        return (
                                            <li class="collection-item row valign-wrapper" value={action.name} key={index} style={{padding: '0px 10px'}}>
                                                <p className="col s4">{action.name}</p>
                                                <p className="col s8 right-align">
                                                    {this.props.revision[action.name]} {action.format} 
                                                </p>
                                            </li>
                                        )
                                    }
                                }) : ''
                            }
                        </ul>
                        */
        return (
         <div>
            {/*FileList*/}
          </div>
        );
    }
}

export default FileExplorerComponent;
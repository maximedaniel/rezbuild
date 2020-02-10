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
            environmentalTask : null,
            economicalTask :null,
            socialTask : null,
            energicalTask : null,
            comfortTask : null,
            error: false,
            pending: false
        };
        this.renderKPIsOfTask = this.renderKPIsOfTask.bind(this);
    }

    fetchFiles() {
        if(this.props.task){
               this.setState(ComputeVersion.fetchRelevantTasks(this.props.task, this.props.tasks));
            }
    }
   componentWillMount(){
    window.scrollTo(0, 0);
   }

   componentDidMount(){
       this.fetchFiles()
       $(document).ready(function(){
        $('.collapsible').collapsible();
         $('.tooltipped').tooltip({delay:0, html:true});
         window.scrollTo(0, 0);
       });
    }

    componentWillUpdate(){
        window.scrollTo(0, 0);
    }

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.task !== this.props.task){
        this.fetchFiles()
        $('.collapsible').collapsible();
         $('.tooltipped').tooltip({delay:0, html:true});
     }
    }

    componentWillUnmount(){
        $('.tooltipped').tooltip('remove');
    }

    renderKPIsOfTask(task){
        return (
            <div>
            <table className="col s12 white center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th className="col s5">Name</th>
                    <th className="col s3">Value</th>
                    <th className="col s4">File</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                  {
                        task.names.map((name, index) => 
                            <tr key={index}>
                                <td className="col s5" style={{paddingTop:'1rem'}}>{name}</td>
                                <td className="col s3" style={{paddingTop:'1rem'}}>{task.values[index] + ' ' + task.formats[index]}</td>
                                <td className="col s4" style={{paddingTop:'1rem'}}>
                                    {task.files[index] !== "" ? 
                                    <li className="collection-item valign-wrapper col s12" value={task.files[index]} key={index} style={{padding: '0px 10px'}}>
                                        {/*<p className="col s10">{this.state.energicalTask.files[index]} </p>*/}
                                        <a className="btn rezbuild col s12 right-align tooltipped" data-position="top" data-tooltip="Download"
                                        href={window.location.protocol + "//" + this.props.host + "/" + task._id + "/" + task.files[index]}>
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
                                    src={window.location.protocol + "//" + this.props.host + "/Rezbuild/Visualize/" + this.state.modelTask._id + "_" + this.state.modelTask.values[0].split('.ifc')[0]}
                                    frameBorder="0"
                                    allowFullScreen
                                    >
                                    </iframe>
                                    <a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    
                                    href={window.location.protocol + "//" + this.props.host + "/" + this.state.modelTask._id + "/" + this.state.modelTask.values[0]} >
                                    <i className="material-icons white-text">cloud_download</i>
                                    </a>
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
                <ul className="collapsible" datacollapsible="accordion">
                    {economicalKpiViewer? <li>
                        <div className="collapsible-header rezbuild-text"><i className="material-icons rezbuild-text">whatshot</i>ECONOMICAL</div>
                        <div className="collapsible-body"><span>{economicalKpiViewer}</span></div>
                    </li> : ''}
                    {environmentalKpiViewer? <li>
                        <div className="collapsible-header rezbuild-text"><i className="material-icons rezbuild-text">whatshot</i>ENVIRONMENTAL</div>
                        <div className="collapsible-body"><span>{environmentalKpiViewer}</span></div>
                     </li> : ''}
                    {socialKpiViewer? <li>
                        <div className="collapsible-header rezbuild-text"><i className="material-icons rezbuild-text">whatshot</i>SOCIAL</div>
                        <div className="collapsible-body"><span>{socialKpiViewer}</span></div>
                    </li> : ''}
                    {energicalKpiViewer? <li>
                        <div className="collapsible-header rezbuild-text"><i className="material-icons rezbuild-text">whatshot</i>ENERGICAL</div>
                        <div className="collapsible-body"><span>{energicalKpiViewer}</span></div>
                    </li> : ''}
                    {comfortKpiViewer? <li>
                        <div className="collapsible-header rezbuild-text"><i className="material-icons rezbuild-text">whatshot</i>COMFORT</div>
                        <div className="collapsible-body"><span>{comfortKpiViewer}</span></div>
                    </li> : ''}
                </ul>
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
                         <div className="col s4">
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
                         </div>
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
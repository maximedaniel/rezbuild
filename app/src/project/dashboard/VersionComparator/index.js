    
/**
 * @class VersionComparator
 * @extends Component
 * @description Create the version comparator tool part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'
import ComputeVersion from '../ComputeVersion'
import { ParentSize } from '@vx/responsive'
import moment from 'moment'
import RadarRechartComponent from '../RadarRechart'
import ModelViewerComponent from '../ModelViewer'
var $ = window.$;

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
$.fn.attrchange = function(callback) {
    if (MutationObserver) {
        var options = {
            subtree: false,
            attributes: true
        };

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(e) {
                callback.call(e.target, e.attributeName);
            });
        });

        return this.each(function() {
            observer.observe(this, options);
        });

    }
}

class VersionComparatorCore extends Component {
    constructor(props){
        super(props);

        this.state = {
            highlightedTask: null,
            data: [],
            categories: [],
            series: [],
            error: false,
            pending: false};

        this.compareVersions = this.compareVersions.bind(this);
        this.highlightTask = this.highlightTask.bind(this);
    }

    
    highlightTask(task){
        this.setState({highlightedTask: task});

    }

    compareVersions() {
        if(this.props.tasks 
            && this.props.tasks.length > 0 
            && this.props.selectedTasks 
            && this.props.selectedTasks.length > 0){
            this.setState({
                data: ComputeVersion.computeScoreOfRelevantTask(this.props.tasks, ...this.props.selectedTasks)
            });
        }
    }

   componentWillMount(){
    window.scrollTo(0, 0);
   }

   componentDidMount(){
        this.compareVersions();
        $('#carousel-version-comparator').carousel({noWrap:true});
        $('.carousel-item').attrchange((attrName) => {
            if(attrName === 'class'){
                    let ans = $('.carousel-item.active');
                    if(ans!==null && ans.length > 0){
                        let taskToHighlight = this.props.selectedTasks.filter(selectedTask => "carousel-item-"+selectedTask._id === ans[0].id);
                        if(taskToHighlight.length > 0) this.highlightTask(taskToHighlight[0]);
                    }
            }
        });

        $('.carousel-item').click((e) => {
            let taskToHighlight = this.props.selectedTasks.filter(selectedTask => "carousel-item-"+selectedTask._id === e.currentTarget.id);
            if(taskToHighlight.length > 0) this.highlightTask(taskToHighlight[0]);
        });
        $('#carousel-item-'+this.props.selectedTasks[this.props.selectedTasks.length-1]._id).click();
        $('#carousel-version-comparator').carousel('set', this.props.selectedTasks.length-1);
   }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedTasks.length !== this.props.selectedTasks.length){
            this.compareVersions();
            $('#carousel-version-comparator').carousel({noWrap:true});
            $('.carousel-item').attrchange((attrName) => {
                if(attrName === 'class'){
                        let ans = $('.carousel-item.active');
                        if(ans!==null && ans.length > 0){
                            let taskToHighlight = this.props.selectedTasks.filter(selectedTask => "carousel-item-"+selectedTask._id === ans[0].id);
                            if(taskToHighlight.length > 0) this.highlightTask(taskToHighlight[0]);
                        }
                }
            });

            $('.carousel-item').click((e) => {
            let taskToHighlight = this.props.selectedTasks.filter(selectedTask => "carousel-item-"+selectedTask._id === e.currentTarget.id);
            if(taskToHighlight.length > 0) this.highlightTask(taskToHighlight[0]);
            });
            $('#carousel-item-'+this.props.selectedTasks[this.props.selectedTasks.length-1]._id).click();
            $('#carousel-version-comparator').carousel('set', this.props.selectedTasks.length-1);
        }
    }

    render(){
        return (
         <div className="section transparent white-text" style={{paddingTop:0}}>
             <div className= "row" style={{marginBottom:0}}>
                        <div className="carousel col s7 transparent grey-text" id="carousel-version-comparator" key={'carousel-'+this.props.selectedTasks.length}>
                            {
                                this.props.selectedTasks.map(selectedTask => 
                                    <a className="carousel-item z-depth-1 white" id={'carousel-item-'+selectedTask._id} key={'carousel-item-'+selectedTask._id} ref={'carousel-item-'+selectedTask._id} href={'#carousel-item-'+selectedTask._id}>
                                        <div className="row">
                                            <div className="col s12 center rezbuild">
                                                <h6 className="white-text col s12" style={{marginBottom:'0.1rem'}}>
                                                    <b>{selectedTask.action}</b>
                                                </h6>
                                                <br/>
                                                <h6 className="white-text col s12" style={{fontSize:'10px', marginTop:'0.1rem'}}>
                                                    {moment(selectedTask.date).format('LLL')}
                                                </h6>
                                            </div>
                                            <div className='col s12 center white'>
                                                <ModelViewerComponent modelTask={selectedTask} allowFullScreen={false}/>
                                            </div>
                                        </div>

                                    </a>
                                )
                            }
                     </div>
                     <div className="col s5 transparent grey-text">
                         <div className='col s10 white push-s1 z-depth-1' > {/*style={{marginTop:'175px'}}>*/}
                            <h6 className='col s12 center'>KPI CHART COMPARATOR</h6>
                        {
                            (this.state.data.length > 0)?
                            this.state.data.map((datum, index) => 
                                <ParentSize key={index}>
                                {
                                    parent => (
                                        <div>
                                        <h6 className="rezbuild-text col s12 center-align"  style={{padding:0}}>{datum.category} SCORE</h6>
                                        <RadarRechartComponent 
                                            key={datum.category+'-'+new Date().getTime()}
                                            highlightedTask = {this.state.highlightedTask} 
                                            data={datum.data}
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
                            : ''
                            }
                           {/* <ParentSize>
                                {
                                    parent => (
                                        <RadarRechartComponent
                                            key={'radar-rechart-'+new Date().getTime()}
                                            highlightedTask = {this.state.highlightedTask}
                                            data={this.state.data}
                                            parentWidth={parent.width}
                                            parentHeight={parent.height}
                                            parentTop={parent.top}
                                            parentLeft={parent.left}
                                            parentRef={parent.ref}
                                            resizeParent={parent.resize}
                                        />
                                    )
                                }
                            </ParentSize> */}
                        </div>
                     </div>
             </div>
         </div>
        );
    }
}

const VersionComparatorComponent = props => (
    <SocketContext.Consumer>
    { (context) => <VersionComparatorCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
    </SocketContext.Consumer>
  )
  export default VersionComparatorComponent;
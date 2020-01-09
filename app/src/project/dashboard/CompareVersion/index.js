import React, { Component } from 'react'
import ComputeVersion from '../ComputeVersion'
import RadarChartComponent from '../RadarChart'
import chroma from 'chroma-js'
import moment from 'moment'
var $ = window.$

class CompareVersionForm extends Component {

  constructor(props){
   super(props);
   this.state = {
       error : false,
       pending : false,
       tasks: [],
       categories: [],
       series: [],
       colors: []
   }
   this.compare.bind(this);
  }
  compare(){
    var selectedTaskIds = $("#select_compare_version option:selected").map(function() {return $(this).val();}).get();
    selectedTaskIds = selectedTaskIds.filter(selectedTaskId => selectedTaskId !== "");
    var allCategories = [];
    var allSeries = [];
    var allColors = chroma.scale(['#f89f37','#0760C8']).mode('lch').colors(selectedTaskIds.length);
    
    selectedTaskIds.forEach(selectedTaskId => {
      var selectedTask = this.props.tasks.filter(task => task._id === selectedTaskId)[0];
      var {series, categories} = ComputeVersion.computeScoreOfRelevanTask(selectedTask, this.props.tasks);
      allCategories = categories;
      allSeries.push(series[0]);
    });
    this.setState({categories: allCategories, series:allSeries, colors:allColors}, () => console.log(this.state));
  }

  cancel(){
    $('#modal_compare_version').modal('close');
  }
  
  update(){
    let tasks = this.props.tasks.filter(task => task.prev.length && (task.action.includes('MODEL_ASIS') || task.action.includes('MODEL_TOBE')) );
    this.setState({tasks: tasks})
  }

  componentDidMount(){
    //this.props.user.roles.map((role, index) => $("#settings_role_"+role).prop( "selected", true ));
    this.update();
    $(document).ready(() => {
        $('#modal_compare_version').modal({dismissible: false});
        $('select').material_select();
    })
  }
  

  render() {
    let multipleSelectVersion =  
            <div className="input-field col s12">
                <select multiple ref="select_compare_version" id="select_compare_version">
                <option value="" disabled selected>Choose your option</option>
                    {
                        this.state.tasks.map( (task) => {
                            return <option name="option_compare_version" value={task._id} id={'settings_role_'+task._id} key={task._id}>{task.name + ' (' + moment(task.date).format('LLL') + ')'}</option>
                        })
                    }
                </select>
                <label>Select versions</label>
            </div>
    let body =
        <div>
            <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>COMPARE KPI SCORE</h4>
            </div>
            <div className="modal-content">
                  <form className="col s12">
                     <div className="row">
                        {multipleSelectVersion}
                     </div>
                     <div className="row">
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light" href='#!' onClick={() => this.compare()}><i className="material-icons right">send</i>SUBMIT</a>
                      </div>
                      <div className="input-field col s6 center">
                          <a className="btn waves-effect waves-light rezbuild-text white" href='#!' onClick={this.cancel}><i className="material-icons left">cancel</i>CANCEL</a>
                      </div>
                     </div>
                     <div className="row">
                      <div className='col s12'>
                      {
                        (this.state.categories.length && this.state.series.length && this.state.colors.length)?
                                <div className='col s10 push-s1'>
                                    <RadarChartComponent  className='center' size={undefined} series={this.state.series} categories = {this.state.categories}  colors ={this.state.colors}/>
                                </div>
                                : ''
                      }
                      </div>
                     </div>
                  </form>
            </div>
        </div>
    return (
    <div id="modal_compare_version" className="modal" style={{minHeight:'500px'}}>
        {body}
    </div>
    );
  }
}

export default CompareVersionForm;

import React, { Component } from 'react'
import {Tag} from 'react-trello'

import RemoveTaskForm from './forms/RemoveTaskForm'
import CreateTaskForm from './forms/CreateTaskForm'
import MDReactComponent from 'markdown-react-js'

var $ = window.$

class CardComponent extends Component {

  constructor(props){
    super(props);
  }

 /*componentDidMount(){
    $(document).ready(function(){
     $('#date_start').pickadate();
     $('#date_end').pickadate();
    });
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevState.task !== this.state.task) {
            $('.modal').modal();
      }
  }*/

  render(){

      return (
        <div className="section" style={{padding:'5px'}}>
           <div className="row">
                <div className="col s7">
                    <h6 className="black-text"><b>{this.props.name}</b></h6>
                    <p className="black-text">{this.props.content}</p>
                </div>
                <div className="col s2">
                    <a className="waves-effect waves-light btn-small btn-floating rezbuild" href={"#modal_createtask_"+this.props._id}><i className="material-icons left  white-text">edit</i></a>
                </div>
                <div className="col s2">
                    <a className="waves-effect waves-light btn-small btn-floating white"  href={"#modal_removetask_"+this.props._id}><i className="material-icons left  rezbuild-text">clear</i></a>
                </div>
            </div>
           <div className="row">
               <div className="col s12">
                   <h6 className="black-text">Role(s)</h6>
                   {
                       this.props.roles.map((role, index) =>
                             <div className="chip grey lighten-2" key={index}>
                                {role}
                              </div>
                       )
                   }
               </div>
               <div className="col s12">
                   <h6 className="black-text">Action(s)</h6>
                   {
                       this.props.actions.map((action, index) =>
                             <div className="chip grey lighten-2" key={index}>
                                {action}
                              </div>
                       )
                   }
               </div>
           </div>
           {
            (this.props.lane === 'lane_todo' || this.props.lane === 'lane_inprogress')?
               <div className="row">
                   <div className="col s5 center">
                        <h6 className="black-text">{(new Date(this.props.startDate)).toLocaleDateString("en-US")}</h6>
                   </div>
                   <div className="col s2 center">
                        <i className="material-icons black-text">arrow_forward</i>
                   </div>
                   <div className="col s5 center">
                        <h6 className="black-text">{(new Date(this.props.endDate)).toLocaleDateString("en-US")}</h6>
                   </div>
               </div>
               :""
           }
           <RemoveTaskForm task={this.props} />
           <CreateTaskForm task={this.props} />
        </div>
      )
  }
}

export default CardComponent;

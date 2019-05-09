import React, { Component } from 'react'

import RemoveTaskForm from './removeTask'
import CreateTaskForm from './createTask'
var $ = window.$

class CardComponent extends Component {

  constructor(props){
    super(props);
  }

  render(){

      return (
        <div className="section" style={{padding:'5px', pointerEvents: (this.props.enabled?'auto':'none'), opacity:(this.props.enabled?'1':'0.5')}}>
           <div className="row">
                <div className="col s6">
                    {
                        (this.props.lane === 'lane_done') ?
                            <h7 className="black-text">{(new Date(this.props.doneDate)).toLocaleString("en-US")}</h7>
                        : ''
                    }
                </div>
                <div className="col s6 right-align">
                    {
                    this.props.roles.map((role, index) =>
                         <h7 className="black-text"><i>{" " + role[0]}</i></h7>
                    )
                    }
                </div>
                <div className="col s7">
                    <h6 className="black-text"><b>{this.props.name}</b></h6>
                    <p className="black-text">{this.props.content}</p>
                </div>
                {/*
                    (this.props.lane !== 'lane_done')?
                        <div>
                            <div className="col s2">
                                <a className="waves-effect waves-light btn-small btn-floating rezbuild" href={"#modal_createtask_"+this.props._id}><i className="material-icons left  white-text">edit</i></a>
                            </div>
                            <div className="col s2">
                                <a className="waves-effect waves-light btn-small btn-floating white"  href={"#modal_removetask_"+this.props._id}><i className="material-icons left  rezbuild-text">clear</i></a>
                            </div>
                        </div>
                        :''
                */}
            </div>
            {/*
            (this.props.lane !== 'lane_done') ?
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
            </div> : '' 
                */}
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
           <RemoveTaskForm  task={this.props} />
           <CreateTaskForm task={this.props} />
        </div>
      )
  }
}

export default CardComponent;

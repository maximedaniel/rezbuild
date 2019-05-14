import React, { Component } from 'react'

import RemoveTaskForm from './removeTask'
import CreateTaskForm from './createTask'
var $ = window.$

class CardComponent extends Component {

  constructor(props){
    super(props);
    this.onIn = this.onIn.bind(this)
    this.onOut = this.onOut.bind(this)
    this.state = {hover:false}
  }
  onIn(){
    this.setState({hover: true})
    $("#content_"+this.props.id).css('opacity', '1');
    $("#content_"+this.props.id).css('max-height', '200px');

}
 onOut(){
    this.setState({hover: false})
    $("#content_"+this.props.id).css('transition', 'max-height 0.5s ease-out, opacity 0.5s ease-out');
    $("#content_"+this.props.id).css('opacity', '0');
    $("#content_"+this.props.id).css('max-height', '0');
    $("#content_"+this.props.id).css('overflow', 'hidden');
  }

  componentDidUpdate() {
    $('.cqkFMI').css('min-width', 0);
  }

  render(){
      var isDone = (this.props.lane === 'lane_done')
      
      
      return (
        <div className="section hoverable"
        onMouseOver={this.onIn}
        onMouseOut={this.onOut} 
        style={{
        borderStyle: this.props.focused?'solid': "",
        borderColor: this.props.focused?'#f7931e': "",
        borderWidth: this.props.focused?'4px' : '',

        padding: 0,
        margin: 0
        }}>
            <div className="row" style={{marginBottom:'0px'}}>
                <div className="col s6 left-align">
                    <h6  className="black-text"><b>{this.props.name}</b></h6>
                </div>
                <div className="col s6 right-align">
                    <h6 className="black-text"><i>{this.props.roles.map(role => role[0]).join()}</i></h6>
                </div>
                    <div className="col s12" id={"content_"+this.props.id} style={{
                        transition: 'max-height 0.5s ease-out, opacity 0.5s ease-out',
                        opacity: '0',
                        maxHeight: '0',
                        overflow: 'hidden'
                    }}>
                        <p className="black-text">{this.props.content}</p>
                    </div>

                <div className="col s12">
                    {
                        (this.props.lane === 'lane_done') ?
                        <h7 className="black-text">{(new Date(this.props.date)).toLocaleString("en-US")}</h7>
                        : ''
                    }
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
               <div className="row" style={{marginBottom:'0px'}}>
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

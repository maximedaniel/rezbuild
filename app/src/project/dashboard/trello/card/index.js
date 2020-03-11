/**
 * @class Card
 * @extends Component
 * @description Create the card part of the trello
 */
import React, { Component } from 'react'
import RemoveTaskForm from './removeTaskForm'
import CreateTaskForm from './createTaskForm'
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
    $("#content_"+this.props.id).css('max-height', '15em');

}
 onOut(){
    this.setState({hover: false})
    $("#content_"+this.props.id).css('transition', 'max-height 0.5s ease-out, opacity 0.5s ease-out');
    $("#content_"+this.props.id).css('opacity', '0');
    $("#content_"+this.props.id).css('max-height', '0');
    $("#content_"+this.props.id).css('overflow', 'hidden');
  }

  componentDidUpdate() {
    $('.rXSjd').css('min-width', '4em');
    $('#textarea_'+this.props.id).trigger('autoresize');
  }

  render(){
      return (
        <div className="section hoverable"
        onMouseOver={ this.props.draggable?this.onIn:null}
        onMouseOut={this.props.draggable?this.onOut:null} 
        style={{
        minWidth: '15em',
        width: '15em',
        maxWidth: '15em',
        color:'#000',
        backgroundColor:'#fff',
        fontFamily: 'Exo 2',
        textShadow:"-1px -1px 0 #fff, 1px -1px 0 #fff,  -1px 1px 0 #fff, 1px 1px 0 #fff",
        borderStyle: this.props.dashed?'dashed': "solid",
        borderColor: this.props.focused?'#f7931e': "#fff",
        borderWidth: this.props.focused?'4px' : '0px',
        opacity: this.props.draggable?'1':'0.5',
        padding: '0',
        marginBottom: '10px',

        }}>
            <div className="row" style={{marginBottom:'0px'}}>
                <div className="col s6 left-align">
                    <h6  className="black-text"><b>{this.props.name}</b></h6>
                </div>
                <div className="col s6 right-align">
                    <h6 className="black-text"><i>{this.props.roles.map(role => role[0]).join()}</i></h6>
                </div>
                {
                    this.props.userDetails?
                    <div className="col s12">
                        <h6  className="black-text"><b>@</b>{this.props.userDetails.firstname + ' ' + this.props.userDetails.lastname}</h6>
                    </div>: ""
                }
                {
                 (this.props.lane === 'lane_todo')?
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

                <div className="col s12 center" id={"content_"+this.props.id} style={{
                        transition: 'max-height 0.5s ease-out, opacity 0.5s ease-out',
                        opacity: '0',
                        maxHeight: '0',
                        overflow: 'hidden',
                    }}>
                     <div className="col s12">
                        <textarea style={{pointerEvents:'none'}} id={"textarea_"+this.props.id} className="materialize-textarea black-text" defaultValue={this.props.content}></textarea>
                     </div>
                </div>
            </div>
           <RemoveTaskForm  task={this.props} />
           <CreateTaskForm task={this.props} />
        </div>
      )
  }
}

export default CardComponent;

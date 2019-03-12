import React, { Component } from 'react'
import {Tag} from 'react-trello'

class CardComponent extends Component {

  constructor(props){
    super(props);
  }


 /*         id: '2',
            title: 'Upload IS model',
            date: new Date(),
            lane:  'lane_backlog',
            revision:  this.props.revision._id,
            assignements: [],
            assessments: [],
            inputs:[],
            outputs: []
*/

  render(){
      return (
        <div style={{padding: 6}}>
          <header
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: 6,
              marginBottom: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              color:'#000',
              backgroundColor:'#fff',
            }}>
            <div style={{fontSize: 14, fontWeight: 'bold'}}>{this.props.title}</div>
            <div style={{fontSize: 14, fontWeight: 'normal'}}>{this.props.date}</div>
          </header>
          <div style={{fontSize: 12, color: '#BD3B36'}}>
             <div style={{padding: '5px 0px'}}>
              <i>{this.props.revision}</i>
              <i>{this.props.assignements}</i>
              <i>{this.props.assessments}</i>
              <i>{this.props.inputs}</i>
              <i>{this.props.outputs}</i>
            </div>
          </div>
        </div>
      )
  }
}

export default CardComponent;

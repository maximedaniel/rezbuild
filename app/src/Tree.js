import React, { Component } from 'react';
import { Graph, DefaultLink, DefaultNode } from '@vx/network';

class Tree extends Component {

    constructor(props){
        super(props)
        this.nodes = [{ x: 0, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }];
        this.dataSample = {
          nodes: this.nodes,
          links: [
            { source: this.nodes[0], target: this.nodes[1] },
            { source: this.nodes[1], target: this.nodes[2] },
            { source: this.nodes[2], target: this.nodes[0] }
          ]
        };
        this.margin = {
            top: 0,
            left: 10,
            right: 10,
            bottom: 0
          }
    }

    render(){
      const yMax = this.props.parentHeight - this.margin.top - this.margin.bottom;
      const xMax = this.props.parentWidth - this.margin.left - this.margin.right;
      return (
        <svg width={this.parentWidth} height={this.parentHeight}>
          <Graph graph={this.dataSample} size={[yMax, xMax]} linkComponent={DefaultLink} nodeComponent={DefaultNode} />
        </svg>
      );
    }


}

export default Tree;
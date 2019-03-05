import React, { Component } from 'react';
import { Graph} from '@vx/network';
import * as d3 from 'd3';
import SocketContext from './SocketContext'

var $ = window.$

class GraphCore extends Component {

    constructor(props){
        super(props)
        this.did = false
        this.nodes = []
        this.links = []
    }



   update(){
        /* PARSING */
        var root = this.props.nodes.filter((node) => (node.prev.length ===0))[0]

        var nodes = {}
        var generate = (res, node, nodes) => {
            if(!res[node._id]) res[node._id] = []
            if(node.next.length){
                node.next.map((next_node_id) => {
                    res[node._id].push(next_node_id)
                    var next_node = nodes.filter((node) => (node._id === next_node_id))[0]
                    generate(res, next_node, nodes)
                })
            }
        }
        generate(nodes, root, this.props.nodes)
        console.log(nodes)

        var _nodes = []
        var _links = []
        function ascend(node_id, level, level_width, min_width, min_height, range_height){
            var node_x = min_width + (level * level_width)
            var node_y = min_height + range_height/2
            _nodes.push({_id: node_id, x: node_x, y: node_y, selected: false})
            var next_nodes = nodes[node_id]
            if(next_nodes.length){
                var step_height = range_height/next_nodes.length
                next_nodes.map((next_node_id, index) => {
                    var next_min_height = min_height + index * step_height
                    var next_max_height = min_height + (index + 1) * step_height
                    var next_range_height = next_max_height-next_min_height
                    var next_node_x = min_width + ((level+1) * level_width)
                    var next_node_y = next_min_height + next_range_height/2

                    _links.push({source : {_id: node_id, x: node_x, y: node_y}, target: {_id: next_node_id, x: next_node_x, y: next_node_y}})

                    ascend(next_node_id, level+1, level_width, min_width, next_min_height, next_range_height)
                })
            }
        }
        ascend(Object.keys(nodes)[0], 0, 100, 25, 0, this.props.parentHeight)
        this.nodes = _nodes
        this.links = _links
        this.selectNode()
        this.draw()
   }

   draw(){
        /* DRAWING */
        const svg = d3.select($("#svg-tree")[0]);
        svg.selectAll("*").remove();
        const radius_min = 8
        const radius_max = 12
        const stroke_min = 2
        const stroke_max = 4
        const transition_duration = 150

        var curve = d3.line()
        .x( d => d.x)
        .y( d => d.y)
        .curve(d3.curveMonotoneX);

        const link = svg.append("g")
        .selectAll("path")
        .data(this.links)
        .enter()
        .append("path")
        .attr("d", d => curve([
        {x: d.source.x, y: d.source.y},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.2), y: d3.interpolateNumber(d.source.y, d.target.y)(0.1)},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.8), y: d3.interpolateNumber(d.source.y, d.target.y)(0.9)},
        {x: d.target.x, y: d.target.y}]))
        .attr("stroke", "#f7931e")
        .attr("stroke-width", stroke_min)
        .attr("fill", "none");

        const node = svg.append("g")
           .selectAll("circle")
           .data(this.nodes)
           .enter()
           .append("circle")
           .attr("stroke", "#f7931e")
           .attr("stroke-width", 2)
           .attr("cx", d => d.x)
           .attr("cy", d => d.y)
           .attr("r", d => {return (d.selected)?radius_max:radius_min})
           .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
           .attr("fill",  "#fff")
           .on("click", (d, i, n) => {
                this.props.setNode(this.props.nodes.filter((node) => (node._id === d._id))[0])
            })
           .on("mouseover", function(d, i) {
            if(!d.selected){
                d3.select(this)
                .transition()
                .attr("r", radius_max)
                .attr("stroke-width", stroke_max)
                .duration(transition_duration);
            }
            })
           .on("mouseout", function(d, i) {
            if(!d.selected){
                d3.select(this)
                .transition()
                .attr("r", radius_min)
                .attr("stroke-width", stroke_min)
                .duration(transition_duration);
            }
            });
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.nodes !== this.props.nodes) {
        this.update()
      }
      if (prevProps.node !== this.props.node){
        this.update()
      }
   }
   selectNode(){
    if(this.props.node){
        this.nodes.map((node, index) => {
                    node.selected = (node._id === this.props.node._id)
                })
    }
   }

   componentDidMount(){

   }

    render(){

        if(this.props.parentWidth && this.props.parentHeight && !this.did){
            this.did = true
            this.update()
        }

        return (
        <svg id='svg-tree' width={this.props.parentWidth} height={this.props.parentHeight} >
        </svg>
        );
    }


}

const GraphComponent = props => (
  <SocketContext.Consumer>
  {socket => <GraphCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default GraphComponent;
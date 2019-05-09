    
import React, { Component } from 'react';
//import { Graph} from '@vx/network';
import * as d3 from 'd3';
//import SocketContext from '../SocketContext'


var $ = window.$

class GraphComponent extends Component {

    constructor(props){
        super(props)
        this.did = false
        this.state = {nodes : [], links : []}
    }



   update(){
     var childWidth = 200
     this.setState({nodes:[], links:[]}, () => {
      var rootRevision = this.props.revisions.filter ((revision, index ) => (!revision.prevLinks.length))[0]

      var ascend = (type, revision, x, y, width, height, nodes, links) => {
        var selected = this.props.revision ? (this.props.revision._id === revision._id) : false

        nodes.push({type: type, revision: revision, x: x, y: y, selected: selected})

        var childHeight = height/revision.nextLinks.length

        var startIndex = 0
        var nextLinksASISMODEL = revision.nextLinks.filter(nextLink => {
          var task = this.props.tasks.filter(task => (task._id === nextLink.task))[0]
          return task.actions.filter(action => action.includes('ASIS')).length
        })

        nextLinksASISMODEL.map((nextLink, index) => {
          var nextRevision = this.props.revisions.filter ((revision) => (revision._id === nextLink.revision))[0]
          var newTask = this.props.tasks.filter ((task) => (task._id === nextLink.task))[0]
          links.push({
            task: newTask,
            source: {x: x, y: y},
            target: {x: x + childWidth, y: y + (index * childHeight)},
            dashed : ("0, 0"),
            color: "#f7931e"
          })
          ascend('ASIS_MODEL', nextRevision,  x + childWidth, y + (index * childHeight), width, childHeight, nodes, links)
        });

        startIndex += nextLinksASISMODEL.length

        var nextLinksTOBEMODEL = revision.nextLinks.filter(nextLink => {
          var task = this.props.tasks.filter(task => (task._id === nextLink.task))[0]
          return task.actions.filter(action => action.includes('TOBE')).length
        })

        nextLinksTOBEMODEL.map((nextLink, index) => {
          var nextRevision = this.props.revisions.filter ((revision) => (revision._id === nextLink.revision))[0]
          var newTask = this.props.tasks.filter ((task) => (task._id === nextLink.task))[0]
          links.push({
            task: newTask,
            source: {x: x, y: y},
            target: {x: x + childWidth, y: y + ((startIndex + index) * childHeight)},
            dashed : ("0, 0"),
            color: "#f7931e"
          })
          ascend('TOBE_MODEL', nextRevision,  x + childWidth, y + ((startIndex + index) * childHeight), width, childHeight, nodes, links)
        });

        startIndex += nextLinksTOBEMODEL.length

        var nextLinksKPI = revision.nextLinks.filter(nextLink => {
          var task = this.props.tasks.filter(task => (task._id === nextLink.task))[0]
          return task.actions.filter(action => action.includes('KPI')).length
        })
        nextLinksKPI.map((nextLink, index) => {
          var nextRevision = this.props.revisions.filter ((revision) => (revision._id === nextLink.revision))[0]
          var newTask = this.props.tasks.filter ((task) => (task._id === nextLink.task))[0]
          links.push({
            task: newTask,
            source: {x: x, y: y},
            target: {x: x + childWidth, y: y + ((startIndex + index) * childHeight)},
            dashed : ("3, 3"),
            color: "#f7931e"
          })
          ascend('KPI', nextRevision,  x + childWidth, y + ((startIndex + index) * childHeight), width, childHeight, nodes, links)
        });
        /*var index = 0
        revision.nextLinks.map((nextLink) => {
          var nextRevision = this.props.revisions.filter ((revision) => (revision._id === nextLink.revision))[0]
          var newTask = this.props.tasks.filter ((task) => (task._id === nextLink.task))[0]
          var childHeight = height/revision.nextLinks.length
          if(newTask.actions.includes('ASIS_MODEL')){
            links.push({
              task: newTask,
              source: {x: x, y: y},
              target: {x: x+50, y: y + (index * 50)},
              dashed : false,
            })
            ascend(nextRevision,  x+50, y + (index * 50), width, heigth, nodes, links)
            index++
          }
        });*/
       /* var index = 0
        revision.nextLinks.map((nextLink) => {
          var nextRevision = this.props.revisions.filter ((revision, index ) => (revision._id === nextLink.revision))[0]
          var newTask = this.props.tasks.filter ((task, index ) => (task._id === nextLink.task))[0]
          if(newTask.actions.includes('TOBE_MODEL')){
            links.push({
              task: newTask,
              source: {x: x, y: y},
              target: {x: x+25, y: 25 + y + (index * 25)},
              dashed : true,
            })
            ascend(nextRevision,  x + 25, 25 + y + (index * 25), width, heigth, nodes, links)
            index++
          }
        });*/
      }
      ascend('ASIS_MODEL', rootRevision, 15, 15, this.props.parentWidth, this.props.parentHeight, this.state.nodes, this.state.links)
      this.draw()
    });
/*
     var ascend = (revision, xOrigin, yOrigin, width, height, nodes, links) => {
      var selected = this.props.revision ? (this.props.revision._id === revision._id) : false
      nodes.push({revision: revision, x: xOrigin, y: yOrigin, selected: selected})
      var childHeight = height/revision.nextLinks.length
      revision.nextLinks.map((nextLink, index) => {
        var nextRevision = this.props.revisions.filter ((revision, index ) => (revision._id === nextLink.revision))[0]
        var newTask = this.props.tasks.filter ((task, index ) => (task._id === nextLink.task))[0]
        var dashed = newTask.actions.includes('ASIS_MODEL')
        links.push({
          task: newTask,
          source: {x: xOrigin, y: yOrigin},
          target: {x: xOrigin+50, y: index * childHeight + childHeight/2},
          dashed : dashed,
        })
        ascend(nextRevision,  xOrigin+50, index * childHeight + childHeight/2, this.props.parentWidth, childHeight, nodes, links)
      });
    };
     this.setState({nodes:[], links:[]}, () => {
      ascend(rootRevision, 0, this.props.parentHeight/2, this.props.parentWidth, this.props.parentHeight, this.state.nodes, this.state.links)
      console.log(this.state.nodes)
      console.log(this.state.links)
      this.draw()
     })*/
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
        const selectionScale = 1.5

        var curve = d3.line()
        .x( d => d.x)
        .y( d => d.y)
        .curve(d3.curveMonotoneX);

        const link = svg.append("g")
        .selectAll("path")
        .data(this.state.links)
        .enter()
        .append("path")
        .attr("d", d => curve([
        {x: d.source.x, y: d.source.y},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.2), y: d3.interpolateNumber(d.source.y, d.target.y)(0.1)},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.8), y: d3.interpolateNumber(d.source.y, d.target.y)(0.9)},
        {x: d.target.x, y: d.target.y}]))
        .attr("stroke", d => d.color)
        .attr("stroke-width", stroke_min)
        .style("stroke-dasharray", d => d.dashed)
        .attr("fill", "none");
      
        const sizeLabel = 12
        const label = svg.append("g")
        .selectAll("text")
        .data(this.state.links)
        .enter()
        .append("text")
        .attr("x", function(d) { return d.target.x - sizeLabel-4; })
        .attr("y", function(d) { return d.target.y + sizeLabel/4; })
        .html( function (d) { return d.task.name; })
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-size", sizeLabel+"px")
        .attr("paint-order", "stroke")
        .attr("stroke","#f7931e")
        .attr("stroke-width",stroke_max)
        .attr("stroke-linecap", "butt")
        .attr("stroke-linejoin", "miter")
        .attr("font-weight", "800");
      

        const circles = svg.append("g")
           .selectAll("circle")
           .data(this.state.nodes.filter(d => d.type ==='ASIS_MODEL'))
           .enter()
           .append("circle")
           .attr("stroke", "#f7931e")
           .attr("stroke-width", 2)
           .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
           .attr("r", d => {return (d.selected)?radius_max:radius_min})
           .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
           .attr("fill",  "#fff")
           .on("click", (d, i, n) => {
                if(d.selected){
                  this.props.setRevision(null)
                } else this.props.setRevision(this.props.revisions.filter((revision) => (revision._id === d.revision._id))[0])
                
            })
           .on("mouseover", function(d, i) {
            if(!d.selected){
                d3.select(this)
                .transition()
                .attr("transform", d => "translate(" + d.x + "," + d.y + ") scale("+selectionScale+")")
                .duration(transition_duration);
            }
            })
           .on("mouseout", function(d, i) {
            if(!d.selected){
                d3.select(this)
                .transition()
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
                .duration(transition_duration);
            }
            });

        const rects = svg.append("g")
            .selectAll("rect")
            .data(this.state.nodes.filter(d => d.type ==='TOBE_MODEL'))
            .enter()
            .append("rect")
            .attr("stroke", "#f7931e")
            .attr("stroke-width", 2)
            .attr("transform", d => "translate(" + (d.x - ((d.selected)?radius_max:radius_min))+ "," + ( d.y - ((d.selected)?radius_max:radius_min) )+ ")")
            .attr("width", d => {return ((d.selected)?radius_max:radius_min)*2})
            .attr("height", d => {return ((d.selected)?radius_max:radius_min)*2})
            .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
            .attr("fill",  "#fff")
            .on("click", (d, i, n) => {
              if(d.selected){
                this.props.setRevision(null)
              } else this.props.setRevision(this.props.revisions.filter((revision) => (revision._id === d.revision._id))[0])
              
             })
            .on("mouseover", function(d, i) {
             if(!d.selected){
                 d3.select(this)
                 .transition()
                 .attr("transform", d => "translate(" + (d.x - radius_max)+ "," + ( d.y - radius_max)+ ") scale("+selectionScale+")")
                 .duration(transition_duration);
             }
             })
            .on("mouseout", function(d, i) {
             if(!d.selected){
                 d3.select(this)
                 .transition()
                 .attr("transform", d => "translate(" + (d.x - radius_min)+ "," + (d.y - radius_min) + ")")
                 .duration(transition_duration);
             }
             });  

        const triangles = svg.append("g")
             .selectAll("path")
             .data(this.state.nodes.filter(d => d.type === 'KPI'))
             .enter()
             .append("path")
             .attr("d", d => d3.symbol()
                    .type(d3.symbolTriangle)
                    .size((d.selected?radius_max:radius_min)*14)()
             )
             .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
             .attr("stroke", "#f7931e")
             .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
             .attr("fill",  "#fff")
             //.attr("x", d => d.x - ((d.selected)?radius_max:radius_min) )
             //.attr("y", d => d.y - ((d.selected)?radius_max:radius_min) )
             //.attr("width", d => {return ((d.selected)?radius_max:radius_min)*2})
             //.attr("height", d => {return ((d.selected)?radius_max:radius_min)*2})
             .on("click", (d, i, n) => {
              if(d.selected){
                this.props.setRevision(null)
              } else this.props.setRevision(this.props.revisions.filter((revision) => (revision._id === d.revision._id))[0])
              
              })
             .on("mouseover", function(d, i) {
              if(!d.selected){
                  d3.select(this)
                  .transition()
                  .attr("transform", d => "translate(" + d.x + "," + d.y + ") scale("+selectionScale+")")
                  .duration(transition_duration);
              }
              })
             .on("mouseout", function(d, i) {
              if(!d.selected){
                  d3.select(this)
                  .transition()
                  .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
                  .duration(transition_duration);
              }
              });  
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.revisions !== this.props.revisions) {
        this.update()
      }
      if (prevProps.revision !== this.props.revision) {
        this.update()
      }
      if (prevProps.tasks !== this.props.tasks){
        this.update()
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

export default GraphComponent;
    
/**
 * @class Graph
 * @extends Component
 * @description Create the exploration graph part of the dashboard
 */
import React, { Component } from 'react'
import * as d3 from 'd3'
import moment from 'moment'

var $ = window.$

const radius_min = 8;
const radius_max = 12;
const stroke_min = 2;
const stroke_max = 4;
const transition_duration = 150;
const selectionScale = 1.5;
const sizeLabel = 12;
const sizeSubLabel = 10;
const minWidth = 180;
const minHeight = 40;
const xOrigin = 15;
const yOrigin = 15;

class GraphComponent extends Component {

    constructor(props){
        super(props)
        this.did = false;
        this.state = {height:0, width:0, selectedTasks: [], nodes : [], links : []}
        this.countNodeAtDepthLevel = this.countNodeAtDepthLevel.bind(this);
        this.countNodeByDepthLevel = this.countNodeByDepthLevel.bind(this);
        this.getNodesAtDepthLevel = this.getNodesAtDepthLevel.bind(this);
    }

    handleClassName(className, isActive, isMultiple, duration){
      const svg = d3.select($("#svg-tree")[0]);
      let extraMax = 0;
      let extraMin = 0;
      if(className ==='rectangle'){
        extraMax = radius_max;
        extraMin = radius_min;
      }
      if(isActive){
        svg.selectAll('.link-'+className+',.symbol-'+className+',.label-'+className)
        .transition()
        .duration(duration)
        .attr("opacity", 1);
  
        svg.selectAll(".symbol-"+className)
        .on("click", (d, i, n) => {
          if(d.selected){
            if(isMultiple){
              this.props.removeTask(this.props.tasks.filter((task) => (task._id === d.task._id))[0]);
             } else {
                this.props.setTask(null);
            }
          } else {
            if(isMultiple){
              this.props.addTask(this.props.tasks.filter((task) => (task._id === d.task._id))[0]);
            } else {
              this.props.setTask(this.props.tasks.filter((task) => (task._id === d.task._id))[0]);
            }
          }
        })
        .on("mouseover", function(d, i) {
          if(!d.selected){
              d3.select(this)
              .transition()
              .attr("transform", d => "translate(" + (d.x - extraMax) + "," + (d.y - extraMax) + ") scale("+selectionScale+")")
              .duration(transition_duration);
          }
        })
        .on("mouseout", function(d, i) {
            if(!d.selected){
                d3.select(this)
                .transition()
                .attr("transform", d => "translate(" + (d.x - extraMin) + "," + (d.y - extraMin) + ")")
                .duration(transition_duration);
            }
        })
      } else {
        svg.selectAll('.link-'+className+',.symbol-'+className+',.label-'+className)
        .transition()
        .duration(duration)
        .attr("opacity", 0.5);
  
        svg.selectAll(".symbol-"+className)
        .on("click", null)
        .on("mouseover", null)
        .on("mouseout", null);
      }
    }

    toggleCompareMode(){
        this.handleClassName('init', !this.props.compareMode, this.props.compareMode, 0);
        this.handleClassName('circle', true, this.props.compareMode, 0);
        this.handleClassName('rectangle', true, this.props.compareMode, 0);
        this.handleClassName("triangle", !this.props.compareMode, this.props.compareMode, transition_duration);
        //if(this.props.selectedTasks.filter(selectedTask => selectedTask.action.includes('MODEL')).length !== this.props.selectedTasks.length)
        this.props.setTask(null);
    }

  countNodeAtDepthLevel(rootNode, depthLevel){
    if(depthLevel <= 0) return 1;
    if(rootNode!==null && rootNode.next!==null && rootNode.next.length >0){
        let res = [];
        rootNode.next.forEach(nextTaskId => {
          let nextTask = this.props.tasks.filter(task => (task._id === nextTaskId))[0];
          res.push(this.countNodeAtDepthLevel(nextTask, depthLevel-1));
        });
        let ans = res.reduce((a, b) => a + b, 0)
        return ans;
    }
    return 0;  
  }

  getNodesAtDepthLevel(rootNode, depthLevel){
    if(depthLevel <= 0) return [rootNode];
    if(rootNode!==null && rootNode.next!==null && rootNode.next.length >0){
        let res = [];
        rootNode.next.forEach(nextTaskId => {
          let nextTask = this.props.tasks.filter(task => (task._id === nextTaskId))[0];
          res.push(this.getNodesAtDepthLevel(nextTask, depthLevel-1));
        });
        let ans = res.reduce((a, b) => [...a, ...b], [])
        return ans;
    }
    return [];  
  }

  countNodeByDepthLevel(rootNode){
    let bottomHit = false;
    let depthLevel = 0;
    let nbNodeByDepthLevel = [];
    while(!bottomHit){
      let nbNodeAtDepthLevel = this.countNodeAtDepthLevel(rootNode, depthLevel++);
      if(nbNodeAtDepthLevel){
        nbNodeByDepthLevel.push(nbNodeAtDepthLevel);
      } 
      else bottomHit = true;
    }
    return nbNodeByDepthLevel;
  }

   update(){
     var rootTask = this.props.tasks.filter(task => (task.action === 'INIT'))[0];
     var computeHeightOfNode = (task, minHeight) => {
      let ans = minHeight;
      if(task.next.length > 0){
        ans = task.next
              .map(nextTaskId => computeHeightOfNode(this.props.tasks.filter(task => (task._id === nextTaskId))[0], minHeight))
              .reduce((total, value) => total+value, 0);
      }
      return ans;
    }
    var computeWidthOfGraph = (task, minWidth, totalWidth) => {
      let ans = totalWidth;
      if(task.next.length > 0){
        return Math.max(
          ...task.next.map(nextTaskId =>
            computeWidthOfGraph(this.props.tasks.filter(task => (task._id === nextTaskId))[0], minWidth, totalWidth + minWidth)
          )
        );
      }
      return ans;
    }
    var height = computeHeightOfNode(rootTask, minHeight);
    var width = computeWidthOfGraph(rootTask, minWidth, minWidth);
     this.setState({height:height, width: width, selectedTasks: [], nodes:[], links:[]}, () => {
     

      var iterate  = (currTask, x, y, nodes, links) => {
        
        var selected = this.props.selectedTasks.length ? this.props.selectedTasks.filter(selectedTask => selectedTask._id === currTask._id).length : false
        nodes.push({task: currTask, x: x, y: y, selected: selected});
        //var height = computeHeightOfNode(task, minHeight);
        //console.log(task, height);
        var nextX = x  + minWidth;
        var nextY = y;
        var nextTasks = currTask.next.map(nextTaskId => this.props.tasks.filter(task => task._id === nextTaskId)[0]);
        var sortedNextTasks = nextTasks.sort( (prevTask, nextTask) => {
          //MODEL_ASIS > MODEL_TOBE > KPI
          if( 
            (prevTask.action.includes('MODEL_ASIS') && nextTask.action.includes('MODEL_TOBE'))
            ||
            (prevTask.action.includes('MODEL_TOBE') && nextTask.action.includes('KPI'))
            ||
            (prevTask.action.includes('MODEL_ASIS') && nextTask.action.includes('KPI'))
          ) return -1;

          if( 
            (nextTask.action.includes('MODEL_ASIS') && prevTask.action.includes('MODEL_TOBE'))
            ||
            (nextTask.action.includes('MODEL_TOBE') && prevTask.action.includes('KPI'))
            ||
            (nextTask.action.includes('MODEL_ASIS') && prevTask.action.includes('KPI'))
          ) return 1;
          return 0;
        });
        sortedNextTasks.forEach(nextTask => {
          var nextHeight = computeHeightOfNode(nextTask, minHeight);
         // console.log('nextTask:',nextTask,'nextHeight:',nextHeight);
          links.push({
            task: nextTask,
            source: {x: x, y: y},
            target: {x:  nextX, y:  nextY},
            dashed : (nextTask.lane==="lane_todo")?("3, 3"): ("0, 0"),
            color: "#f7931e"
          })
          iterate(nextTask, nextX, nextY, nodes, links);
          nextY = nextY + nextHeight;
        });
      }
      iterate(rootTask, xOrigin, yOrigin,  this.state.nodes, this.state.links);
      this.draw();
     });
   }

   draw(){
        /* DRAWING */
        const svg = d3.select($("#svg-tree")[0]);
        svg.selectAll("*").remove();

        var curve = d3.line()
        .x( d => d.x)
        .y( d => d.y)
        .curve(d3.curveMonotoneX);

        /* LINKS */
        svg.append("g")
        .selectAll("path")
        .data(this.state.links)
        .enter()
        .append("path")
        .attr('class', function (d) { 
            let className = '';
            if(d.task.action.includes('INIT')) className = 'link-init';
            if(d.task.action.includes('KPI')) className = 'link-triangle';
            if(d.task.action.includes('MODEL_ASIS')) className = 'link-circle';
            if(d.task.action.includes('MODEL_TOBE')) className = 'link-rectangle';
            return className;
        })
        .attr("d", d => curve([
        {x: d.source.x, y: d.source.y},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.2), y: d3.interpolateNumber(d.source.y, d.target.y)(0.1)},
        {x: d3.interpolateNumber(d.source.x, d.target.x)(0.8), y: d3.interpolateNumber(d.source.y, d.target.y)(0.9)},
        {x: d.target.x, y: d.target.y}]))
        .attr("stroke", d => d.color)
        .attr("stroke-width", stroke_min)
        .style("stroke-dasharray", d => d.dashed)
        .attr("fill", "none");
      
        
        /* LABELS */
        svg.append("g")
        .selectAll("text")
        .data(this.state.links)
        .enter()
        .append("text")
        .attr('class', function (d) { 
            let className = '';
            if(d.task.action.includes('INIT')) className = 'link-init';
            if(d.task.action.includes('KPI')) className = 'link-triangle';
            if(d.task.action.includes('MODEL_ASIS')) className = 'link-circle';
            if(d.task.action.includes('MODEL_TOBE')) className = 'link-rectangle';
            return className;
        })
        .attr("x", function(d) { return d.target.x - sizeLabel-4; })
        .attr("y", function(d) { return d.target.y + sizeLabel/4; })
        .html( function (d) { return d.task.name})
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-size", sizeLabel+"px")
        .attr("paint-order", "stroke")
        .attr("stroke","#f7931e")
        .attr("stroke-width",stroke_max)
        .attr("stroke-linecap", "butt")
        .attr("stroke-linejoin", "miter")
        .attr("font-weight", "800");
        
        svg.append("g")
        .selectAll("text")
        .data(this.state.links)
        .enter()
        .append("text")
        .attr('class', function (d) { 
            let className = '';
            if(d.task.action.includes('INIT')) className = 'link-init';
            if(d.task.action.includes('KPI')) className = 'link-triangle';
            if(d.task.action.includes('MODEL_ASIS')) className = 'link-circle';
            if(d.task.action.includes('MODEL_TOBE')) className = 'link-rectangle';
            return className;
        })
        .attr("x", function(d) { return d.target.x - sizeLabel-4; })
        .attr("y", function(d) { return d.target.y + sizeLabel + 4; })
        .html( function (d) { return moment(d.task.date).format('LLL'); })
        .attr("fill", "#f7931e")
        .attr("text-anchor", "end")
        .attr("font-size", sizeSubLabel+"px")
        .attr("paint-order", "stroke")
        .attr("stroke","#fff")
        .attr("stroke-width",stroke_min)
        .attr("stroke-linecap", "butt")
        .attr("stroke-linejoin", "miter")
        .attr("font-weight", "800");

        /* CIRCLES */
        svg.append("g")
        .selectAll("circle")
        .data(this.state.nodes.filter(d => d.task.action.includes('INIT')))
        .enter()
        .append("circle")
        .attr("class", "symbol-init")
        .attr("stroke", "#f7931e")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("r", d => {return (d.selected)?radius_max:radius_min})
        .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
        .style("stroke-dasharray", d => d.dashed)
        .attr("fill",  "#fff");


        /* CIRCLES */
        svg.append("g")
        .selectAll("circle")
        .data(this.state.nodes.filter(d => d.task.action.includes('MODEL_ASIS')))
        .enter()
        .append("circle")
        .attr("class", "symbol-circle")
        .attr("stroke", "#f7931e")
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("r", d => {return (d.selected)?radius_max:radius_min})
        .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
        .style("stroke-dasharray", d => d.dashed)
        .attr("fill",  "#fff");

        /* RECTS */
          svg.append("g")
          .selectAll("rect")
          .data(this.state.nodes.filter(d => d.task.action.includes('MODEL_TOBE')))
          .enter()
          .append("rect")
          .attr("class", "symbol-rectangle")
          .attr("stroke", "#f7931e")
          .attr("stroke-width", 2)
          .attr("transform", d => "translate(" + (d.x - ((d.selected)?radius_max:radius_min))+ "," + ( d.y - ((d.selected)?radius_max:radius_min) )+ ")")
          .attr("width", d => {return ((d.selected)?radius_max:radius_min)*2})
          .attr("height", d => {return ((d.selected)?radius_max:radius_min)*2})
          .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
          .attr("fill",  "#fff");

        /* TRIANGLES */
        svg.append("g")
        .selectAll("path")
        .data(this.state.nodes.filter(d => d.task.action.includes('KPI')))
        .enter()
        .append("path")
        .classed("symbol-triangle", true)
        .attr("d", d => d3.symbol()
              .type(d3.symbolTriangle)
              .size((d.selected?radius_max:radius_min)*14)()
        )
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
        .attr("stroke", "#f7931e")
        .attr("stroke-width", d => {return (d.selected)?stroke_max:stroke_min})
        .attr("fill",  "#fff");

        this.handleClassName('init', !this.props.compareMode, this.props.compareMode, 0);
        this.handleClassName('circle', true, this.props.compareMode, 0);
        this.handleClassName('rectangle', true, this.props.compareMode, 0);
        this.handleClassName('triangle', !this.props.compareMode, this.props.compareMode, 0);
   }

   componentDidUpdate(prevProps, prevState) {
     if (prevProps.tasks !== this.props.tasks) {
        this.update()
      }
     if (prevProps.selectedTasks !== this.props.selectedTasks) {
        this.update()
     }
     if (prevProps.compareMode !== this.props.compareMode) {
       this.toggleCompareMode()
    }
   }
   
   componentDidMount(){
     this.update()
   }

    render(){
        if(!this.did){
            this.did = true
            this.update()
        }
        // className='col s12'
        return (
          <div>
            <svg id='svg-tree' width={this.state.width} height={this.state.height} />
          </div>
        );
    }


}

export default GraphComponent;
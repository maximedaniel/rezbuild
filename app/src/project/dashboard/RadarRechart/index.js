    
/**
 * @class RadarRechart
 * @extends Component
 * @description Create the KPIs radar rechart part of the dashboard
 */
import React, { Component} from 'react';
import {Radar,  RadarChart, PolarGrid, PolarAngleAxis, Legend, Tooltip, PolarRadiusAxis, Text} from 'recharts';

class RadarRechartComponent extends Component {

  minMark = 0;
  maxMark = 1;
  height = 300;
  outerRadius = Math.round(this.height/3.);
  colors = ["#F7921E", "#B9813F", "#A15B0A", "#FBAE56", "#FBC382"];

  renderIndicatorTick = (tickProps) => {
    const { x, y, payload, textAnchor } = tickProps;
    const { value } = payload;
    return <Text x={x} y={y} width="200" fontSize="10px" textAnchor={textAnchor} verticalAnchor="middle">{value}</Text>;
  }

  tooltipFormatter = (value, name, props) => {
    // find a better solution...
    let taskId = this.props.data.taskNames.find((x) => x.taskFullname === name).taskId;
    return this.props.data.realData.find((x) => x.indicator === props.payload["indicator"])[taskId];
  } 

  // renderTooltip = (tooltipProps) => {
  //   const { active, label } = tooltipProps;
  //   if (active) {
  //     let realData = this.props.data.realData.find(x => x.indicator === label);
  //     if (realData) {
  //       return (
  //         <div className="custom-tooltip">
  //           { 
  //             Object.entries(realData).forEach( ([key, value]) =>
  //               <p className="label">{`${key} : ${value}`}</p>
  //             )
  //           }
  //         </div>
  //       );
  //     }
  //   }
  //   return null;
  // };

  render() {
    if(this.props.data.length === 0) return <div/>;
    if(this.props.data.normData.length === 0) return <div/>;
    let tasksID = Object.keys(this.props.data.normData[0]).filter(key => key!=='indicator');

    return (
      <RadarChart  
        outerRadius={this.outerRadius}
        data={this.props.data.normData}
        width={this.props.parentWidth}
        height={this.height}
        margin={{ top: 0, right: 5, bottom: 0, left: 5}}
        fontSize="10px">
      <PolarGrid />
      <PolarAngleAxis dataKey="indicator" tick={this.renderIndicatorTick} />
      <PolarRadiusAxis angle={90} domain={[this.minMark, this.maxMark]} tick={false}/>
      {
        tasksID.map( (taskID, index) => 
          <Radar isAnimationActive={false}
            name={this.props.data.taskNames.find(x => x.taskId === taskID).taskFullname}
            dataKey={taskID} 
            stroke={this.colors[index%this.colors.length]} 
            strokeWidth= {2}
            fill={this.colors[index%this.colors.length]} 
            fillOpacity={0.6}
            strokeOpacity={1}
            fontSize= "10px"
            dot={{fill:"white", stroke: this.colors[index%this.colors.length], strokeWidth: 2, fillOpacity:1 }}
            key={taskID}
            // label={(x) => this.props.extradata.find(item => item.taskId === taskID).indicators.find(item => item.indicator === x.name).label}
          >
          </Radar>
        )
      }
      <Tooltip formatter={this.tooltipFormatter} />
      {/* <Tooltip payload={this.replaceTooltipPayload} /> */}
      {/* <Tooltip content={this.renderTooltip} /> */}
      { (tasksID.length > 1) ? <Legend verticalAlign="bottom" verticalAnchor="start" fontSize="10px" margin={{ top: 10, right: 0, left: 0, bottom: 10 }} /> : '' }
    </RadarChart>
    );
  }
}
export default RadarRechartComponent;

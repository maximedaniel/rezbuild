    
/**
 * @class RadarRechart
 * @extends Component
 * @description Create the KPIs radar rechart part of the dashboard
 */
import React, { Component} from 'react';
import {Radar,  RadarChart, PolarGrid, PolarAngleAxis, LabelList, Legend, PolarRadiusAxis} from 'recharts';
class RadarRechartComponent extends Component {
  render() {
    if(this.props.data.length === 0) return <div/>;
    let minMark = 0;
    let maxMark = 1;
    let height = 300;
    let outerRadius = Math.round(height/3.);
    let seriesID = Object.keys(this.props.data[0]).filter(key => key!=='indicator');
    let colors = ["#F7921E", "#B9813F", "#A15B0A", "#FBAE56", "#FBC382"];
    return (
                <RadarChart  
                  outerRadius={outerRadius}
                  data={this.props.data}
                  width={this.props.parentWidth}
                  height={height}
                  margin={{ top: 0, right: 5, bottom: 0, left: 5}}
                  >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="indicator" fontSize= "10px" position="center" />
                  <PolarRadiusAxis angle={90} domain={[minMark, maxMark]} fontSize= "10px"/>
                  {
                    seriesID.map( (serieID, index) => 
                            <Radar isAnimationActive={false}
                                  name={this.props.parentTask.get(serieID)}
                                  dataKey={serieID} 
                                  stroke={colors[index%colors.length]} 
                                  strokeWidth= {2}
                                  fill={colors[index%colors.length]} 
                                  fillOpacity={0.6}
                                  strokeOpacity={1}
                                  fontSize= "10px"
                                  dot={{fill:"white", stroke: colors[index%colors.length], strokeWidth: 2, fillOpacity:1 }}
                                  key={serieID}
                              >
                                  {/* <LabelList  
                                   isAnimationActive={false}
                                    dataKey={serieID} 
                                    position="top"  
                                    angle="0"
                                    paintOrder = "stroke"
                                    fill="#f7931e"
                                    stroke= "white"
                                    strokeWidth= {2}
                                    strokeLinecap = "butt"
                                    strokeLinejoin = "miter"
                                    fontSize= "10px"
                                    fontWeight = "bold"
                                    strokeOpacity={(this.props.highlightedTask._id === serieID)?0.6:0.3} 
                                    fillOpacity={(this.props.highlightedTask._id === serieID)?1:0.5}
                                  /> */}
                          </Radar>
                      )
                  }
                  { (seriesID.length > 1) ? <Legend /> : '' }
                </RadarChart>
    );
  }
}
export default RadarRechartComponent;

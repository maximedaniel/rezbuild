    
/**
 * @class RadarRechart
 * @extends Component
 * @description Create the KPIs radar rechart part of the dashboard
 */
import React, { Component} from 'react';
import {Radar,  RadarChart, PolarGrid, PolarAngleAxis, LabelList, PolarRadiusAxis} from 'recharts';
class RadarRechartComponent extends Component {
  render() {
    if(this.props.data.length === 0) return <div/>;
    let minMark = 0;
    let maxMark = 1;
    let height = 300;
    let outerRadius = Math.round(height/3.);
    let seriesID = Object.keys(this.props.data[0]).filter(key => key!=='indicator')
    return (
                <RadarChart  
                  outerRadius={outerRadius}
                  data={this.props.data}
                  width={this.props.parentWidth}
                  height={height}
                  margin={{ top: 0, right: 5, bottom: 0, left: 5}}
                  >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="indicator" fontSize= "10px" 
                                    position="center" />
                  <PolarRadiusAxis angle={90} domain={[minMark, maxMark]} fontSize= "10px"/>
                  {
                    seriesID.map( serieID => 
                            <Radar isAnimationActive={false}
                                  name={serieID}
                                  dataKey={serieID} 
                                  stroke="#f7931e" 
                                  strokeWidth= {2}
                                  fill="#f7931e" 
                                  fillOpacity={(this.props.highlightedTask._id === serieID)?0.6:0.3} 
                                  strokeOpacity={(this.props.highlightedTask._id === serieID)?1:0.5}
                                  fontSize= "10px"
                                  dot={{fill:"white", stroke: "#f7931e", strokeWidth: 2, fillOpacity:(this.props.highlightedTask._id === serieID)?1:0.5 }}
                                  key={serieID}
                              >
                                  <LabelList  
                                   isAnimationActive={false}
                                    dataKey={serieID} 
                                    position="top"  
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
                                  />
                          </Radar>
                      )
                  }
                </RadarChart>
    );
  }
}
export default RadarRechartComponent;

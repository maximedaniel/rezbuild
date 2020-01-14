import React, { Component} from 'react';
import {Radar,  RadarChart, PolarGrid, PolarAngleAxis, LabelList, PolarRadiusAxis} from 'recharts';

class RadarRechartComponent extends Component {
  render() {
    let minMark = 0;
    let maxMark = Math.max(...this.props.series.map(serie => Math.max(...serie.data)));
    let height = 300;
    let outerRadius = Math.round(height/3.);
    return (
                <RadarChart  
                  outerRadius={outerRadius}
                  data={this.props.data}
                  width={this.props.parentWidth}
                  height={height}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5}}
                  >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category"/>
                  <PolarRadiusAxis angle={30} domain={[minMark, maxMark]} />
                  {
                    this.props.series.map( serie => 
                            <Radar isAnimationActive={false}
                                  name={serie.id}
                                  dataKey={serie.id} 
                                  stroke="#f7931e" 
                                  strokeWidth= {2}
                                  fill="#f7931e" 
                                  fillOpacity={(this.props.highlightedTask._id === serie.id)?0.6:0.3} 
                                  strokeOpacity={(this.props.highlightedTask._id === serie.id)?1:0.5}
                                  dot={{fill:"white", stroke: "#f7931e", strokeWidth: 2, fillOpacity:(this.props.highlightedTask._id === serie.id)?1:0.5 }}
                                  key={serie.id}
                              >
                                  <LabelList  
                                   isAnimationActive={false}
                                    dataKey={serie.id} 
                                    position="top"  
                                    paintOrder = "stroke"
                                    fill="#f7931e"
                                    stroke= "white"
                                    strokeWidth= {2}
                                    strokeLinecap = "butt"
                                    strokeLinejoin = "miter"
                                    fontSize= "10px"
                                    fontWeight = "bold"
                                    strokeOpacity={(this.props.highlightedTask._id === serie.id)?0.6:0.3} 
                                    fillOpacity={(this.props.highlightedTask._id === serie.id)?1:0.5}
                                  />
                          </Radar>
                      )
                  }
                </RadarChart>
    );
  }
}
export default RadarRechartComponent;

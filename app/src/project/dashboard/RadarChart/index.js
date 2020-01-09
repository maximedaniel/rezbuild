    
import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import chroma from 'chroma-js';

class RadarChartComponent extends Component {
      render(){
            let options;
            options = {
              chart: {
                type: 'radar',
              },
              /*dataLabels: {
                enabled: true,
                style: {
                    offsetY: '100px',
                    offsetX: '100px',
                    fontSize: '12px',
                    fontFamily: "'Exo 2', sans-serif",
                    cssClass: 'apexcharts-xaxis-label',
                },
                formatter: function (val, opts) {
                  return val.toFixed(2);
                }
              },
              grid: {
              padding: {
                  top:0,
                  right: 0,
                  bottom: 0,
                  left: 0,
              }, 
              },
              plotOptions: {
                radar: {
                  size: this.props.size,
                }
              },
              colors:  this.props.colors, 
              tooltip: {
                enabled: true,
                y: {
                  formatter: function(val) {
                    return val
                  }
                },
                style: {
                  fontSize: '12px',
                  fontFamily: "'Exo 2', sans-serif",
                },
              },*/
              xaxis: {
                categories: this.props.categories,
                labels: {
                  style: {
                      colors: [],
                      fontSize: '12px',
                      fontFamily: "'Exo 2', sans-serif",
                      cssClass: 'apexcharts-xaxis-label',
                  },
                }
              },
              yaxis: {
                tickAmount: 7,
                labels: {
                  formatter: function(val, i) {
                    if (i % 2 === 0) {
                      return val
                    } else {
                      return ''
                    }
                  },
                  style: {
                      colors: [],
                      fontSize: '12px',
                      fontFamily: "'Exo 2', sans-serif",
                      cssClass: 'apexcharts-xaxis-label',
                  },
                }
              }
            }

            return (
            <ReactApexChart options={options} series={this.props.series} type="radar" />
            );
    }
}

export default RadarChartComponent;
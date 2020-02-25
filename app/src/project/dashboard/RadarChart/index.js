    
/**
 * @class RadarChart
 * @extends Component
 * @description Create the KPIs radar chart part of the dashboard
 */
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
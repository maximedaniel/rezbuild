import React, { Component } from 'react';
import { Graph} from '@vx/network';
import * as d3 from 'd3';
import SocketContext from './SocketContext'
import Chart from "react-apexcharts";
var $ = window.$

class GraphCore extends Component {

    constructor(props){
        super(props)
        this.revisions = []
        this.state = {options:null, series:null}
    }

   select(config){
    var serie = this.state.series[config.seriesIndex]
    var revisionID = (config.dataPointIndex) ? serie.toRevisionID : serie.fromRevisionID
    var revision = this.props.revisions.filter((revision) => revision._id === revisionID)[0]
    this.props.setRevision(revision)
   }
   update(){
        console.log(this.props.revisions)
        var rootRevision = this.props.revisions.filter((revision) => (revision.prevLinks.length === 0))[0]
        var series = []
        series.push({
                name: 'init',
                taskID: '',
                fromRevisionID: rootRevision._id,
                toRevisionID: rootRevision._id,
                data: [[rootRevision.date, 0], [rootRevision.date, 0]]
        })

        var positionRevisions = ((series, revision, yOrigin, yHeight) => {
            var nextHeight = yHeight/revision.nextLinks.length
            revision.nextLinks.map((link, index) => {
                var nextRevision = this.props.revisions.filter((revision) => revision._id === link.revision)[0]
                var y = (yOrigin - yHeight/2) + (nextHeight * index + (nextHeight/2))
                series.push({
                name: link.task,
                taskID:link.task,
                fromRevisionID: revision._id,
                toRevisionID: nextRevision._id,
                data: [[new Date(revision.date), yOrigin], [new Date(revision.date), y], [new Date(nextRevision.date), y]]})
                positionRevisions(series, nextRevision, y, nextHeight)
             })
         })
         positionRevisions(series, rootRevision, 0, 100)

        var discrete = series.map((serie, index) => { return {
            seriesIndex: index,
            dataPointIndex: 1,
            fillColor: '#f7931e',
            strokeColor: '#f7931e',
            shape: 'square',
            size: 0
          }});

         this.setState({
          options: {
            chart: {
              id: "basic-bar",
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  this.select(config)
                }
              }
            },
            xaxis: {
              type: "datetime",
              labels: {
                format: 'HH:mm:ss, dd MMMM yyyy',
              }
            },
            yaxis: {
              min: -50,
              max: 50,
              range:[-50,50]
            },
            grid:{
                yaxis:{
                    lines:{
                        show:false,
                    }
                }
            },
            /*dataLabels: {
                enabled: true,
                position: 'top'
            },*/
            stroke: {
                curve: 'smooth',
                width: 4,
                dashArray: 0,
            },
            markers: {
              size: [8],
              colors: ['#f7931e'],
              discrete: discrete
            },
            colors: ['#f7931e'],
            tooltip: {
                intersect: true,
                shared: false
            },
          },
          series: series
        })
   }
    componentDidMount() {
        this.update()
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevState.revisions !== this.state.revisions) {
        this.update()
      }
      if (prevProps.revision !== this.props.revision){
        this.update()
      }
   }

    render(){
        return (
         <div className="mixed-chart">
            {(this.state.options && this.state.series) ? <Chart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="100%"
              height="250px"
            />: ''}
          </div>
        );
    }


}

const GraphComponent = props => (
  <SocketContext.Consumer>
  { (context) => <GraphCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default GraphComponent;
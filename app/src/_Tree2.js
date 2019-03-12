import React, { Component } from 'react';
import { Graph} from '@vx/network';

class Tree extends Component {

    constructor(props){
        super(props)
        this.nodes = []
        this.links = []
    }

    init(){
        var nodes = {
                'N1': {next: ['N2']},
                'N2': {next: ['N3','N4']},
                'N3': {next: ['N5']},
                'N4': {next: ['N6']},
                'N5': {next: []},
                'N6': {next: []},
            }
        var _nodes = []
        var _links = []
        function ascend(node_id, nodes, level, level_width, min_width, min_height, range_height){
            var node = nodes[node_id]
            var node_x = min_width + (level * level_width)
            var node_y = min_height + range_height/2
            _nodes.push({x: node_x, y: node_y})
            var step_height = range_height/node.next.length

            node.next.map((next_node_id, index) => {
                var next_min_height = min_height + index * step_height
                var next_max_height = min_height + (index + 1) * step_height
                var next_range_height = next_max_height-next_min_height
                var next_node_x = min_width + ((level+1) * level_width)
                var next_node_y = next_min_height + next_range_height/2

                _links.push({source : {x: node_x, y: node_y}, target: {x: next_node_x, y: next_node_y}})

                ascend(next_node_id, nodes, level+1, level_width, min_width, next_min_height, next_range_height)
            })
        }
        ascend('N1', nodes, 0, 100, 25, 0, this.props.parentHeight)
        console.log(_nodes)
        console.log(_links)
        this.nodes = _nodes
        this.links = _links
    }

   componentDidMount(){
   }

   /* update(heightMax, widthMax){
        function getAllRoot(nodes){
            var allRoot = []
            for (var _id in nodes){
                var _value = nodes[_id]
                    if(_value.prev === ''){
                    allRoot.push(_id)
                }
            }
            return allRoot
        }

        function tree(id, nodes, level, res){
            if (!res[level]) {res.push([])}
            for (var _id in nodes){
                var _value = nodes[_id]
                if(_value.prev === id){
                    res[level].push({source: id, target: _id})
                    tree(_id, nodes, level+1, res)
                }
            }
            return res
        }
        function draw(links, widthMin, widthMax, heightMin, HeightMax){
            for (var link in links){
                for (var i = 0; i<leafs.length; i++){
                var link = leafs[i]
                revisions[link.target].x = widthMax/res.length * (level+1)
                console.log(heightMax, widthMax, res.length, level)
                revisions[link.target].y = heightMax/(leafs.length+1) * (i+1)
                var source = revisions[link.source]
                var target = revisions[link.target]
                links.push({
                source : {x: source.x, y: source.y},
                target : {x: target.x, y: target.y}
                })
                nodes.push({x: target.x, y: target.y})
            }

            }

        }

        var revisions = {
            'Revision1': {prev: '', x: 0, y: 0},
            'Revision2': {prev: 'Revision1', x: 0, y: 0},
            'Revision3': {prev: 'Revision1', x: 0, y: 0},
            'Revision4': {prev: 'Revision3', x: 0, y: 0},
            'Revision5': {prev: 'Revision2', x: 0, y: 0},
            'Revision6': {prev: 'Revision5', x: 0, y: 0},
            }

        var nodes = [];
        var links = [];

        var allRoot = getAllRoot(revisions)
        allRoot.map( (root) => {
          var res = tree(root, revisions, 0, [])
          revisions[root].x = 0
          revisions[root].y = heightMax/2
          nodes.push({x:  revisions[root].x, y: revisions[root].y})
          for (var level = 0; level<res.length; level++){
            var leafs = res[level]
            for (var i = 0; i<leafs.length; i++){
                var link = leafs[i]
                revisions[link.target].x = widthMax/res.length * (level+1)
                console.log(heightMax, widthMax, res.length, level)
                revisions[link.target].y = heightMax/(leafs.length+1) * (i+1)
                var source = revisions[link.source]
                var target = revisions[link.target]
                links.push({
                source : {x: source.x, y: source.y},
                target : {x: target.x, y: target.y}
                })
                nodes.push({x: target.x, y: target.y})
            }
          }
        })
        console.log(nodes)
        console.log(links)

        return {
          nodes: nodes,
          links: links
        };
    }*/

    render(){
        let margin = {
            top: 0,
            left: 10,
            right: 10,
            bottom: 0
        }
        let heightMax = this.props.parentHeight - margin.top - margin.bottom;
        let widthMax = this.props.parentWidth - margin.left - margin.right;

        if(heightMax > 0 && widthMax > 0 && this.nodes.length === 0){
            this.init()
        }


      function DefaultLink({link}) {
          return (
            <line
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              strokeWidth={3}
              stroke= "#f7931e"
              strokeOpacity={1}
            />
          );
       }
      var self = this
      function DefaultNode({node}){
          return <circle
              r={8}
              fill="#fff"
              strokeWidth={3}
              stroke="#f7931e"
              strokeOpacity={1}
              onClick={ () => {node.selected= true; console.log(self.nodes)}}
              />;
      }
      return (
        <svg width={this.props.parentWidth} height={this.props.parentHeight} >
         { (this.nodes.length)? <Graph graph={{nodes:this.nodes, links:this.links}} size={[widthMax, heightMax]} linkComponent={DefaultLink} nodeComponent={DefaultNode} /> : ''}
        </svg>
      );
    }


}

export default Tree;
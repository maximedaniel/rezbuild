import React from 'react';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkHorizontal } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';
import { LinearGradient } from '@vx/gradient';

const orange = '#f7931e';
const bg = '#fff';
const white = '#fff';

const tree = {
  "name": "T",
  "children": [{
    "name": "A",
    "children": [
      { "name": "A1" },
      { "name": "A2" },
      { "name": "A3" },
      { "name": "C",
        "children": [{
          "name": "C1",
        }, {
          "name": "D",
          "children": [{
            "name": "D1"
          },{
            "name": "D2"
          },{
            "name": "D3"
          }]
        }]
      },
    ]},
    { "name": "Z" },
    {
    "name": "B",
    "children": [
      { "name": "B1"},
      { "name": "B2"},
      { "name": "B3"},
    ]},
  ],
};

function Node({ node }) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;
  if (isParent) return <ParentNode node={node} />;

  return (
    <Group top={node.x} left={node.y}>
      <circle
        r={8}
        fill={white}
        stroke={orange}
        strokeWidth={4}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}/>
      {/* <text
        dy={'.33em'}
        fontSize={12}
        fontFamily="'Exo 2', sans-serif"
        textAnchor={'middle'}
        fill={orange}
        style={{ pointerEvents: 'none' }}
      >
        {node.data.name}
      </text> */}
    </Group>
  );
}

function RootNode({ node }) {
  return (
    <Group top={node.x} left={node.y}>
      <circle
        r={8}
        fill={white}
        stroke={orange}
        strokeWidth={4}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}/>
      {/* <text
        dy={'.33em'}
        fontSize={9}
        fontFamily="'Exo 2', sans-serif"
        textAnchor={'middle'}
        style={{ pointerEvents: 'none' }}
        fill={orange}
        >
        {node.data.name}
      </text>*/}
    </Group>
  );
}

function ParentNode({ node }) {

  return (
    <Group top={node.x} left={node.y}>
      <circle
        r={8}
        fill={white}
        stroke={orange}
        strokeWidth={4}
        onClick={() => {
          alert(`clicked: ${JSON.stringify(node.data.name)}`);
        }}/>
    {/*
      <text
        dy={'.33em'}
        fontSize={9}
        fontFamily="Arial"
        textAnchor={'middle'}
        style={{ pointerEvents: 'none' }}
        fill={orange}
      >
        {node.data.name}
      </text>
    */}
    </Group>
  );
}

export default ({
 parentWidth,
 parentHeight,
 parentTop,
 parentLeft,
 parentRef,
 resizeParent,
  margin = {
    top: 0,
    left: 10,
    right: 10,
    bottom: 0
  }
}) => {
  const data = hierarchy(tree);
  const yMax = parentHeight - margin.top - margin.bottom;
  const xMax = parentWidth - margin.left - margin.right;

  return (

    <svg width={parentWidth} height={parentHeight}>
      <LinearGradient id="lg" from={white} to={orange} />
      <rect width={parentWidth} height={parentHeight} rx={14} fill={bg} fillOpacity={0}/>
      <Tree root={data} size={[yMax, xMax]}>
        {tree => {
          return (
            <Group top={margin.top} left={margin.left}>
              {tree.links().map((link, i) => {
                return (
                  <LinkHorizontal
                    key={`link-${i}`}
                    data={link}
                    stroke={orange}
                    strokeWidth={4}
                    fill="none"
                  />
                );
              })}
              {tree.descendants().map((node, i) => {
                return <Node key={`node-${i}`} node={node} />;
              })}
            </Group>
          );
        }}
      </Tree>
    </svg>
  );
};
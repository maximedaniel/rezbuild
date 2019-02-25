import React, { Component } from 'react'
import Board from 'react-trello'
import Tree from './Tree'
import CollaboratorListComponent from './CollaboratorListComponent'
import { ParentSize } from '@vx/responsive'
import SocketContext from './SocketContext'


const lanesStyle = {
    color:'#fff',
    backgroundColor:'#f7931e',
    fontFamily: 'Exo 2'
}

const cardStyle = {
    maxWidth:'50px',
    color:'#000',
    backgroundColor:'#fff',
    fontFamily: 'Exo 2'
}

class DashboardCore extends Component {

  constructor(props){
    super(props);
    this.state = {data: null}
    console.log(this.props.project)
  }

  handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails){
     console.log(cardId, sourceLaneId, targetLaneId, position, cardDetails)
  }
  componentDidMount(){
  const data = {
          lanes: [
            {
              id: 'lane1',
              title: 'BACKLOG',
              label: '2/2',
              cards: [
                {id: 'Card1', title: 'Manual preassessment',  description:'XXX',  cardStyle:cardStyle},
                {id: 'Card2', title: 'Auto preassessment', description:'XXX', cardStyle:cardStyle},
                {id: 'Card3', title: 'Update needs', description:'XXX', cardStyle:cardStyle},
                {id: 'Card4', title: 'Upload IS model', description:'XXX', cardStyle:cardStyle},
                {id: 'Card5', title: 'Upload TO-BE model', description:'XXX', cardStyle:cardStyle}
              ],
              style: lanesStyle
            },
            {
              id: 'lane2',
              title: 'TO DO',
              label: '0/0',
              cards: [],
              style: lanesStyle
            },
            {
              id: 'lane3',
              title: 'IN PROGRESS',
              label: '0/0',
              cards: [],
              style: lanesStyle
            },
            {
              id: 'lane4',
              title: 'DONE',
              label: '0/0',
              cards: [],
              style: lanesStyle
            }
          ]
        }
   this.setState({data:data});
  }


  render() {
        return  (
           <div>
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
                 <div className="row transparent"  style={{marginBottom:0}}>
                      <div className="col s12 m3 l3 transparent">
                            <h5 className="rezbuild-text">Collaborators</h5>
                             <div className="divider rezbuild"></div>
                             <div className="section" style={{height:'300px', paddingBottom:0}}>
                                <CollaboratorListComponent project={this.props.project} params={this.props.params}/>
                             </div>
                      </div>
                      <div className="col s12 m9 l9 transparent">
                                <h5 className="rezbuild-text">Board</h5>
                                 <div className="divider rezbuild"></div>
                                 <div className="section" style={{height:'300px', paddingBottom:0}}>
                                  <ParentSize>
                                    {parent => (
                                      <Tree
                                        parentWidth={parent.width}
                                        parentHeight={parent.height}
                                        parentTop={parent.top}
                                        parentLeft={parent.left}
                                        // this is the referer to the wrapper component
                                        parentRef={parent.ref}
                                        // this function can be called inside MySuperCoolVxChart to cause a resize of the wrapper component
                                        resizeParent={parent.resize}
                                      />
                                     )}
                                  </ParentSize>
                                 </div>
                      </div>
                 </div>
             </div>
             <div className="section" style={{marginLeft:'2%', marginRight:'2%', paddingBottom:0, paddingTop:'0.2rem'}}>
              <div className='row'   style={{marginBottom:0}}>
                 <div className="col s12 transparent">
                                <h5 className="rezbuild-text">Task</h5>
                                 <div className="divider rezbuild"></div>
                                 <div className="section">
                                    { (this.state.data) ?
                                        <Board data={this.state.data} style={
                                            {padding: '0',
                                            backgroundColor:'transparent',
                                            fontFamily: 'Exo 2'}
                                        }
                                        draggable
                                        handleDragEnd={this.handleDragEnd}/>
                                     : '' }
                                 </div>
                 </div>
              </div>
             </div>
         </div>
        );
    }
}

const DashboardComponent = props => (
  <SocketContext.Consumer>
  {socket => <DashboardCore {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default DashboardComponent;
import React, { Component } from 'react'
import Board from 'react-trello'


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

class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {data: null}
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
             <div className="section"  style={{marginLeft:'2%', marginRight:'2%'}}>
                 <div className="row">
                      <div className="col s3 white">
                            <h5 className="rezbuild-text">Collaborators</h5>
                             <div className="divider rezbuild"></div>
                             <div className="section">
                                Test
                             </div>
                      </div>
                      <div className="col s9 white">
                                <h5 className="rezbuild-text">Board</h5>
                                 <div className="divider rezbuild"></div>
                                 <div className="section">
                                 </div>
                      </div>
                 </div>
             </div>
             <div className="section" style={{marginLeft:'2%', marginRight:'2%'}}>
              <div className='row'>
                 <div className="col s12 white">
                                <h5 className="rezbuild-text">Task</h5>
                                 <div className="divider rezbuild"></div>
                                 <div className="section">
                                    { (this.state.data) ?
                                        <Board data={this.state.data} style={
                                            {padding: '0',
                                            backgroundColor:'transparent',
                                            fontFamily: 'Exo 2'}
                                        } draggable/>
                                     : '' }
                                 </div>
                 </div>
              </div>
             </div>
         </div>
        );
    }
}
export default Dashboard;
/**
 * @class TechnologyLibrary
 * @extends Component
 * @description Create the technology library page
 */
import React, { Component } from 'react'
import SocketContext from '../SocketContext'
import Select from 'react-select'
import chroma from 'chroma-js'
var $ = window.$;

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? '#f7931e' : 'white'
    }),
    control: (provided, state) => ({
      ...provided,
      marginTop: 0,
      border: '4px solid #f7931e',
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': {
          border: '4px solid #f7931e',
          borderRadius: 0,
      }
    }),
    multiValue: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: '#f7931e',
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        backgroundColor: '#f7931e',
        color: 'white'
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
          backgroundColor: '#f7931e',
          color: 'white',
        ':hover': {
          backgroundColor: '#f7931e',
          color: 'white',
        },
      }),
  }

class TechnologyLibraryCore extends Component {

  constructor(props){
      super(props);
      this.state = {technologies:[], selectedCategories: []};
      this.fetch = this.fetch.bind(this);
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedCategories){
    this.setState({selectedCategories:selectedCategories?selectedCategories:[]});
  }
  
  fetch(){
     var technologies = [
        {category: 'INSULATION', family: 'Air Tighness', company: 'PLACO', name:'Air Tightness Gypsum'},
        {category: 'INSULATION', family: 'Aerogel',  company: 'PLACO', name:'Insulating Gypsum'},
        {category: 'INSULATION', family: 'Placotherm',  company: 'PLACO', name:'Ventilated Facade Placotherm'},
        {category: 'HVAC', family: 'Radiant Floor', company: 'EXPLODED View', name:'HP Radiant Floor Pactherm'},
        {category: 'HVAC', family: 'Heat Pump', company: 'UNOTT', name:'Solar Assisted Heat Pump'},
        {category: 'RENEWABLES', family: 'Photovoltaic Panels', company: 'ONYX', name:'Amorphous Silicon PV Glass'},
        {category: 'RENEWABLES', family: 'Photovoltaic Panels', company: 'ONYX', name:'Christalline PV Glass'},
        {category: 'FACADE', family: 'Additive Manufacturing', company: 'VIAS', name:'3D Printing Facade'},
        {category: 'BEMS', family: 'Advanced BEMS', company: 'MAETRICS', name:'SmartBox'}
    ]

    var allCategories =  [...new Set(technologies.map(item => item.category))]
    .map(category => {
        return { value: category, label: category }
    });
    this.setState({
        technologies:technologies, selectedCategories:allCategories
    })
  }

  componentDidMount() {
      this.fetch();
      $(document).ready(function() {
        //M.FormSelect.init($('#roles'), {});
        $('select').material_select();
      });
  }




  render() {
    var allCategories =  [...new Set(this.state.technologies.map(item => item.category))]
    .map(category => {
        return { value: category, label: category }
    });
    return (
    <div className="row" style={{paddingTop:'8vh'}}>
          <div className="col push-s1 s10 center transparent" style={{padding:'0rem'}}>
              <div className="col s12 center white">
                <div className="col s12 rezbuild">
                <img src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} />
                </div>
                    <Select
                    styles={customStyles}
                    options={allCategories}
                    value={this.state.selectedCategories}
                    onChange={this.handleChange}
                    isMulti
                    />
              </div>
              <div className="col s12" style={{padding:'0.5rem'}}>
                  {
                      this.state.technologies.filter(item => 
                        this.state.selectedCategories.filter(category => category.value === item.category).length
                      )
                      .map(item => 
                        <div key={item.name} className="col s12 m6 l4" style={{padding:'0.5rem'}}>
                            <div className="col s12  z-depth-1"  style={{padding:0}}>
                                <div className="col s12 white rezbuild-text">
                                    <h6>
                                        <b>{item.name}</b>
                                     </h6>
                                    <h6>{item.company}
                                    </h6>
                                    <span className="new badge left " data-badge-caption="" style={{borderRadius:0, marginLeft:0}}>{item.category}</span>
                                    <span className="new badge left rezbuild-text white" style={{marginLeft:0, borderStyle: 'solid', borderRadius:0, lineHeight:'16px'}} data-badge-caption=""><b>{item.family}</b></span>
                                </div>
                                <div className='col s12 center white'>
                                    <img className="responsive-img"
                                    alt={"img/jpg/" + item.company.split(' ').join('') + '-'+item.name.split(' ').join('') + '.jpg'}
                                    src={"img/jpg/" + item.company.split(' ').join('') + '-'+item.name.split(' ').join('') + '.jpg' }
                                    />
                                </div>
                                <div className="col s12  white" style={{paddingBottom:'1rem'}}>
                                    <a className="waves-effect waves-light btn white-text tooltipped"
                                    href={window.location.protocol + "//" + this.props.host + "/zip/"+ item.company.split(' ').join('') + '-'+item.name.split(' ').join('') + '.zip'}>  
                                    <i className="material-icons white-text left">cloud_download</i>Download</a>
                                </div>
                            </div>
                        </div>
                        )
                  }
             </div>
          </div>
    </div>
    );
 }
}


const TechnologyLibraryComponent = props => (
    <SocketContext.Consumer>
    { (context) => <TechnologyLibraryCore {...props} host={context.host} socket={context.socket} uploader={context.uploader} />}
    </SocketContext.Consumer>
  )
  export default TechnologyLibraryComponent;
import React, { Component } from 'react'

var $ = window.$

class TechnologyLibraryComponent extends Component {

  constructor(props){
      super(props);
      this.state = {technologies:[]};
      this.fetch = this.fetch.bind(this);
  }
  
  fetch(){
    this.setState({
        technologies: [
            {technology: 'Insulation', company: 'PLACO', name:'Air Tightness Gypsum'},
            {technology: 'Insulation', company: 'PLACO', name:'	Insulating gypsum (aerogel)'},
            {technology: 'Insulation', company: 'PLACO', name:'Ventilated façade Placotherm® V 60mm MW (104.5 mm façade)'},
            {technology: 'Insulation', company: 'PLACO', name:'Ventilated façade Placotherm® V 80mm MW'},
            {technology: 'Insulation', company: 'PLACO', name:'Ventilated façade Placotherm® V 120mm MW (150 mm façade)'},
            {technology: 'BIPV', company: 'Onyx', name:'Lightweight Flexible shape BIPV based on composite material'},
            {technology: 'BIPV', company: 'Onyx', name:'Plug and Play BIPV'},
            {technology: '3D Printing', company: 'VIAS/CARTIF', name:'3D REZBUILD Façade printer'},
            {technology: 'SAHP', company: 'UNOTT', name:'	Solar Assisted Heat Pump System'},
        ]
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
    return (
    <div className="row" style={{paddingTop:'8vh'}}>
          <div className="col push-s1 s10 center white z-depth-1" style={{padding:'0rem'}}>
              <div className="col s12 center rezbuild">
                <img src="/img/jpg/logo.jpg" alt='logo' style={{maxHeight:'4rem'}} />
              </div>
              <div className="col s12" style={{padding:'0.5rem'}}>
                  {
                      this.state.technologies.map(item => 
                        <div class="col s4" style={{padding:'0.5rem'}}>
                            <div class="col s12 z-depth-1"  style={{padding:0}}>
                                <div class="col s12 white rezbuild-text">
                                    <h6><b>{item.name}</b></h6>
                                    <h6>{item.company}</h6>
                                </div>
                                <div className='col s12 center white'>
                                    <iframe
                                    title="ASIS MODEL VIEWER"
                                    width="100%"
                                    height="352px"
                                    src={window.location.protocol + "//" + this.props.host + "/Rezbuild/Visualize/" /*+ selectedTask._id + "_" + selectedTask.values[0].split('.ifc')[0]*/}
                                    frameBorder="0"
                                    allowFullScreen
                                    >
                                    </iframe>
                                    {/*<a className="btn rezbuild col s2 right-align tooltipped" data-position="top" data-tooltip="Download"
                                    style={{position:"absolute", top:"10px", right:"10px"}}
                                    
                                    href={window.location.protocol + "//" + this.props.host + "/" + selectedTask._id + "/" + selectedTask.values[0]} >
                                    <i className="material-icons white-text">cloud_download</i>
                                    </a>*/}
                                </div>
                                <div class="col s12  white" style={{marginBottom:'0.5rem'}}>
                                    <a className="waves-effect waves-light btn white-text tooltipped"
                                    href={window.location.protocol + "//" + this.props.host + "/" /*selectedTask._id + "/" + selectedTask.values[0]*/}>  
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


export default TechnologyLibraryComponent;

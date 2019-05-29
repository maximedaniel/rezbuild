import React, { Component } from 'react'

var $ = window.$

class TechnologyLibraryComponent extends Component {
    
  componentDidMount() {
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
              <div className="col s12 center" style={{padding:'0.5rem'}}>
              <table className="col s12 center">
               <thead className='rezbuild-text'>
                <tr style={{borderBottom: '2px solid #f7931e'}}>
                    <th>Technology</th>
                    <th>Manufacturer Company</th>
                    <th>Product Name</th>
                </tr>
              </thead>
              <tbody className='black-text'>
                <tr>
                    <td>Insulation</td>
                    <td>PLACO</td>
                    <td>Air Tightness Gypsum</td>
                </tr>
                <tr>
                    <td>Insulation</td>
                    <td>PLACO</td>
                    <td>Insulating gypsum (aerogel)</td>
                </tr>
                <tr>
                    <td>Insulation</td>
                    <td>PLACO</td>
                    <td>Ventilated façade Placotherm® V 60mm MW (104.5 mm façade)</td>
                </tr>
                <tr>
                    <td>Insulation</td>
                    <td>PLACO</td>
                    <td>Ventilated façade Placotherm® V 80mm MW</td>
                </tr>
                <tr>
                    <td>Insulation</td>
                    <td>PLACO</td>
                    <td>Ventilated façade Placotherm® V 120mm MW (150 mm façade)</td>
                </tr>
                <tr>
                    <td>BIPV</td>
                    <td>Onyx</td>
                    <td>Lightweight Flexible shape BIPV based on composite material</td>
                </tr>
                <tr>
                    <td>BIPV</td>
                    <td>Onyx</td>
                    <td>Plug and Play BIPV</td>
                </tr>
                <tr>
                    <td>3D Printing</td>
                    <td>VIAS/CARTIF</td>
                    <td>3D REZBUILD Façade printer</td>
                </tr>
                <tr>
                    <td>SAHP</td>
                    <td>UNOTT</td>
                    <td>Solar Assisted Heat Pump System</td>
                </tr>
              </tbody>
            </table>
             </div>
          </div>
    </div>
    );
 }
}


export default TechnologyLibraryComponent;

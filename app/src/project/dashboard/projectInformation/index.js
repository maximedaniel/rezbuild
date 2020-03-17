/**
 * @class ProjectInformation
 * @extends Component
 * @description Create the project information part of the dashboard
 */
import React, { Component } from 'react'
import SocketContext from '../../../SocketContext'

var $ = window.$

class ProjectInformationCore extends Component {

  constructor(props){
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {project : null,  error : false, pending : false}
  }
  
   // Update the project
  submit(event){
    event.preventDefault();
     this.setState({error : false, pending : true}, () => {
         var filter = {_id: this.props.project._id}
         var update = {}
         Object.keys(this.refs).forEach(key => {
           var value = this.refs[key].value
           if(value === "on") value = $('#'+key).is(':checked')
           update[key] = value
           }
         );
         this.props.socket.emit('/api/project/update', filter, update, res => {
             if (res.projects){
                this.setState({project : res.projects[0], error : false, pending : false});
             }
             if (res.error) {
                 this.setState({project : null, error : res.error, pending : false});
             }
         });
     })
   };

  fetch(){
    this.setState({users : null, error : false, pending : true}, () => {
        var filter = {_id: this.props.project._id }
        this.props.socket.emit('/api/project/get', filter, res => {
            if(res.projects){
                this.setState({project : res.projects[0], error : false, pending : false});
            }
            if(res.error){
                this.setState({project : null, error : false, pending : false});
            }
        });
    })
  }

  componentDidMount() {
    $(document).ready(() => {
        $('#projectInformation').tabs('select_tab', 'general');
        $('select').material_select();
    });
    this.fetch();
    this.props.socket.on('/api/project/done', res => {
        this.fetch()
     });
  }
  componentDidUpdate(prevState) {
    if (this.state.project !== prevState.project) {
        $('#projectInformation').tabs('select_tab', 'general');
        $('select').material_select();
      }
  }
  render() {
      var saveButton = 
      <div className="input-field col s12 center" style={{paddingBottom:'1rem'}}>
          <button className="btn waves-effect waves-light" type="submit"><i className="material-icons right">save</i>SAVE</button>
      </div>
      var generalInformation;
      if(this.state.project){
            generalInformation =
            <div className="section col s12 white z-depth-1">
                    <h5 className="rezbuild-text col s12">General</h5>
                    <div className="input-field col s4">
                        <input  required id="name" type="text"  ref="name" defaultValue={this.state.project.name}/>
                        <label className="active" htmlFor="name">Name</label>
                    </div>

                    <div className="input-field col s8">
                        <input  required id="address" type="text"  ref="address" defaultValue={this.state.project.address}/>
                        <label className="active" htmlFor="address">Address</label>
                    </div>

                    <div className="input-field col s6">
                        <input  required id="city" type="text"  ref="city"  defaultValue={this.state.project.city}/>
                        <label className="active" htmlFor="city">City</label>
                    </div>

                    <div className="input-field col s6">
                        <input  required id="country" type="text"  ref="country" defaultValue={this.state.project.country}/>
                        <label className="active" htmlFor="country">Country</label>
                    </div>

                    <div className="input-field col s4">
                    <select  required defaultValue={this.state.project.context} id="context" ref="context">
                        <option value="" >Choose a context</option>
                        <option name="context" value="City center" id="context_city_center">City center</option>
                        <option name="context" value="Suburbs" id="context_suburbs">Suburbs</option>
                        <option name="context" value="Isolated" id="context_isolated">Isolated</option>
                    </select>
                    <label>Context</label>
                    </div>

                    <div className="input-field col s4">
                        <input  required id="degree"  ref="degree" type="number" step="any" defaultValue={this.state.project.degree} />
                        <label  className="active" htmlFor="degree"> Degree Days (°)</label>
                    </div>

                    <div className="input-field col s4">
                        <select  required defaultValue={this.state.project.climat} id="climat" ref="climat">
                            <option value="" >Choose a climat zone</option>
                            <option name="context" value="Tropical zone" id="climat_tropical">Tropical zone</option>
                            <option name="context" value="Subtropical zone" id="climat_subtropical">Subtropical zone</option>
                            <option name="context" value="Temperate zone" id="climat_temperate">Temperate zone</option>
                            <option name="context" value="Cold zone" id="climat_cold">Cold zone</option>
                        </select>
                        <label>Climat Zone</label>
                    </div>
                    {saveButton}
            </div>
      }
      var needsInformation;
      if(this.state.project){
            needsInformation =
            <div className="section col s12 white z-depth-1" style={{marginTop:'2rem'}}>
            <h5 className="rezbuild-text col s12">Needs</h5>
                    <div className="input-field col s12">
                                <textarea  id="refurbishmentExpectations" ref="refurbishmentExpectations" className="materialize-textarea" defaultValue={this.state.project.refurbishmentExpectations} ></textarea>
                                <label className="active" htmlFor="refurbishmentExpectations">Refurbishment Project Expectations</label>
                    </div>
                    <div className="input-field col s12 m6">
                            <p className="range-field">
                                <input  type="range" id="energyConsumptionExpectations" ref="energyConsumptionExpectations" min="0" max="100"  defaultValue={this.state.project.energyConsumptionExpectations}/>
                                <label htmlFor="energyConsumptionExpectations">Energy Consumption Expectations</label>
                            </p>
                    </div>
                    <div className="input-field col s12 m6">
                            <p className="range-field">
                                <input  type="range" id="environmentalExpectations" ref="environmentalExpectations" min="0" max="100"  defaultValue={this.state.project.environmentalExpectations}/>
                                <label htmlFor="environmentalExpectations">Environmental Expectations</label>
                            </p>
                    </div>
                    <div className="input-field col s12 m6">
                            <p className="range-field">
                                <input  type="range" id="economicalExpectations" ref="economicalExpectations" min="0" max="100"  defaultValue={this.state.project.economicalExpectations}/>
                                <label htmlFor="economicalExpectations">Economical Expectations</label>
                            </p>
                    </div>
                    <div className="input-field col s12 m6">
                            <p className="range-field">
                                <input  type="range" id="socialExpectations" ref="socialExpectations" min="0" max="100"  defaultValue={this.state.project.socialExpectations}/>
                                <label htmlFor="socialExpectations">Social Expectations</label>
                            </p>
                    </div>
                    <div className="input-field col s12 m6">
                            <p className="range-field">
                                <input  type="range" id="comfortExpectations" ref="comfortExpectations" min="0" max="100"  defaultValue={this.state.project.comfortExpectations}/>
                                <label htmlFor="comfortExpectations">Comfort Expectations</label>
                            </p>
                    </div>
                    <div className="input-field col s12">
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="homeDuringRenovation" ref="homeDuringRenovation"  defaultChecked={this.state.project.homeDuringRenovation}/>
                        <label htmlFor="homeDuringRenovation">Don't leave home during renovation</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="differentLocationDuringRenovation" ref="differentLocationDuringRenovation"  defaultChecked={this.state.project.differentLocationDuringRenovation}/>
                        <label htmlFor="differentLocationDuringRenovation">Have a different location during renovation</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="elevatorInstallation" ref="elevatorInstallation" defaultChecked={this.state.project.elevatorInstallation}/>
                        <label htmlFor="elevatorInstallation">Elevator Installation</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="improvedAccessibility" ref="improvedAccessibility" defaultChecked={this.state.project.improvedAccessibility}/>
                        <label  htmlFor="improvedAccessibility">Improved Accessibility</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="reductionBillAmount" ref="reductionBillAmount" defaultChecked={this.state.project.reductionBillAmount}/>
                        <label  htmlFor="reductionBillAmount">Reduction in bills amount</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="moreHomeSpaces" ref="moreHomeSpaces"  defaultChecked={this.state.project.moreHomeSpaces}/>
                        <label  htmlFor="moreHomeSpaces">More home spaces</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="brighterEnvironments" ref="brighterEnvironments" defaultChecked={this.state.project.brighterEnvironments}/>
                        <label  htmlFor="brighterEnvironments">Brighter environments</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="extraServiceRoom" ref="extraServiceRoom"  defaultChecked={this.state.project.extraServiceRoom}/>
                        <label  htmlFor="extraServiceRoom">Extra service room</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="heatingUpgrading" ref="heatingUpgrading"  defaultChecked={this.state.project.heatingUpgrading}/>
                        <label  htmlFor="heatingUpgrading">Heating upgrading</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="coolingUpgrading" ref="coolingUpgrading"  defaultChecked={this.state.project.coolingUpgrading}/>
                        <label  htmlFor="coolingUpgrading">Cooling upgrading</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="ventilationUpgrading" ref="ventilationUpgrading" defaultChecked={this.state.project.ventilationUpgrading}/>
                        <label  htmlFor="ventilationUpgrading">Ventilation upgrading</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="consumptionControl" ref="consumptionControl" defaultChecked={this.state.project.consumptionControl}/>
                        <label  htmlFor="consumptionControl">Consumption control</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="eliminitationAirInfiltration" ref="eliminitationAirInfiltration" defaultChecked={this.state.project.eliminitationAirInfiltration}/>
                        <label  htmlFor="eliminitationAirInfiltration">Elimination of air infiltration</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="shadingUpgrading" ref="shadingUpgrading" defaultChecked={this.state.project.shadingUpgrading}/>
                        <label  htmlFor="shadingUpgrading">Shading upgrading</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="airQualityImprovement" ref="airQualityImprovement" defaultChecked={this.state.project.airQualityImprovement}/>
                        <label  htmlFor="airQualityImprovement">Air quality improvement</label>
                        </p>
                        <p className="col s12 m6 s4">
                        <input  type="checkbox" id="noiseReduction" ref="noiseReduction" defaultChecked={this.state.project.noiseReduction}/>
                        <label  htmlFor="noiseReduction">Noise reduction</label>
                        </p>
                    </div>
                    {saveButton}
            </div>
      }

      var buildingInformation;
      if(this.state.project){
        buildingInformation =
        <div className="section col s12 white z-depth-1"  style={{marginTop:'2rem'}}>
                    <h5 className="rezbuild-text col s12">Building</h5>
                    <div className="input-field col s2">
                    <select  required id="exposure" ref="exposure"  defaultValue={this.state.project.exposure}>
                        <option value="" >Choose an exposure</option>
                        <option name="exposure" value="N" id="exposure_n">N</option>
                        <option name="exposure" value="NE" id="exposure_ne">NE</option>
                        <option name="exposure" value="E" id="exposure_e">E</option>
                        <option name="exposure" value="SE" id="exposure_se">SE</option>
                        <option name="exposure" value="S" id="exposure_s">S</option>
                        <option name="exposure" value="SW" id="exposure_sw">SW</option>
                        <option name="exposure" value="W" id="exposure_w">W</option>
                        <option name="exposure" value="NW" id="exposure_nw">NW</option>
                    </select>
                    <label>Exposure</label>
                    </div>
                    <div className="input-field col s4">
                    <select  required  defaultValue={this.state.project.home} id="home" ref="home">
                        <option value="" >Choose an home type</option>
                        <option name="exposure" value="House" id="home_house">House</option>
                        <option name="exposure" value="Apartment" id="home_apartment">Apartment</option>
                        </select>
                    <label>Home Type</label>
                    </div>
                    <div className="input-field col s3">
                        <input  id="year" type="number" step="any"  ref="year"  defaultValue={this.state.project.year}/>
                        <label className="active" htmlFor="year">Construction year</label>
                    </div>
                    <div className="input-field col s6">
                    <select  required  defaultValue={this.state.project.gradation} id="gradation" ref="gradation">
                        <option value="" >Choose a color gradation of external finish</option>
                        <option name="gradation" value="Light" id="gradation_light">Light</option>
                        <option name="gradation" value="Average" id="gradation_average">Average</option>
                        <option name="gradation" value="Dark" id="gradation_dark">Dark</option>
                        </select>
                    <label>Color Gradation of External Finish</label>
                    </div>
                    <div className="input-field col s6">
                    <select  required defaultValue={this.state.project.property} id="property" ref="property">
                        <option value="" >Property</option>
                        <option name="property" value="Private" id="property_private">Private</option>
                        <option name="property" value="Public" id="property_public">Public</option>
                        </select>
                    <label>property</label>
                    </div>
                    <div className="input-field col s12">
                        <input  id="buildingTaxonomy" type="text"  ref="buildingTaxonomy" defaultValue={this.state.project.buildingTaxonomy}/>
                        <label className="active" htmlFor="buildingTaxonomy">Building Taxonomy</label>
                    </div>
                    {saveButton}
            </div>

      }
      var geometryInformation;
      if(this.state.project){
            geometryInformation =
            <div className="section col s12 white z-depth-1"  style={{marginTop:'2rem'}}>
                <h5 className="rezbuild-text col s12">Geometry</h5>
                <div className="input-field col s6 m4">
                    <input  required id="floors"  ref="floors" type="number" step="any" defaultValue={this.state.project.floors} />
                    <label  className="active" htmlFor="floors"> Number of floors (n°)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="interFloorHeight"  ref="interFloorHeight" type="number" step="any" defaultValue={this.state.project.interFloorHeight}/>
                    <label  className="active" htmlFor="interFloorHeight"> Clear inter-floor height (m)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="floorNumber"  ref="floorNumber" type="number" step="any" defaultValue={this.state.project.floorNumber} />
                    <label  className="active" htmlFor="floorNumber">Floor number (n°) (if apartment)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="apartmentByFloor"  ref="apartmentByFloor" type="number" step="any" defaultValue={this.state.project.apartmentByFloor}/>
                    <label  className="active" htmlFor="apartmentByFloor">Number of apartments per floor (n°) (if apartment)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="totalFloorsBuilding"  ref="totalFloorsBuilding" type="number" step="any" defaultValue={this.state.project.totalFloorsBuilding}/>
                    <label  className="active" htmlFor="totalFloorsBuilding">Total floors of the building (n°)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="footprintBuilding"  ref="footprintBuilding" type="number" step="any" defaultValue={this.state.project.footprintBuilding}/>
                    <label  className="active" htmlFor="footprintBuilding">Net footprint of building (m²)</label>
                </div>
                <div className="input-field col s6 m4">
                    <input  required id="totalUsefulSurface"  ref="totalUsefulSurface" type="number" step="any" defaultValue={this.state.project.totalUsefulSurface}/>
                    <label  className="active" htmlFor="totalUsefulSurface">Total useful surface (m²)</label>
                </div>
                <h6 className="grey-text col s12">Linear dimension divided by exposure</h6>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionN"  ref="linearDimensionN" type="number" step="any" defaultValue={this.state.project.linearDimensionN}/>
                    <label  className="active" htmlFor="linearDimensionN">N (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionNE"  ref="linearDimensionNE" type="number" step="any" defaultValue={this.state.project.linearDimensionNE}/>
                    <label  className="active" htmlFor="linearDimensionNE">NE (m)</label>
                </div>

                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionE"  ref="linearDimensionE" type="number" step="any" defaultValue={this.state.project.linearDimensionE}/>
                    <label  className="active" htmlFor="linearDimensionE">E (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionSE"  ref="linearDimensionSE" type="number" step="any" defaultValue={this.state.project.linearDimensionSE}/>
                    <label  className="active" htmlFor="linearDimensionSE">SE (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionS"  ref="linearDimensionS" type="number" step="any" defaultValue={this.state.project.linearDimensionS}/>
                    <label  className="active" htmlFor="linearDimensionS">S (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionSW"  ref="linearDimensionSW" type="number" step="any" defaultValue={this.state.project.linearDimensionSW}/>
                    <label  className="active" htmlFor="linearDimensionSW">SW (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionW"  ref="linearDimensionW" type="number" step="any" defaultValue={this.state.project.linearDimensionW}/>
                    <label  className="active" htmlFor="linearDimensionW">W (m)</label>
                </div>
                <div className="input-field col s2 m1">
                    <input  required id="linearDimensionNW"  ref="linearDimensionNW" type="number" step="any" defaultValue={this.state.project.linearDimensionNW}/>
                    <label  className="active" htmlFor="linearDimensionNW">NW (m)</label>
                </div>

                <div className="input-field col s12">
                <select  required defaultValue={this.state.project.floorAdjacent} id="floorAdjacent" ref="floorAdjacent">
                    <option value="" >Choose floor adjacent to the unheated room</option>
                    <option name="floorAdjacent" value="Ground" id="floor_adjacent_ground">Ground</option>
                    <option name="floorAdjacent" value="Cellar" id="floor_adjacent_cellar">Cellar/Garage</option>
                    <option name="floorAdjacent" value="External" id="floor_adjacent_external">External</option>
                    <option name="floorAdjacent" value="Land" id="floor_adjacent_land">Land/Cellar</option>
                    <option name="floorAdjacent" value="Outside" id="floor_adjacent_outside">Cellar/Outside</option>
                    </select>
                <label>Floor adjacent to the unheated room</label>
                </div>
                <div className="input-field col s12">
                <select  required defaultValue={this.state.project.ceilingAdjacent} id="ceilingAdjacent" ref="ceilingAdjacent">
                    <option value="" >Choose ceiling adjacent to the unheated room</option>
                    <option name="ceilingAdjacent" value="Attic" id="ceiling_adjacent_attic">Attic</option>
                    <option name="ceilingAdjacent" value="External" id="ceiling_adjacent_external">External</option>
                    <option name="ceilingAdjacent" value="AtticExternal" id="ceiling_adjacent_attic_external">Attic/External</option>
                    </select>
                <label>Ceiling adjacent to the unheated room</label>
                </div>
                <div className="input-field col s12">
                <select  required defaultValue={this.state.project.wallAdjacent} id="wallAdjacent" ref="wallAdjacent">
                    <option value="" >Choose walls adjacent to the unheated room</option>
                    <option name="wallAdjacent" value="Internal stairwell (only one facing)" id="wall_adjacent_internal_one_face">Internal stairwell (only one facing)</option>
                    <option name="wallAdjacent" value="Internal stairwell (no facing)" id="wall_adjacent_internal_no_face">Internal stairwell (no facing)</option>
                    <option name="wallAdjacent" value="External stairwell" id="wall_adjacent_external">External stairwell</option>
                    <option name="wallAdjacent" value="Other unheated rooms" id="wall_adjacent_other">Other unheated rooms</option>
                    </select>
                <label>Walls adjacent to the unheated room</label>
                </div>
                    {saveButton}
            </div>
      }
      var envelopeInformation;
      if(this.state.project){
        envelopeInformation =
        <div className="section col s12 white z-depth-1"  style={{marginTop:'2rem'}}>
                <h5 className="rezbuild-text col s12">Envelope</h5>
                <h6 className="grey-text col s12">Number of windows wings</h6>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsN"  ref="windowsN" type="number" step="any" defaultValue={this.state.project.windowsN}/>
                    <label  className="active" htmlFor="windowsN">N (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsNE"  ref="windowsNE" type="number" step="any" defaultValue={this.state.project.windowsNE}/>
                    <label  className="active" htmlFor="windowsNE">NE (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsE"  ref="windowsE" type="number" step="any" defaultValue={this.state.project.windowsE}/>
                    <label  className="active" htmlFor="windowsE">E (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsSE"  ref="windowsSE" type="number" step="any" defaultValue={this.state.project.windowsSE}/>
                    <label  className="active" htmlFor="windowsSE">SE (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsS"  ref="windowsS" type="number" step="any" defaultValue={this.state.project.windowsS}/>
                    <label  className="active" htmlFor="windowsS">S (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsSW"  ref="windowsSW" type="number" step="any" defaultValue={this.state.project.windowsSW}/>
                    <label  className="active" htmlFor="windowsSW">SW (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsW"  ref="windowsW" type="number" step="any" defaultValue={this.state.project.windowsW}/>
                    <label  className="active" htmlFor="windowsW">W (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsNW"  ref="windowsNW" type="number" step="any" defaultValue={this.state.project.windowsNW}/>
                    <label  className="active" htmlFor="windowsNW">NW (n°)</label>
                </div>

                <h6 className="grey-text col s12">Number of windows-door wings</h6>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorN"  ref="windowsDoorN" type="number" step="any" defaultValue={this.state.project.windowsDoorN}/>
                    <label  className="active" htmlFor="windowsDoorN">N (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorNE"  ref="windowsDoorNE" type="number" step="any" defaultValue={this.state.project.windowsDoorNE}/>
                    <label  className="active" htmlFor="windowsDoorNE">NE (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorE"  ref="windowsDoorE" type="number" step="any" defaultValue={this.state.project.windowsDoorE}/>
                    <label  className="active" htmlFor="windowsDoorE">E (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorSE"  ref="windowsDoorSE" type="number" step="any" defaultValue={this.state.project.windowsDoorSE}/>
                    <label  className="active" htmlFor="windowsDoorSE">SE (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorS"  ref="windowsDoorS" type="number" step="any" defaultValue={this.state.project.windowsDoorS}/>
                    <label  className="active" htmlFor="windowsDoorS">S (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorSW"  ref="windowsDoorSW" type="number" step="any" defaultValue={this.state.project.windowsDoorSW}/>
                    <label  className="active" htmlFor="windowsDoorSW">SW (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorW"  ref="windowsDoorW" type="number"defaultValue={this.state.project.windowsDoorW}/>
                    <label  className="active" htmlFor="windowsDoorW">W (n°)</label>
                </div>
                <div className="input-field col  s2 m1">
                    <input  required id="windowsDoorNW"  ref="windowsDoorNW" type="number" step="any" defaultValue={this.state.project.windowsDoorNW}/>
                    <label  className="active" htmlFor="windowsDoorNW">NW (n°)</label>
                </div>
                <div className="input-field col s12 m6">
                <select  required id="typeGlass" ref="typeGlass"  defaultValue={this.state.project.typeGlass}>
                    <option value="" >Choose a type of glass</option>
                    <option name="typeGlass" value="Single glass" id="type_glass_single">Single glass</option>
                    <option name="typeGlass" value="Double glazing" id="type_glass_double">Double glazing</option>
                    <option name="typeGlass" value="Low emission double glazing" id="type_glass_low_emission_double">Low emission double glazing</option>
                    <option name="typeGlass" value="Low emission double glazing" id="type_glass_triple">Triple glass</option>
                    <option name="typeGlass" value="Low emission double glazing" id="type_glass_low_emission_triple">Low emission triple glazing</option>
                    </select>
                <label>Type of glass</label>
                </div>
                <div className="input-field col s12 m6">
                <select  required  id="typeFrame" ref="typeFrame"  defaultValue={this.state.project.typeFrame}>
                    <option value="" >Choose a type of frame</option>
                    <option name="typeFrame" value="Wood" id="type_frame_wood">Wood</option>
                    <option name="typeFrame" value="PVC" id="type_frame_pvc">PVC</option>
                    <option name="typeFrame" value="Metal" id="type_frame_metal">Metal</option>
                    <option name="typeFrame" value="Miscellaneous" id="type_frame_miscellaneous">Miscellaneous</option>
                    </select>
                <label>Type of frame</label>
                </div>
                <div className="input-field col s12">
                    <p className="col s12 m6 s4">
                    <input  type="checkbox" id="rollerShutterBoxes" ref="rollerShutterBoxes"   defaultChecked={this.state.project.rollerShutterBoxes}/>
                    <label  htmlFor="rollerShutterBoxes">Roller shutter boxes</label>
                    </p>
                    <p  className="col s12 m6 s4">
                    <input  type="checkbox" id="externalShields" ref="externalShields" defaultChecked={this.state.project.externalShields}/>
                    <label  htmlFor="externalShields">External shields</label>
                    </p>
                    <p  className="col s12 m6 s4">
                    <input  type="checkbox" id="presenceBalcony" ref="presenceBalcony" defaultChecked={this.state.project.presenceBalcony}/>
                    <label  htmlFor="presenceBalcony">Presence of balcony</label>
                    </p>
                </div>
                {saveButton}
            </div>
      }
      var projectInformation;
      if(this.state.project){
        projectInformation =
        <div>
            {/*<div className="col s12  white ">
            <ul className="tabs" id="projectInformation">
                <li className="tab col s2"><a className="active" href="#general">General</a></li>
                <li className="tab col s2"><a href="#needs">Needs</a></li>
                <li className="tab col s2"><a href="#building">Building</a></li>
                <li className="tab col s2"><a href="#geometry">Geometry</a></li>
                <li className="tab col s2"><a href="#wrap">Wrap</a></li>
            </ul>
            </div>*/}
            {generalInformation}
            {needsInformation}
            {buildingInformation}
            {geometryInformation}
            {envelopeInformation}
            
            {/*
            <div className="row col s12">
                <div className="section col s12 white ">
                    <h5 className="rezbuild-text">Envelope</h5>
                    <h6 className="grey-text">Number of windows wings</h6>
                    <div className="input-field col s12">
                        <input  required id="windowsN"  ref="windowsN" type="number" step="any" defaultValue={this.state.project.windowsN}/>
                        <label  className="active" htmlFor="windowsN">N (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsNE"  ref="windowsNE" type="number" step="any" defaultValue={this.state.project.windowsNE}/>
                        <label  className="active" htmlFor="windowsNE">NE (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsE"  ref="windowsE" type="number" step="any" defaultValue={this.state.project.windowsE}/>
                        <label  className="active" htmlFor="windowsE">E (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsSE"  ref="windowsSE" type="number" step="any" defaultValue={this.state.project.windowsSE}/>
                        <label  className="active" htmlFor="windowsSE">SE (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsS"  ref="windowsS" type="number" step="any" defaultValue={this.state.project.windowsS}/>
                        <label  className="active" htmlFor="windowsS">S (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsSW"  ref="windowsSW" type="number" step="any" defaultValue={this.state.project.windowsSW}/>
                        <label  className="active" htmlFor="windowsSW">SW (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsW"  ref="windowsW" type="number" step="any" defaultValue={this.state.project.windowsW}/>
                        <label  className="active" htmlFor="windowsW">W (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsNW"  ref="windowsNW" type="number" step="any" defaultValue={this.state.project.windowsNW}/>
                        <label  className="active" htmlFor="windowsNW">NW (n°)</label>
                    </div>

                    <h6 className="grey-text">Number of windows-door wings</h6>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorN"  ref="windowsDoorN" type="number" step="any" defaultValue={this.state.project.windowsDoorN}/>
                        <label  className="active" htmlFor="windowsDoorN">N (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorNE"  ref="windowsDoorNE" type="number" step="any" defaultValue={this.state.project.windowsDoorNE}/>
                        <label  className="active" htmlFor="windowsDoorNE">NE (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorE"  ref="windowsDoorE" type="number" step="any" defaultValue={this.state.project.windowsDoorE}/>
                        <label  className="active" htmlFor="windowsDoorE">E (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorSE"  ref="windowsDoorSE" type="number" step="any" defaultValue={this.state.project.windowsDoorSE}/>
                        <label  className="active" htmlFor="windowsDoorSE">SE (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorS"  ref="windowsDoorS" type="number" step="any" defaultValue={this.state.project.windowsDoorS}/>
                        <label  className="active" htmlFor="windowsDoorS">S (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorSW"  ref="windowsDoorSW" type="number" step="any" defaultValue={this.state.project.windowsDoorSW}/>
                        <label  className="active" htmlFor="windowsDoorSW">SW (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorW"  ref="windowsDoorW" type="number"defaultValue={this.state.project.windowsDoorW}/>
                        <label  className="active" htmlFor="windowsDoorW">W (n°)</label>
                    </div>
                    <div className="input-field col s12">
                        <input  required id="windowsDoorNW"  ref="windowsDoorNW" type="number" step="any" defaultValue={this.state.project.windowsDoorNW}/>
                        <label  className="active" htmlFor="windowsDoorNW">NW (n°)</label>
                    </div>
                    <div className="input-field col s12">
                    <select  required id="typeGlass" ref="typeGlass"  defaultValue={this.state.project.typeGlass}>
                        <option value="" >Choose a type of glass</option>
                        <option name="typeGlass" value="Single glass" id="type_glass_single">Single glass</option>
                        <option name="typeGlass" value="Double glazing" id="type_glass_double">Double glazing</option>
                        <option name="typeGlass" value="Low emission double glazing" id="type_glass_low_emission_double">Low emission double glazing</option>
                        <option name="typeGlass" value="Low emission double glazing" id="type_glass_triple">Triple glass</option>
                        <option name="typeGlass" value="Low emission double glazing" id="type_glass_low_emission_triple">Low emission triple glazing</option>
                        </select>
                    <label>Type of glass</label>
                    </div>
                    <div className="input-field col s12">
                    <select  required  id="typeFrame" ref="typeFrame"  defaultValue={this.state.project.typeFrame}>
                        <option value="" >Choose a type of frame</option>
                        <option name="typeFrame" value="Wood" id="type_frame_wood">Wood</option>
                        <option name="typeFrame" value="PVC" id="type_frame_pvc">PVC</option>
                        <option name="typeFrame" value="Metal" id="type_frame_metal">Metal</option>
                        <option name="typeFrame" value="Miscellaneous" id="type_frame_miscellaneous">Miscellaneous</option>
                        </select>
                    <label>Type of frame</label>
                    </div>
                    <div className="input-field col s12">
                        <p>
                        <input  type="checkbox" id="rollerShutterBoxes" ref="rollerShutterBoxes"   defaultChecked={this.state.project.rollerShutterBoxes}/>
                        <label  htmlFor="rollerShutterBoxes">Roller shutter boxes</label>
                        </p>
                    </div>
                    <div className="input-field col s12">
                        <p>
                        <input  type="checkbox" id="externalShields" ref="externalShields" defaultChecked={this.state.project.externalShields}/>
                        <label  htmlFor="externalShields">External shields</label>
                        </p>
                    </div>
                    <div className="input-field col s12">
                        <p>
                        <input  type="checkbox" id="presenceBalcony" ref="presenceBalcony" defaultChecked={this.state.project.presenceBalcony}/>
                        <label  htmlFor="presenceBalcony">Presence of balcony</label>
                        </p>
                    </div>
                </div>
            </div>*/}
        </div>
      }
      return (
        <form className="col s12" onSubmit={this.submit} lang="en">
        {projectInformation}
        { this.state.pending ?
        <div className="preloader-wrapper small active">
            <div className="spinner-layer">
            <div className="circle-clipper left">
                <div className="circle"></div>
            </div><div className="gap-patch">
                <div className="circle"></div>
            </div><div className="circle-clipper right">
                <div className="circle"></div>
            </div>
            </div>
        </div> : ''
        }

        { this.state.error ?
        <div className="row">
            <div className="col s12">
                <h6 className='rezbuild-text'>{this.state.error}</h6>
            </div>
        </div> : ''
        }
        </form>
    );
  }
}

const ProjectInformationComponent = props => (
  <SocketContext.Consumer>
  { (context) => <ProjectInformationCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default ProjectInformationComponent;

import React, { Component } from 'react'
import axios from 'axios'
import SocketContext from '../../../SocketContext'
import common from 'common'
axios.defaults.withCredentials = true

var $ = window.$

class CreateProjectFormCore extends Component {

  constructor(props){
   super(props);
   this.submit = this.submit.bind(this);
   this.state = {error : false, pending : false}
  }

  submit(event){
   event.preventDefault();
    this.setState({error : false, pending : true}, () => {
        var create = {owner: "token", users: ["token"]}
        Object.keys(this.refs).forEach(key => {
          create[key] = this.refs[key].value
          }
        );
        this.props.socket.emit('/api/project/create', create, res => {
            if (res.projects){
               Object.entries(common.ACTIONS).forEach(([key, action]) => {
                  var create = {
                    project: res.projects._id,
                    name: key,
                    lane:  'lane_backlog',
                    content:  key,
                    roles:  Object.keys(common.ROLES),
                    action: key,
                    names: action.names,
                    values: action.values,
                    formats: action.formats
                  }
                  this.props.socket.emit('/api/task/create', create, res => {});
               })
               var create = {
                project: res.projects._id,
                lane:  'lane_done',
                name: 'INIT',
                date: new Date(),
                user: 'token',
                content:  'INIT',
                roles:  Object.keys(common.ROLES),
                action : 'INIT',
                names: ['INIT'],
                values: ['0'],
                formats: ['.ifc'],
               }
               this.props.socket.emit('/api/task/create', create, res => {});

               this.setState({error : false, pending : false}, () => {
                $('#modal_createproject').modal('close');
               })
            }
            if (res.error) {
                this.setState({error : res.error, pending : false});
            }
        });
    })
  };
  componentDidMount(){
    $(document).ready(function(){
      $('ul.tabs').tabs();
      $('select').material_select();
    });
  }
  render() {
    return (
    <div id="modal_createproject" className="modal">
        <div className="rezbuild center" style={{marginBottom:'0'}}>
            <h4 className="white-text" style={{lineHeight:'150%'}}>Create project</h4>
        </div>
        <form className="col s12" onSubmit={this.submit}>
        <div className="row">
        <div className="col s12">
          <ul className="tabs" style={{display:"none"}}>
            <li className="tab col s2"><a href="#general">General</a></li>
            <li className="tab col s2"><a href="#needs">Needs</a></li>
            <li className="tab col s2"><a href="#building">Building</a></li>
            <li className="tab col s2"><a href="#geometry">Geometry</a></li>
            <li className="tab col s2"><a href="#wrap">Wrap</a></li>
          </ul>
        </div>
        <div id="general" className="col s12">
        <div className="input-field col s4">
              <input required id="name" type="text"  ref="name"/>
              <label htmlFor="name">Name</label>
        </div>
        <div className="input-field col s8">
              <input required id="address" type="text"  ref="address"/>
              <label htmlFor="address">Address</label>
        </div>
        <div className="input-field col s6">
              <input required id="city" type="text"  ref="city"/>
              <label htmlFor="city">City</label>
        </div>
        <div className="input-field col s6">
              <input required id="country" type="text"  ref="country"/>
              <label htmlFor="country">Country</label>
        </div>
        <div className="input-field col s4">
          <select required defaultValue={"City center"} id="context" ref="context">
            <option value="" disabled>Choose a context</option>
            <option name="context" value="City center" id="context_city_center">City center</option>
            <option name="context" value="Suburbs" id="context_suburbs">Suburbs</option>
            <option name="context" value="Isolated" id="context_isolated">Isolated</option>
          </select>
          <label>Context</label>
        </div>
        <div className="input-field col s4">
            <input required id="degree"  ref="degree"  type="number" step="any"/>
            <label  htmlFor="degree"> Degree Days (°)</label>
        </div>
        <div className="input-field col s4">
          <select required defaultValue={"Temperate zone"} id="climat" ref="climat">
            <option value="" disabled>Choose a climat zone</option>
            <option name="context" value="Tropical zone" id="climat_tropical">Tropical zone</option>
            <option name="context" value="Subtropical zone" id="climat_subtropical">Subtropical zone</option>
            <option name="context" value="Temperate zone" id="climat_temperate">Temperate zone</option>
            <option name="context" value="Cold zone" id="climat_cold">Cold zone</option>
          </select>
          <label>Climat Zone</label>
        </div>

        </div>
        <div id="needs" className="col s12">
          <div className="input-field col s12">
                    <textarea id="refurbishment_expectations" ref="refurbishmentExpectations" className="materialize-textarea" defaultValue="I want.."></textarea>
                    <label className="active" htmlFor="refurbishment_expectations">Refurbishment Project Expectations</label>
          </div>
          <div className="input-field col s12">
                  <p className="range-field">
                    <input type="range" id="energy_consumption_expectations" ref="energyConsumptionExpectations" min="0" max="100"  defaultValue="50"/>
                    <label htmlFor="energy_consumption_expectations">Energy Consumption Expectations</label>
                  </p>
          </div>
          <div className="input-field col s12">
                  <p className="range-field">
                    <input type="range" id="environmental_expectations" ref="environmentalExpectations" min="0" max="100"  defaultValue="50"/>
                    <label htmlFor="environmental_expectations">Environmental Expectations</label>
                  </p>
          </div>
          <div className="input-field col s12">
                  <p className="range-field">
                    <input type="range" id="economical_expectations" ref="economicalExpectations" min="0" max="100"  defaultValue="50"/>
                    <label htmlFor="economical_expectations">Economical Expectations</label>
                  </p>
          </div>
          <div className="input-field col s12">
                  <p className="range-field">
                    <input type="range" id="social_expectations" ref="socialExpectations" min="0" max="100"  defaultValue="50"/>
                    <label htmlFor="social_expectations">Social Expectations</label>
                  </p>
          </div>
          <div className="input-field col s12">
                  <p className="range-field">
                    <input type="range" id="comfort_expectations" ref="comfortExpectations" min="0" max="100"  defaultValue="50"/>
                    <label htmlFor="comfort_expectations">Comfort Expectations</label>
                  </p>
          </div>
          <div className="input-field col s12">
            <p>
              <input type="checkbox"  value = "0" id="home_during_renovation" ref="homeDuringRenovation"/>
              <label htmlFor="home_during_renovation">Don't leave home during renovation</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="different_location_during_renovation" ref="differentLocationDuringRenovation"/>
              <label htmlFor="different_location_during_renovation">Have a different location during renovation</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="elevator_installation" ref="elevatorInstallation"/>
              <label htmlFor="elevator_installation">Elevator Installation</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="improved_accessibility" ref="improvedAccessibility"/>
              <label  htmlFor="improved_accessibility">Improved Accessibility</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="reduction_bill_amount" ref="reductionBillAmount"/>
              <label  htmlFor="reduction_bill_amount">Reduction in bills amount</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="more_home_spaces" ref="moreHomeSpaces"/>
              <label  htmlFor="more_home_spaces">More home spaces</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="brighter_environments" ref="brighterEnvironments"/>
              <label  htmlFor="brighter_environments">Brighter environments</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="extra_service_room" ref="extraServiceRoom"/>
              <label  htmlFor="extra_service_room">Extra service room</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="heating_upgrading" ref="heatingUpgrading"/>
              <label  htmlFor="heating_upgrading">Heating upgrading</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="cooling_upgrading" ref="coolingUpgrading"/>
              <label  htmlFor="cooling_upgrading">Cooling upgrading</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="ventilation_upgrading" ref="ventilationUpgrading"/>
              <label  htmlFor="ventilation_upgrading">Ventilation upgrading</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="consumption_control" ref="consumptionControl"/>
              <label  htmlFor="consumption_control">Consumption control</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="eliminitation_air_infiltration" ref="eliminitationAirInfiltration"/>
              <label  htmlFor="eliminitation_air_infiltration">Elimination of air infiltration</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="shading_upgrading" ref="shadingUpgrading"/>
              <label  htmlFor="shading_upgrading">Shading upgrading</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="air_quality_improvement" ref="airQualityImprovement"/>
              <label  htmlFor="air_quality_improvement">Air quality improvement</label>
            </p>
            <p>
              <input type="checkbox"  value = "0" id="noise_reduction" ref="noiseReduction"/>
              <label  htmlFor="noise_reduction">Noise reduction</label>
            </p>
          </div>

        </div>
        <div id="building" className="col s12">
        <div className="input-field col s12">
          <select required defaultValue={"S"} id="exposure" ref="exposure">
            <option value="" disabled>Choose an exposure</option>
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
        <div className="input-field col s12">
          <select required defaultValue={"House"} id="home" ref="home">
            <option value="" disabled>Choose an home type</option>
            <option name="exposure" value="House" id="home_house">House</option>
            <option name="exposure" value="Apartment" id="home_apartment">Apartment</option>
             </select>
          <label>Home Type</label>
        </div>
        <div className="input-field col s12">
              <input id="building_taxonomy" type="text"  ref="buildingTaxonomy" defaultValue="IN PROGRESS"/>
              <label className="active" htmlFor="building_taxonomy">Building Taxonomy</label>
        </div>
        <div className="input-field col s12">
              <input id="year"  type="number" step="any"  ref="year" defaultValue="1984"/>
              <label className="active" htmlFor="year">Construction year</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"Light"} id="gradation" ref="gradation">
            <option value="" disabled>Choose a color gradation of external finish</option>
            <option name="gradation" value="Light" id="gradation_light">Light</option>
            <option name="gradation" value="Average" id="gradation_average">Average</option>
            <option name="gradation" value="Dark" id="gradation_dark">Dark</option>
             </select>
          <label>Color Gradation of External Finish</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"Private"} id="property" ref="property">
            <option value="" disabled>Property</option>
            <option name="property" value="Private" id="property_private">Private</option>
            <option name="property" value="Public" id="property_public">Public</option>
             </select>
          <label>property</label>
        </div>
        </div>
        <div id="geometry" className="col s12">
        <div className="input-field col s12">
            <input required id="floors"  ref="floors"  type="number" step="any" defaultValue="2"/>
            <label  className="active" htmlFor="floors"> Number of floors (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="inter_floor_height"  ref="interFloorHeight"  type="number" step="any" defaultValue="2"/>
            <label  className="active" htmlFor="inter_floor_height"> Clear inter-floor height (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="floor_number"  ref="floorNumber"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="floor_number">Floor number (n°) (if apartment)</label>
        </div>
        <div className="input-field col s12">
            <input required id="apartment_by_floor"  ref="apartmentByFloor"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="apartment_by_floor">Number of apartments per floor (n°) (if apartment)</label>
        </div>
        <div className="input-field col s12">
            <input required id="total_floors_building"  ref="totalFloorsBuilding"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="total_floors_building">Total floors of the building (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="footprint_building"  ref="footprintBuilding"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="footprint_building">Net footprint of building (m²)</label>
        </div>
        <div className="input-field col s12">
            <input required id="total_useful_surface"  ref="totalUsefulSurface"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="total_useful_surface">Total useful surface (m²)</label>
        </div>
        <h6 className="grey-text">Linear dimension divided by exposure</h6>
        <div className="input-field col s12">
            <input required id="linear_dimension_n"  ref="linearDimensionN"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_n">N (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_ne"  ref="linearDimensionNE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_ne">NE (m)</label>
        </div>

        <div className="input-field col s12">
            <input required id="linear_dimension_e"  ref="linearDimensionE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_e">E (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_se"  ref="linearDimensionSE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_se">SE (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_s"  ref="linearDimensionS"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_s">S (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_sw"  ref="linearDimensionSW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_sw">SW (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_w"  ref="linearDimensionW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_w">W (m)</label>
        </div>
        <div className="input-field col s12">
            <input required id="linear_dimension_nw"  ref="linearDimensionNW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="linear_dimension_nw">NW (m)</label>
        </div>

        <div className="input-field col s12">
          <select required defaultValue={"Ground"} id="floor_adjacent" ref="floorAdjacent">
            <option value="" disabled>Choose floor adjacent to the unheated room</option>
            <option name="property" value="Ground" id="floor_adjacent_ground">Ground</option>
            <option name="property" value="Cellar" id="floor_adjacent_cellar">Cellar/Garage</option>
            <option name="property" value="External" id="floor_adjacent_external">External</option>
            <option name="property" value="Land" id="floor_adjacent_land">Land/Cellar</option>
            <option name="property" value="Outside" id="floor_adjacent_outside">Cellar/Outside</option>
             </select>
          <label>Floor adjacent to the unheated room</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"Attic"} id="ceiling_adjacent" ref="ceilingAdjacent">
            <option value="" disabled>Choose ceiling adjacent to the unheated room</option>
            <option name="property" value="Attic" id="ceiling_adjacent_attic">Attic</option>
            <option name="property" value="External" id="ceiling_adjacent_external">External</option>
            <option name="property" value="AtticExternal" id="ceiling_adjacent_attic_external">Attic/External</option>
             </select>
          <label>Ceiling adjacent to the unheated room</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"External stairwell"} id="wall_adjacent" ref="wallAdjacent">
            <option value="" disabled>Choose walls adjacent to the unheated room</option>
            <option name="property" value="Internal stairwell (only one facing)" id="wall_adjacent_internal_one_face">Internal stairwell (only one facing)</option>
            <option name="property" value="Internal stairwell (no facing)" id="wall_adjacent_internal_no_face">Internal stairwell (no facing)</option>
            <option name="property" value="External stairwell" id="wall_adjacent_external">External stairwell</option>
            <option name="property" value="Other unheated rooms" id="wall_adjacent_other">Other unheated rooms</option>
             </select>
          <label>Walls adjacent to the unheated room</label>
        </div>
        </div>
        <div id="wrap" className="col s12">
        <h6 className="grey-text">Number of windows wings</h6>
        <div className="input-field col s12">
            <input required id="windows_n"  ref="windowsN"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_n">N (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_ne"  ref="windowsNE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_ne">NE (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_e"  ref="windowsE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_e">E (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_se"  ref="windowsSE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_se">SE (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_s"  ref="windowsS"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_s">S (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_sw"  ref="windowsSW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_sw">SW (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_w"  ref="windowsW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_w">W (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_nw"  ref="windowsNW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_nw">NW (n°)</label>
        </div>

        <h6 className="grey-text">Number of windows-door wings</h6>
        <div className="input-field col s12">
            <input required id="windows_door_n"  ref="windowsDoorN"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_n">N (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_ne"  ref="windowsDoorNE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_ne">NE (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_e"  ref="windowsDoorE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_e">E (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_se"  ref="windowsDoorSE"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_se">SE (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_s"  ref="windowsDoorS"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_s">S (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_sw"  ref="windowsDoorSW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_sw">SW (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_w"  ref="windowsDoorW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_w">W (n°)</label>
        </div>
        <div className="input-field col s12">
            <input required id="windows_door_nw"  ref="windowsDoorNW"  type="number" step="any" defaultValue="0"/>
            <label  className="active" htmlFor="windows_door_nw">NW (n°)</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"Single glass"} id="type_glass" ref="typeGlass">
            <option value="" disabled>Choose a type of glass</option>
            <option name="type_glass" value="Single glass" id="type_glass_single">Single glass</option>
            <option name="type_glass" value="Double glazing" id="type_glass_double">Double glazing</option>
            <option name="type_glass" value="Low emission double glazing" id="type_glass_low_emission_double">Low emission double glazing</option>
            <option name="type_glass" value="Low emission double glazing" id="type_glass_triple">Triple glass</option>
            <option name="type_glass" value="Low emission double glazing" id="type_glass_low_emission_triple">Low emission triple glazing</option>
             </select>
          <label>Type of glass</label>
        </div>
        <div className="input-field col s12">
          <select required defaultValue={"PVC"} id="type_frame" ref="typeFrame">
            <option value="" disabled>Choose a type of frame</option>
            <option name="type_frame" value="Wood" id="type_frame_wood">Wood</option>
            <option name="type_frame" value="PVC" id="type_frame_pvc">PVC</option>
            <option name="type_frame" value="Metal" id="type_frame_metal">Metal</option>
            <option name="type_frame" value="Miscellaneous" id="type_frame_miscellaneous">Miscellaneous</option>
             </select>
          <label>Type of frame</label>
        </div>
        <div className="input-field col s12">
            <p>
              <input type="checkbox"  value = "0" id="roller_shutter_boxes" ref="rollerShutterBoxes"/>
              <label  htmlFor="roller_shutter_boxes">Roller shutter boxes</label>
            </p>
        </div>
        <div className="input-field col s12">
            <p>
              <input type="checkbox"  value = "0" id="external_shields" ref="externalShields"/>
              <label  htmlFor="external_shields">External shields</label>
            </p>
        </div>
        <div className="input-field col s12">
            <p>
              <input type="checkbox"  value = "0" id="presence_balcony" ref="presenceBalcony"/>
              <label  htmlFor="presence_balcony">Presence of balcony</label>
            </p>
        </div>
        </div>
         </div>
        <div className="row col s12">
          <div className="input-field col s6 center">
              <button className="btn waves-effect waves-light" type="submit">SUBMIT<i className="material-icons right">send</i></button>
          </div>
          <div className="input-field col s6 center">
              <a className="btn waves-effect waves-light white rezbuild-text" href="#!"  onClick={() => $("#modal_createproject").modal('close')}> <i className="material-icons left">cancel</i>CANCEL</a>
          </div>
        </div>
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
    </div>
    );
  }
}

const CreateProjectForm = props => (
  <SocketContext.Consumer>
  { (context) => <CreateProjectFormCore {...props} socket={context.socket} uploader={context.uploader} />}
  </SocketContext.Consumer>
)

export default CreateProjectForm;
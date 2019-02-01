import React, { Component } from 'react'
import logo from './ressources/img/jpg/logo.jpg'
import $ from 'jquery'
import M from "materialize-css/dist/js/materialize.js";
class Settings extends Component {
  // Initialize the state
  constructor(props){
    super(props);
  }
  updateDimensions() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    var elems = $('.modal');
    M.Modal.init(elems, {});
  }
  componentWillUnmount() {
  }

  render() {
    return (
    <div>

    </div>

    );
  }
}
export default Settings;
import React from 'react';
import { Redirect } from 'react-router';
import auth from '../scripts/auth';
import api from '../scripts/api';
import Dash from './Dash';
const API = new api();
const Auth = new auth();

class DashController extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.renderDash = this.renderDash.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  componentDidMount() {
    let userProm = this.getUser();
    if (userProm) {
      userProm.then((user) => {
        this.setState({ user: user[0] })
      });
    } else {
      this.setState({ redirect: true });
    }
  }

  getUser() {
    if (this.state.user) {
      return this.state.user;
    }
    let user_id = Auth.getUserId();
    if (user_id) {
      console.log(`Getting ${user_id}`);
      return API.getUser(user_id);
    } else {
      console.log(`No user`);
      return null;
    }
  }

  renderMenu() {
    if (!this.state.user) {
      return null;
    }
    return (
      <div className="menu">
      {this.state.user.dashboards.map((dash)=>{
        let img_url = window.location.href + dash.icon;
        return (<div className="menuIcon">
            <img src={img_url} className="menuPicture"/>
          </div>)
      })}
      </div>
    );
  }

  renderDash() {
    if (!this.state.user) {
      return null;
    }
    return (<div className="dashContainer">
        {this.state.user.dashboards.map((dash) => {
            return (<Dash
              location={dash.location}
              background={dash.background}
              widgets={dash.widgets}
               /> );
              }
        )}
        </div>)
  }

  render() {
    if (this.state.redirect === true) {
      return (<Redirect to="/" />);
    }
    return (
      <div className="DashController">
        {this.renderMenu()}
        {this.renderDash()}
      </div>)
  }
}

DashController.displayName = 'DashController';

export default DashController;
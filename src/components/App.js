import React, { Component } from 'react';
import './App.css';
import PrivateRoute from './constants/PrivateRoute';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Header/Header';
import LandingPage from './Landing/Landing';
import LoginPage from './Login/Login';
import HomePage from './Home/Home';
import EmployeePage from './Employee/Employee';
import ProjectPage from './Project/Project';
import ProjParticipantPage from './Project/ProjectParticipant';
import * as routes from '../components/constants/routes';
import { Provider } from "react-redux";
import store from "../js/store/index";
import index from "../js/index"; //redux
import BranchPage from './Branch/Branch';
import RoleplayPage from './Role/Roleplay';
import FeedbackPage from './Feedback/Feedback';
import S1 from './Stepboard/s1';
import S3 from './Stepboard/s3';
import Staytune from './StayTune/Staytune';
import StandartServicePage from './Standartservices/Stdservices';
import AspekPage from './Standartservices/Aspek';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title:""
    }
  }

  changeMenu(e){
    this.setState(state => (state.title = e));
  }

  render() {
    let localData = JSON.parse(localStorage.getItem('currentUser'));
    return (
      <Provider store={store}>
      <Router>
        <div>
          <Header title={this.state.title} menuClicked={(e) => this.changeMenu(e)}/>
          
          <Route exact path={routes.LANDING} component={() => <LandingPage />} />
          <Route exact path={routes.LOGIN} component={() => <LoginPage />} />
          <Route exact path={routes.HOME} component={() => <HomePage />} />
          <Route exact path={routes.LOGINDEFAULT} component={() => <LoginPage />} />
          <PrivateRoute  exact path={routes.EMPLOYEE} component={() => <EmployeePage />} />
          <PrivateRoute  exact path={routes.PROJECTPAR} component={() => <ProjParticipantPage />} />
          <PrivateRoute  exact path={routes.PROJECT} component={() => <ProjectPage />} />
          <PrivateRoute  exact path={routes.BRANCH} component={() => <BranchPage />} />
          <PrivateRoute  exact path={routes.ROLE} component={() => <RoleplayPage />} />
          <PrivateRoute  exact path={routes.FEEDBACK} component={() => <FeedbackPage />} />
          <PrivateRoute  exact path={routes.S1} component={() => <S1 />} />  
          <PrivateRoute  exact path={routes.S3} component={() => <S3 />} />    
          <PrivateRoute  exact path={routes.STAYTUNE} component={() => <Staytune />} />    
          <PrivateRoute  exact path={routes.STDSERVICE} component={() => <StandartServicePage />} />    
          <PrivateRoute  exact path={routes.ASPEK} component={() => <AspekPage />} />    
        </div>
      </Router>
      </Provider>
    );
  }

}

export default App;

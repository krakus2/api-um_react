import React, { Component } from 'react';
import './App.css';
import MainPage from './components/MainPage'
import MainPage_Mob from './components/MainPage_Mob'
import LoginPage from './components/LoginPage'
import Register from './components/Register'
import ForgetPass from './components/ForgetPass'
import UserAccount from './components/UserAccount'
import { Route } from 'react-router-dom'
import MediaQuery from 'react-responsive';


class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<MediaQuery maxDeviceWidth={1224}>
             <MainPage_Mob />>
           </MediaQuery>*/}
        {/*<MediaQuery minDeviceWidth={1224} >*/}
          <Route path="/" exact /*component={MainPage}*/ render={() =>
              <MainPage cokolwiek={"cokolwiek"} />}/>
        {/*</MediaQuery>*/}
        <Route path="/login" exact component={LoginPage} />
        <Route path="/register" exact component={Register} />
        <Route path="/forgetPass" exact component={ForgetPass} />
        <Route path="/userAccount" exact component={UserAccount} />
      </div>
    );
  }
}

export default App;

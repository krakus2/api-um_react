import React, { Component } from 'react';
import './App.css';
import MainPage from './components/MainPage'
import LoginPage from './components/LoginPage'
import Register from './components/Register'
import ForgetPass from './components/ForgetPass'
import UserAccount from './components/UserAccount'
import { Route } from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact /*component={MainPage}*/ render={() =>
            <MainPage cokolwiek={"cokolwiek"} />}/>
        <Route path="/login" exact component={LoginPage} />
        <Route path="/register" exact component={Register} />
        <Route path="/forgetPass" exact component={ForgetPass} />
        <Route path="/userAccount" exact component={UserAccount} />
      </div>
    );
  }
}

export default App;

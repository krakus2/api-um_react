import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { auth } from '../firebase/index';
import { firebase } from '../firebase/index';
import * as routes from '../constants/routes';

const MyContext = React.createContext();

class MyProvider extends Component {
  constructor() {
    super()
    this.state = {
      auth: JSON.parse(localStorage.getItem('auth')) || false, 
      //to jest nieladnie, raczej w cdm
      uid: null
    }
  }

  componentDidMount(){
    //TODO!!!
    //trzeba dodac zabezpieczenie, jesli uzytkownik usunalby swoje userid, ale dalej byl zalogowany
    this.setState({
      uid: JSON.parse(localStorage.getItem('uid')) || null
    })
    console.log("Rerender contextu")
  }

  componentDidUpdate(prevProps, prevState){
    console.log("Update contextu")
  }

  changeAuthStatus = () => {
    const { auth } = this.state
    this.setState({
      auth: !auth
    }, () => {
      localStorage.setItem('auth', JSON.stringify(this.state.auth))
    })
  }

  logout = () => {
    this.setState({
      auth: false
    }, () => {
      localStorage.setItem('auth', JSON.stringify(false))
    })
  }

  updateUid = uid => {
    this.setState({ uid },
    () => {
        localStorage.setItem('uid', JSON.stringify(uid))
    })
  }

  getUid = () => {
    return this.state.uid
  }

  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        changeAuthStatus: this.changeAuthStatus,
        updateUid: this.updateUid,
        getUid: this.getUid
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

const MyConsumer = MyContext.Consumer

// This function takes a component...
function withContext(Component) {
  // ...and returns another component...
  return function ContextComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return (
      <MyConsumer>
        {context => <Component {...props} context={context} />}
      </MyConsumer>
    );
  };
}

const withAuthorization = (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      console.log("component did mount withAuthorization")
      firebase.auth.onAuthStateChanged(authUser => {
        console.log("moze jednak auth z nawiasem - o tak - auth()")
        if (!!!authUser) {
          console.log(authUser)
          this.props.history.push(routes.LOGIN);
        }
      }); 
    }

    /*componentWillUnmount(){
      //unsubscribe to onAuthStateChanged
    }*/

        render() { 
          return (
            <MyConsumer>
              {context => context.state.auth ? 
                <Component {...this.props} {...this.state} /> : 
                <Component {...this.props} {...this.state} />}
            </MyConsumer>
          );
        }
  }

  return withRouter(WithAuthorization);
}

export { MyProvider, MyConsumer, withContext, withAuthorization }

import React, { Component } from 'react';

const MyContext = React.createContext();

class MyProvider extends Component {
  constructor() {
    super()
    this.state = {
      auth: false
    }
  }

  componentDidMount(){
    console.log("Rerender contextu")
  }

  componentDidUpdate(prevProps, prevState){
    console.log("Update contextu")
  }

  changeAuthStatus = () => {
    const { auth } = this.state
    this.setState({
      auth: !auth
    })
  }

  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        changeAuthStatus: this.changeAuthStatus
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

const MyConsumer = MyContext.Consumer

// This function takes a component...
export function withContext(Component) {
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


export { MyProvider, MyConsumer }

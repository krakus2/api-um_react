import React, { Component } from 'react';
import { withAuthorization, withContext } from '../context/ContextComp'
import { compose } from 'recompose';

class UserAccount extends Component {

  state = {
    kupa: "kupa"
  }

  render() {
    return (
      this.state.kupa
    );
  }
}

//const authCondition = (authUser) => !!authUser;

const withEverything = compose(
  withContext,
  withAuthorization,
);

export default withEverything(UserAccount)


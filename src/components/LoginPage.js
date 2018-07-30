import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { Link, withRouter, } from 'react-router-dom';
import { auth } from '../firebase/index';
import { withContext } from '../context/ContextComp'
import { compose } from 'recompose';
import { validateEmail } from '../utils.js'
import * as routes from '../constants/routes';
import InlineError from './Messages/InlineError'
import NavBar from './NavBar'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';


  const styles = theme => ( {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: '5px',
      marginBottom: '5px',
      width: '40vw',
      },
      TheInput: {
      		fontSize: 18,
      },
      TheLabel: {
      		fontSize: 18,
          fontWeight: 400
      },
      TheHelper: {
        fontSize: 11,
      },
      Progress: {
        width: '100%',
        marginTop: 10
      },
      button: {
        margin: theme.spacing.unit,
        fontSize: '16px',
        width: '40%'
      },
      buttonDisabled: {
        width: '100%',
        fontSize: '16px',
      },
      tooltip: {
        fontSize: 11,
      },
      root: {
        marginTop: 20,
        padding: '0px 10px 10px 10px'
      }
  });

  const Wrapper = styled.div`
    width: 40vw;
    font-size: 18px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const FormWrapper = styled.form`
    margin-top: 20px;
  `;

  const TextWrapper = styled.form`
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
  `;

  const ButtonWrapper = styled.div`
    width: 40vw;
    font-size: 18px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;

  const RegLink = props => <Link to={routes.REGISTER} {...props} />

  const StylRegLink = styled(RegLink)`
  text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
       text-decoration: none;
    }
  `
  const INITIAL_STATE = {
    email: "",
    password: "",
    strength: null,
    signInErr: {
      value: false,
      message: ""
    },
    emailErr: false
  }

class LoginPage extends Component {

  state = {
    email: "",
    password: "",
    signInErr: {
      value: false,
      message: ""
    },
    strength: null,
    emailErr: false
  }

  onSubmit = e => {
    const { email, password } = this.state
    let { emailErr } = this.state
    const { history, context } = this.props;
    e.preventDefault();

    if(!validateEmail(email)){
      emailErr = true
      this.setState({ emailErr })
    } else {
      emailErr = false
      this.setState({ emailErr })
    }

    console.log(email, password)
    if(!emailErr){
      auth.doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log(authUser.uid)
        this.setState(() => ({ ...INITIAL_STATE }));
        context.updateUid(authUser.uid)
        context.changeAuthStatus()
        history.push(routes.MAIN_PAGE);
      })
      .catch(error => {
        console.log(error)
        this.setState({ signInErr: {
          value: true,
          message: error.message
        }});
      });
    }
  }

  onChange = e => {
    console.log([e.target.name], e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  onLoginClick = e => {
    console.log("cokolwiek")
  }



  render() {
    const { classes } = this.props;
    const { email, password, signInErr, emailErr } = this.state;
    const isInvalid = password === '' || email === '';

    return (
        <Wrapper>
          <NavBar />
          <Paper className={classes.root} elevation={1}>
            <FormWrapper onSubmit={this.onSubmit}>
              <TextField
                id="email"
                label="Email adress"
                placeholder="example@example.com"
                helperText={
                  emailErr ? "This doesn't look like email adress" :
                    null
                }
                type="text"
                error={emailErr ? true : false}
                className={classes.textField}
                InputProps={{
                  classes: {
                    input: classes.TheInput,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.TheLabel,
                  },
                }}
                FormHelperTextProps={{
                  classes: {
                    root: classes.TheHelper
                  }
                }}
                value={this.state.name}
                onChange={this.handleChange('email')}
                margin="normal"
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                className={classes.textField}
                InputProps={{
                  classes: {
                    input: classes.TheInput,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.TheLabel,
                  },
                }}
                FormHelperTextProps={{
                  classes: {
                    root: classes.TheHelper
                  }
                }}
                value={this.state.name}
                onChange={this.handleChange('password')}
                margin="normal"
              />
              <ButtonWrapper>
                <Tooltip title="Create new account" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                  placement="bottom">
                  <Button color="primary" className={classes.button} size="large"
                    component={StylRegLink} >
                    Register
                  </Button>
                </Tooltip>
                <Tooltip title="Fill in gaps to enable" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                  placement="bottom">
                  <div style={{width: "40%", margin: "8px"}}>
                    <Button variant="contained" color="primary" className={classes.buttonDisabled} size="large"
                      onClick={this.onLoginClick} type="submit" disabled={isInvalid}>
                      Login
                    </Button>
                  </div>
                </Tooltip>
              </ButtonWrapper>
            </FormWrapper>
            <TextWrapper>
              Forgot your password? <Link to={routes.FORGET_PASS}>Click here</Link>
            </TextWrapper>
          </Paper>
            { signInErr.value && <InlineError text={`Something went wrong. Try again. Message: ${signInErr.message}`}/>}
        </Wrapper>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStyleAndContext = compose(
  withRouter,
  withContext,
  withStyles(styles),
);

export default withStyleAndContext(LoginPage)

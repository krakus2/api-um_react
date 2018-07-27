import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, } from 'react-router-dom';
import { auth } from '../firebase/index';
import styled from "styled-components";
import InlineError from './Messages/InlineError'
import { validateEmail } from '../utils.js'
import * as routes from '../constants/routes';
import NavBar from './NavBar'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import owasp from 'owasp-password-strength-test'
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import { withContext } from '../context/ContextComp'
import { compose } from 'recompose';


  owasp.config({
    allowPassphrases       : true,
    maxLength              : 128,
    minLength              : 8,
    minPhraseLength        : 18,
    minOptionalTestsToPass : 3,
  });

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
        width: '97.5%',
        margin: '10px auto 0 auto'
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
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const FormWrapper = styled.form`
    margin-top: 20px;
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

  const RegLink = props => <Link to={routes.LOGIN} {...props} />

  const StylRegLink = styled(RegLink)`
  text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
       text-decoration: none;
    }
  `

  const INITIAL_STATE = {
    email: "",
    password: "",
    password2: "",
    strength: null,
    signUpErr: {
      value: false,
      message: ""
    },
    emailErr: false,
    passErr: false
  }

class Register extends Component {

  state = {
    email: "",
    password: "",
    password2: "",
    strength: null,
    signUpErr: {
      value: false,
      message: ""
    },
    emailErr: false,
    passErr: false
  }

  onSubmit = e => {
    e.preventDefault()
    let { email, password, password2, emailErr, passErr } = this.state
    const { history } = this.props;
    if(!validateEmail(email)){
      emailErr = true
      this.setState({ emailErr })
    } else {
      emailErr = false
      this.setState({ emailErr })
    }
    if(password !== password2){
      passErr = true
      this.setState({ passErr })
    }
    console.log(email, password)
    if( !emailErr && !passErr){
      auth.doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState(() => ({ ...INITIAL_STATE }));
        this.props.context.changeAuthStatus()
        history.push(routes.MAIN_PAGE);
      })
      .catch(error => {
        console.log(error)
        this.setState({ signUpErr: {
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
    if(name === "password"){
      this.setState({ passErr: false})
      //console.log(!event.target.value.length, event.target.value.length)
      if(!event.target.value.length){
        this.setState({strength: 0})
      } else {
        const result = owasp.test(event.target.value);
        const strength = Math.round((1 - (result.failedTests.length /
          (result.failedTests.length + result.passedTests.length))) * 100)
        this.setState({
          [name]: event.target.value,
          strength
        });
      }
    } else if(name === "password2"){
      this.setState({
        [name]: event.target.value,
        passErr: false
      });
    } else {
      this.setState({
        [name]: event.target.value,
        emailErr: false
      });
    }

    };

  render() {
    const { classes, context } = this.props;
    const { strength, emailErr, passErr, signUpErr, email, password, password2 } = this.state;
    const isInvalid =
     password === '' ||
     password2 === '' ||
     email === '';
    return (
      <Wrapper>
        <NavBar />
        <Paper className={classes.root} elevation={1}>
          <FormWrapper onSubmit={this.onSubmit}>
              <TextField
                id="email"
                label="Email adress"
                placeholder="example@example.com"
                error={emailErr ? true : false}
                helperText={
                  emailErr ? "This doesn't look like email adress" :
                    "Type your e-mail adress, which will be bound to your account"
                }
                type="text"
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
                error={passErr ? true : false}
                helperText={
                  !passErr? "Remember to pass something harder than user123" :
                  "Repeat password correctly"}
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
              <Tooltip title="Strenght of your password" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                placement="bottom-start">
                <LinearProgress variant="determinate" value={strength} className={classes.Progress}/>
              </Tooltip>
              <TextField
                id="password2"
                label="Repeat Password"
                type="password"
                error={passErr ? true : false}
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
                onChange={this.handleChange('password2')}
                margin="normal"
              />
              <ButtonWrapper>
                <Tooltip title="Login if you already have an account" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                  placement="bottom">
                  <Button color="primary" className={classes.button} size="large"
                    component={StylRegLink}>
                    Login
                  </Button>
                </Tooltip>
                <Tooltip title="Fill in gaps to enable" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                  placement="bottom">
                  {/*nie dziala  `${classes.button.margin}`, margines ustawiony na sztywno*/}
                  <div style={{width: "40%", margin: "8px"}}>
                    <Button variant="contained" color="primary" className={classes.buttonDisabled}
                      size="large" type="submit" disabled={isInvalid}>
                      Register
                    </Button>
                  </div>
                </Tooltip>
              </ButtonWrapper>
            </FormWrapper>
          </Paper>
          { signUpErr.value && <InlineError text={`Something went wrong. Try again. Message: ${signUpErr.message}`}/>}
        </Wrapper>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStyleAndContext = compose(
  withRouter,
  withContext,
  withStyles(styles),
);

export default withStyleAndContext(Register)

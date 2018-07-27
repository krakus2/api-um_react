import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import * as routes from '../constants/routes';
//import InlineError from './Messages/InlineError'
import NavBar from './NavBar'
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import { MyContext, withContext } from '../context/ContextComp'
import { compose } from 'recompose';

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
      button: {
        margin: theme.spacing.unit,
        fontSize: '16px',
        width: '100%'
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



class ForgetPass extends Component {

  state = {
    email: "",
  }

  onSubmit = e => {

  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  render() {
    const { classes, context } = this.props;
    return (
        <Wrapper>
          <NavBar />
          <Paper className={classes.root} elevation={1}>
            <FormWrapper onSubmit={this.onSubmit}>
              <TextField
                id="email"
                label="Email adress"
                placeholder="example@example.com"
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
              <ButtonWrapper>
                <Tooltip title="Create new account" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                  placement="bottom">
                  <Button  variant="contained" color="primary" className={classes.button} size="large"
                    onClick={this.onSubmit}>
                    Reset My Password
                  </Button>
                </Tooltip>
              </ButtonWrapper>
            </FormWrapper>
          </Paper>
        </Wrapper>
    );
  }
}

ForgetPass.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStyleAndContext = compose(
  withContext,
  withStyles(styles),
);

export default withStyleAndContext(ForgetPass)

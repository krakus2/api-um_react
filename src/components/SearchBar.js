import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
//import Tooltip from '@material-ui/core/Tooltip';
//import Zoom from '@material-ui/core/Zoom';

  const Wrapper = styled.div`
    margin-top: 10px;
    width: 100%;
  `;

  const styles = theme => ( {
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: '5px',
      marginBottom: '5px',
      width: '30vw',
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
      root: {
        marginTop: 20,
        padding: '0px 10px 10px 10px',
        textAlign: 'center'
      },
      button: {
        margin: theme.spacing.unit,
        fontSize: '14px'
      },
      switch: {
        marginLeft: '8px',
      },
      formControlRoot: {
        fontSize: '14px'
      },
      progress: {
        margin: 0
      },
  });

const SearchBar = ({ change, submit, blur, classes, handleSwitchChange, autoRefresh, 
  loading, onSearchClick }) => (
  <Wrapper>
    <Paper className={classes.root} elevation={1}>
      <form noValidate autoComplete="off" onSubmit={submit} >
        <TextField
          id="writingLine"
          label="Line number"
          placeholder="401 e-7 25"
          helperText={"You can search for more than one at once, including trams"}
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
          /*value={this.state.name}*/
          onChange={change}
          autoFocus={true}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit"
          className={classes.button} size="large" onClick={onSearchClick}>
            { loading ? 
                <Fade
                  in={loading}
                  style={{
                    transitionDelay: loading ? '200ms' : '0ms',
                  }}
                  unmountOnExit
                > 
                  <CircularProgress color="inherit" size={25} className={classes.progress}/>
                </Fade>
                  :
                "Search"
            }  
        </Button>
        <FormControlLabel
          control={
            <Switch
              classes={{root: classes.switch}}
              checked={autoRefresh}
              onChange={handleSwitchChange('autoRefresh')}
              value="autoRefresh"
              color="primary"
            />
          }
          label="Auto-refresh"
          classes={{label: classes.formControlRoot}}
        />
      </form>
    </Paper>
  </Wrapper>
)

SearchBar.propTypes = {
  change: PropTypes.func.isRequired
}

export default withStyles(styles)(SearchBar);

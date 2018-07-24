import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

  const Wrapper = styled.div`
    margin-top: 10px;
  `;

  const styles = theme => ( {
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
      root: {
        marginTop: 20,
        padding: '0px 10px 10px 10px'
      }
  });

const SearchBar = ({ change, submit, blur, classes }) => (
  <Wrapper>
    <Paper className={classes.root} elevation={1}>
      <form noValidate autoComplete="off" onSubmit={submit} >
        <TextField
          id="writingLine"
          label="Type line number, which you want to search"
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
      </form>
    </Paper>
  </Wrapper>
)

SearchBar.propTypes = {
  change: PropTypes.func.isRequired
}

export default withStyles(styles)(SearchBar);

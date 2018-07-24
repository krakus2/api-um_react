import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, } from 'react-router-dom';
import styled from "styled-components";
import { compose } from 'recompose';
import InlineError from './Messages/InlineError';
import { verifyLine } from '../utils'
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../ContextComp'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/icons/Face';
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';

  const Nav = styled.div`
    width: 70vw;
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #c8e6c9;
    margin-top: 0;
    -webkit-box-shadow: 0 1px 2px #777;
    -moz-box-shadow: 0 2px 1px #777;
    box-shadow: 0 2px 1px #777;
    font-family: 'Roboto', sans-serif;
    border-radius: 2px;
  `

  const FirstPart = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-left: 20px;
    width: 50%;
  `

  const SecondPart = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 20px;
    width: 50%;
  `

  const SecondPartAuth = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  `

  const styles = theme => ({
      buttonLarge: {
        margin: theme.spacing.unit,
        fontSize: '20px',
        padding: '0 20px 0 45px'
      },
      button: {
        margin: theme.spacing.unit,
        fontSize: '14px'
      },
      icon: {
        margin: '0 5px 0 0',
        top: 5,
        left: 18,
        position: 'absolute'
      },
      input: {
        display: 'none',
        /*color: 'blue',
        fontSize: '36px'*/
      },
      root: {
        width: '70vw',
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      chip: {
        margin: theme.spacing.unit

      },
      span: {
        fontSize: 16,
        paddingLeft: 25
      },
      span2: {
        fontSize: 14,
      },
      favLineRoot: {
        margin: "0 5px"
      },
      avatar: {
        cursor: "pointer",
        width: '32px',
        color: '#616161',
        height: '32px',
        marginRight: '-4px'
      },
      tooltip: {
        fontSize: 11,
      },
      avatar2: {
        margin: 10,
      },
      textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 52,
      },
      TheInput: {
      		fontSize: 14,
          textAlign: "center",
      },
      TheHelper: {
        fontSize: 11,
        textAlign: "center",
        marginTop: 2
      },
      chip: {
        margin: theme.spacing.unit / 2,
      },
    });

    const HomeLink = props => <Link to="/" {...props} />

    const StylHomeLink = styled(HomeLink)`
    text-decoration: none;

      &:focus, &:hover, &:visited, &:link, &:active {
         text-decoration: none;
         color: white;
      }
    `

    const LogRegLink = props => <Link to="/login" {...props} />

    const StylLogRegLink = styled(LogRegLink)`
    text-decoration: none;

      &:focus, &:hover, &:visited, &:link, &:active {
         text-decoration: none;
         color: white;
      }
    `

class NavBar extends Component {

  state = {
    line: "",
    favLines: [],
    favLineErr: false
  }

  handleClick = () => {
    const { history } = this.props;
    this.props.context.changeAuthStatus()
    history.push("/");
  }

  onAvatarClick = (e) => {
    e.stopPropagation()
    const { history } = this.props;
    console.log("kliknales w avatar")
    history.push("/userAccount");
  }

  handleChange = name => e => {
    this.setState({ [name]: e.target.value,
     favLineErr: false })
  };

  onFavLineSubmit = e => {
    e.preventDefault()
    let { favLines, line } = this.state
    line = line.trim()
    if(verifyLine(line)){
      favLines.push(line)
      this.setState({
        favLines,
        line: ""
      });
    } else {
      this.setState({
        favLineErr: true
      });
    }
  }

  handleFavDelete = line => e => {
    const { favLines } = this.state
    favLines.splice(favLines.indexOf(line), 1)
    this.setState({ favLines })
  }

  render() {
    const { favLines, favLineErr, line } = this.state
    let { classes, context } = this.props;
    let { auth } = context.state

    return (
      <AppBar className={classes.root} position="static" color="default">
        <FirstPart>
          <Button variant="contained" color="secondary" className={classes.buttonLarge} size="large" component={StylHomeLink}>
            <Icon classes={{root: classes.icon, /*colorPrimary: classes.colorPrimary, fontSizeInherit: classes.fontSizeInherit*/}}>
              departure_board
            </Icon>
            FindBus
          </Button>
        </FirstPart>
        <SecondPart>
        {
          !auth ?
          <Button variant="contained" color="primary" className={classes.button} size="large" component={StylLogRegLink} >
            Login
          </Button>
            :
          <SecondPartAuth>
          {/*<Avatar className={classes.avatar}>H</Avatar>*/}
          {/*dodac avatar do kazdego favline z kolorem pasujacym do znacznikow na mapie*/}
            {favLines.map((elem, i) => (
                <Chip
                  key={i}
                  //avatar={avatar}
                  label={elem}
                  onDelete={this.handleFavDelete(elem)}
                  classes={{root: classes.favLineRoot, label: classes.span2}}
                />
              ))
            }
            <form className={classes.container} noValidate autoComplete="off" style={{
              marginRight: "20px" }} onSubmit={this.onFavLineSubmit}>
              <TextField
                id="favLine"
                helperText={ favLineErr && "Wrong line"}
                error={favLineErr ? true : false}
                className={classes.textField}
                value={this.state.line}
                onChange={this.handleChange("line")}
                margin="normal"
                placeholder="Fav Line"
                InputProps={{
                  classes: {
                    input: classes.TheInput,
                  },
                }}
                FormHelperTextProps={{
                  classes: {
                    root: classes.TheHelper
                  }
                }}
              />
            </form>
            <Chip
               avatar={
                 <Tooltip title="Your account" classes={{tooltip: classes.tooltip }} TransitionComponent={Zoom}
                   placement="bottom">
                   <Avatar onClick={this.onAvatarClick} classes={{root: classes.avatar}}>
                     <FaceIcon />
                   </Avatar>
                 </Tooltip >
               }
               label="Logout"
               onDelete={this.handleClick}
               classes={{root: classes.chip, label: classes.span}}
           />
          </SecondPartAuth>
        }
        </SecondPart>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const withStyleAndContext = compose(
  withRouter,
  withContext,
  withStyles(styles),
);

export default withStyleAndContext(NavBar)

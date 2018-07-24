import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, } from 'react-router-dom';
import styled from "styled-components";
import { compose } from 'recompose';
import InlineError from './Messages/InlineError';
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

  handleClick = () => {
    const { history } = this.props;
    this.props.context.changeAuthStatus()
    history.push("/");
  }

  onAvatarClick = (e) => {
    e.stopPropagation()
    console.log("kliknales w avatar")
  }

  render() {
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
          auth ?
          <Button variant="contained" color="primary" className={classes.button} size="large" component={StylLogRegLink} >
            Login
          </Button>
            :
          <div>
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
          </div>
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

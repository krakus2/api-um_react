import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, } from 'react-router-dom';
import { auth, db } from '../firebase/index';
import '../styles/NavBar.css'
import * as routes from '../constants/routes';
import styled from "styled-components";
import { compose } from 'recompose';
import { verifyLine, getColor } from '../utils'
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../context/ContextComp'
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/icons/Face';
import FaceIcon from '@material-ui/icons/Face';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

  const FirstPart = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-left: 20px;
    width: 25%;
  `

  const SecondPart = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 20px;
    width: 75%;
  `

  const SecondPartAuth = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    wrap: no-wrap;
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
        margin: theme.spacing.unit,

      },
      span: {
        fontSize: 15,
        paddingLeft: 25
      },
      span2: {
        fontSize: 15,
      },
      favLineRoot: {
        margin: "2px 5px"
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
        width: 30,
      },
      TheInput: {
      		fontSize: 15,
          textAlign: "center",
          paddingBottom: 3,
          paddingTop: 0,
          top: 105
      },
      TheHelper: {
        fontSize: 11,
        textAlign: "center",
        marginTop: 2
      },
      progress: {
        margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
      },
    });

    const HomeLink = props => <Link to={routes.MAIN_PAGE} {...props} />

    const StylHomeLink = styled(HomeLink)`
    text-decoration: none;

      &:focus, &:hover, &:visited, &:link, &:active {
         text-decoration: none;
         color: white;
      }
    `

    const LogRegLink = props => <Link to={routes.LOGIN} {...props} />

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
    favLines: {},
    favLineErr: false,
    loader: true
    //clickTrueFalse: false
  }

  handleLogoutClick = () => {
    const { history } = this.props;
    if(window.navigator.onLine){
      auth.doSignOut();
      this.props.context.changeAuthStatus()
      history.push(routes.MAIN_PAGE);
    } else {
      alert("You don't have internet connection")
    }
    
  }

  onAvatarClick = (e) => {
    e.stopPropagation()
    const { history } = this.props;
    console.log("kliknales w avatar")
    history.push(routes.USER_ACCOUNT);
  }

  handleChange = name => e => {
    this.setState({ [name]: e.target.value,
     favLineErr: false })
  };

  onFavLineSubmit = e => {
    e.preventDefault()
    let { favLines, line } = this.state
    line = line.trim().toUpperCase()
    if(window.navigator.onLine){
      const arr = Object.keys(favLines).map(k => favLines[k])
      favLines = new Set(arr.reverse())
      if(verifyLine(line)){
        favLines.add(line)
        const obj = Array.from(favLines).reverse().reduce((acc, cur, i) => {
          acc[i] = cur;
          return acc;
        }, {});
        this.setState({
          favLines: obj,
          line: ""
        });
        //firebase.User().then(user => console.log(user.id))
        console.log("wpierdalam do bazy", this.props.context.state.uid, obj)
        db.updateLines(this.props.context.state.uid, obj)
      } else {
        this.setState({
          favLineErr: true
        });
      }
    } else {
      alert("You don't have internet connection")
    }
    
  }

  handleFavDelete = line => e => {
    const { favLines } = this.state
    if(window.navigator.onLine){
      for (var key in favLines) {
        if (favLines[key] === line) delete favLines[key];
    }
    this.setState({ favLines, [line]: false })
    db.updateLines(this.props.context.state.uid, favLines)
    this.props.onFavClickOff(line)
    } else {
      alert("You don't have internet connection")
    }
  }

  handleFavClick = line => e => {
    console.log(line, "line z handleFavClick")
    if(this.state[line] === undefined){
      this.setState({ [line]: true })
    } else if(this.state[line] === true){
      this.setState({ [line]: false })
    } else {
      this.setState({ [line]: true })
    }

    !this.state[line] ? this.props.onFavClickOn(line) : this.props.onFavClickOff(line)
  }

  waitFor = (condition, callback) => {
      if(!condition()) {
          //console.log('waiting');
          window.setTimeout(this.waitFor.bind(null, condition, callback), 100); /* this checks the flag every 100 milliseconds*/
      } else {
          //console.log('done');
          callback();
      }
  }

  componentDidMount(){
    //TODO check loading when there is no internet connection
    if(window.navigator.onLine){
      //console.log("odczytuje z bazy0", this.props.context.state.auth)
      if(this.props.context.state.auth){
        //console.log("odczytuje z bazy1")
        this.waitFor(() => !!this.props.context.state.uid, () =>
        db.getLines(this.props.context.state.uid)
          .then(snapshot => {
            if(snapshot.val()){
              //console.log(snapshot.val().lines)
              this.setState({
                favLines: snapshot.val().lines,
                loader: false
              })
            } else {
              this.setState({
                favLines: {},
                loader: false
              })
            }
          })
        )
      } else {
        this.setState({
          favLines: {},
          loader: false
        })
      }
    }
  }

  render() {
    const { favLines, favLineErr, loader } = this.state
    let { classes, context } = this.props;
    let { auth } = context.state
    let arr = Object.keys(favLines).map(k => favLines[k])

    return (
      <AppBar className={classes.root} position="static" color="default">
        <FirstPart>
          <Button variant="contained" color="secondary" className={classes.buttonLarge} 
            size="large" component={StylHomeLink}>
            <Icon classes={{root: classes.icon}}>
              departure_board
            </Icon>
            FindBus
          </Button>
        </FirstPart>
        <SecondPart>
        {
          !auth ?
          <Button variant="contained" color="primary" className={classes.button} 
            size="large" component={StylLogRegLink} >
            Login
          </Button>
            :
          <SecondPartAuth>
            {
              loader && <CircularProgress className={classes.progress} size={30} />
            }
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={150}>
            {
              arr.map((elem, i) => (
                <Chip
                  style={ {backgroundColor: !this.state[elem] ? "#e0e0e0" : 
                    `${getColor(elem)}`} }
                  key={elem}
                  clickable={true}
                  //avatar={avatar}
                  label={elem}
                  onDelete={this.handleFavDelete(elem)}
                  onClick={this.handleFavClick(elem)}
                  classes={{root: classes.favLineRoot, label: classes.span2,
                    }}
                />
              ))
            }
            </ReactCSSTransitionGroup>
            <form className={classes.container} noValidate autoComplete="off" style={{
              marginRight: "20px" }} onSubmit={this.onFavLineSubmit}>
              <Tooltip title="Add your favourite line" classes={{tooltip: classes.tooltip }} 
                TransitionComponent={Zoom} placement="bottom">
                <TextField
                  id="favLine"
                  helperText={ favLineErr && "Wrong line"}
                  error={favLineErr ? true : false}
                  className={classes.textField}
                  value={this.state.line}
                  onChange={this.handleChange("line")}
                  margin="normal"
                  //placeholder="Fav Line"
                  //label="LINE"
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
            </Tooltip>
            </form>
            <Chip
              avatar={
                <Tooltip title="Your account" classes={{tooltip: classes.tooltip }} 
                  TransitionComponent={Zoom} placement="bottom">
                  <Avatar onClick={this.onAvatarClick} classes={{root: classes.avatar}}>
                    <FaceIcon />
                  </Avatar>
                </Tooltip >
              }
              label="Logout"
              onDelete={this.handleLogoutClick}
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

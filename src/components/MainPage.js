import React, { Component } from 'react';
import SearchBar from './SearchBar';
import InlineError from './Messages/InlineError'
import Favs from './Favs'
import NavBar from './NavBar'
import styled from "styled-components";
import { Link } from 'react-router-dom'
//import { base } from '../firebase/firebase';
import { MyConsumer } from "../ContextComp";
import { verifyLine } from '../utils'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
`

const SearchBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100vw;
`

class MainPage extends Component {

  state = {
    writingLine: "",
    line: null,
    wrongLineNum: {
      value: false,
      num: []
    },
    login: "",
    password: "",
    loading: false
  }

  blur = e => {
    if(!this.state.writingLine)
      this.setState({ wrongLineNum: { value: false }})
  }

  submitLine = e => {
    e.preventDefault()
    const num = []
    const line = new Set()
    const regexp = /\s{2,}/gi
    this.setState({ wrongLineNum: { value: false }})
    console.log(this.state.writingLine)
    if(this.state.writingLine.length){
      let value = this.state.writingLine.trim()
      //console.log(value)
      if(!!value.match(regexp)){
        value = value.replace(regexp, " ")
      }

      value.split(" ").forEach(elem => {
        if(!verifyLine(elem)){
          num.push(elem)
          this.setState({
            wrongLineNum: { value: true, num }
          })
        } else {
          line.add(elem)
        }
      })

      const obj = Array.from(line).reduce((acc, cur, i) => {
        acc[i] = cur;
        return acc;
      }, {});
      console.log(obj)
      //const line = [1, 2, 3]
      this.setState({ line: obj })
    } else {
      this.setState({
        wrongLineNum: { value: true, num: [] }
      })
    }
  }



  changeLine = name => e => {
    console.log(e.target.value)
    this.setState({ [name]: e.target.value })
  }

  /*componentWillMount() {
    this.linesRef = base.syncState('line', {
      context: this,
      state: 'line'
    });

    this.authRef = base.syncState('auth', {
      context: this,
      state: 'auth'
    });
  }*/


  /*componentWillUnmount() {
    base.removeBinding(this.linesRef);
    base.removeBinding(this.authRef);
  }*/


  render() {
    const { wrongLineNum, auth } = this.state
    const { context } = this.props;
    return (
      <Wrapper>
      <NavBar />
        <TopSection>
          <SearchBarWrapper>
            <SearchBar change={this.changeLine("writingLine")} submit={this.submitLine} blur={this.blur}/>
            { (wrongLineNum.value && wrongLineNum.num.length) ?
              <InlineError text={`There is no line like ${wrongLineNum.num.join(", ")}`}/> : null }
            {(wrongLineNum.value && !wrongLineNum.num.length) ?
              <InlineError text={`Type anything to search`}/> : null}
          </SearchBarWrapper>
        </TopSection>
      </Wrapper>
    );
  }
}

export default props => (
  <MyConsumer.Consumer>
    {context => <MainPage {...props} context={context} />}
  </MyConsumer.Consumer>
);

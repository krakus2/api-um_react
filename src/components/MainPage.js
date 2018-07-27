import React, { Component } from 'react';
import SearchBar from './SearchBar';
import InlineError from './Messages/InlineError'
import NavBar from './NavBar'
import Map from './Map'
import styled from "styled-components";
import { MyConsumer } from "../context/ContextComp";
import { verifyLine } from '../utils'
import axios from 'axios'

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
    loading: false,
    avgLat: null,
    avgLng: null
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
      //console.log(obj)
      //const line = [1, 2, 3]
      this.setState({ line: obj }, () => {
        this.queryAxios()
      })
      
    } else {
      this.setState({
        wrongLineNum: { value: true, num: [] }
      })
    }
  }

  queryAxios = () => {
    const { line } = this.state
    const urlArray = []
    const results = []
    let type, avgLat = 0, avgLng = 0
    console.log(process.env.REACT_APP_API_UM)
    Object.values(line).map((elem, i) => {
      (elem.length === 3) ? type = 1 : type = 2;
      urlArray.push(`https://thingproxy.freeboard.io/fetch/https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e-927d-4ad3-9500-4ab9e55deb59&apikey=${process.env.REACT_APP_API_UM}&type=${type}&line=${elem}`)
    })
    const promiseArray = urlArray.map( url => axios.get(url))
    axios.all(promiseArray)
    .then(data => {
      data
        .map(elem => elem.data.result)
        .reduce((a, b) => a.concat(b), [])
        .map(elem => {
          results.push([elem.Lines, elem.Lat, elem.Lon])
          avgLat += elem.Lat
          avgLng += elem.Lon
        })
        //console.log(results, avgLat/results.length , avgLng/results.length)
      this.setState({ results, avgLat: avgLat/results.length, avgLng: avgLng/results.length },
      () => {
        this.showOnMap()
      })
    })
  }

  showOnMap = () => {
    console.log(this.state.results, this.state.avgLat, this.state.avgLng)
  }



  changeLine = name => e => {
    console.log(e.target.value)
    this.setState({ [name]: e.target.value })
  }

  handleMarkerClick = () => {
    console.log("Kliknales w marker!")
  }


  render() {
    const { wrongLineNum, results, avgLat, avgLng } = this.state
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
        <Map 
          isMarkerShown={true}
          onMarkerClick={this.handleMarkerClick}
          markers={results}
          defaultCenter={[avgLat, avgLng]}
          />
      </Wrapper>
    );
  }
}

export default props => (
  <MyConsumer>
    {context => <MainPage {...props} context={context} />}
  </MyConsumer>
);

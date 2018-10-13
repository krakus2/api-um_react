import React, { Component } from 'react';
import MainPage from './MainPage'
import MainPage_Mob from './MainPage_Mob'
import SearchBar from './SearchBar';
import InlineError from './Messages/InlineError'
import NavBar from './NavBar'
import Map from './Map'
import styled from "styled-components";
import { MyConsumer } from "../context/ContextComp";
import { verifyLine, getColor } from '../utils'
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
  width: 70%;
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
    line: [],
    favLines: [],
    wrongLineNum: {
      value: false,
      num: []
    },
    login: "",
    password: "",
    loading: false,
    avgLat: null,
    avgLng: null,
    emptyResult: false,
    searchCounter: false,
    autoRefresh: false
  }

  submitLine = (e, afterFavOff = false) => {
    //TODO 
    //zeby po submit nie centerowal na stare autobusy!!!
    if(e){
      e.preventDefault()
    }
    clearInterval(this.interval)
    this.setState({ searchCounter: true })

    const num = []
    const lineSet = new Set()
    const favLines = this.state.favLines
    let { line } = this.state
    const regexp = /\s{2,}/gi
    this.setState({ wrongLineNum: { value: false, num: [] }, emptyResult: false})
    let value = this.state.writingLine.trim()

    if(afterFavOff){
      line.splice(line.indexOf(afterFavOff), 1)
      if(line.length === 0){
        clearInterval(this.interval)
      }
      this.setState({ line })
    }

    if(value){
      //console.log(value)
      if(!!value.match(regexp)){
        value = value.replace(regexp, " ")
      }

      value.split(" ").forEach(elem => {
        if(!verifyLine(elem)){
          num.push(elem)
          this.setState({
            wrongLineNum: { value: true, num, loading: false  }
          })
        } else {
          lineSet.add(elem)
        }
      })
    } else {
        if(!favLines.length && !afterFavOff){
          this.setState({
            wrongLineNum: { value: true, num: [], loading: false  }
          })
        }
    }

    if(favLines.length){
      favLines.forEach(elem => {
        lineSet.add(elem)
      })
    }

    line = Array.from(lineSet)
    if(line.length){
      this.setState({ line }, () => {
        this.queryAxios()
      })
    } else {
      this.setState({ results: [], loading: false  })
    }
  }

  queryAxios = () => {
    console.log("console log z funkcji queryAxios")
    const { line, searchCounter } = this.state
    const urlArray = []
    const results = []
    let type, avgLat = 0, avgLng = 0

    line.map((elem, i) => {
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
      if(searchCounter){
        this.setState({ results, avgLat: avgLat/results.length, 
          avgLng: avgLng/results.length, loading: false },
          () => {
            this.setState({ searchCounter: false })
            if(!results.length){
              this.setState({ emptyResult: true })
            }
            this.interval = setInterval(this.autoRefresh, 5000)
          })
      } else {
        this.setState({ results, loading: false },
          () => {
            if(!results.length){
              this.setState({ emptyResult: true})
            }
          })
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  changeLine = name => e => {
    //console.log(e.target.value)
    this.setState({ [name]: e.target.value.toUpperCase() })
  }

  handleMarkerClick = () => {
    console.log("Kliknales w marker!")
  }

  componentDidMount() {
    //console.log(getColor("120"), getColor(345))
    //console.log("mainpage", this.props.context.state.auth)
    //this.interval = setInterval(this.autoRefresh, 5000)
  }

  componentWillUnmount(){
    if(this.interval){
      clearInterval(this.interval)
    }
  }

  onFavClickOn = (elem) => {
    const { favLines } = this.state
    favLines.push(elem)
    this.setState({ favLines }, () => {
      this.submitLine()
    })
  }

  onFavClickOff = elem => {
    const { favLines } = this.state
    favLines.splice(favLines.indexOf(elem), 1)
    this.setState({ favLines }, () => {
      this.submitLine(null, elem)
    })
  }

  blur = e => {
    if(!this.state.writingLine)
      this.setState({ wrongLineNum: { value: false }})
  }

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  
  autoRefresh = () => {
    if(this.state.results && this.state.autoRefresh){
      console.log("nowe zapytanie do axiosa leci")
        this.queryAxios()
    }
  }

  onSearchClick = () => {
    this.setState(state => ({
      loading: !state.loading,
    }));
  }


  render() {
    const { wrongLineNum, results, avgLat, avgLng, emptyResult, searchCounter,
      autoRefresh, loading } = this.state
    return (
    <MediaQuery maxDeviceWidth={1224}>
        <MainPage_Mob state2={...this.state}/>>
    </MediaQuery>
    <MediaQuery minDeviceWidth={1224}>
        <MainPage/>>
    </MediaQuery>
      <Wrapper>
      <NavBar onFavClickOn={this.onFavClickOn} onFavClickOff={this.onFavClickOff}/>
        <TopSection>
          <SearchBarWrapper>
            <SearchBar change={this.changeLine("writingLine")} submit={this.submitLine} 
              blur={this.blur} autoRefresh={autoRefresh} loading={loading} 
              handleSwitchChange={this.handleSwitchChange} 
              onSearchClick={this.onSearchClick} />
            { (wrongLineNum.value && wrongLineNum.num.length) ?
              <InlineError text={`There is no line like ${wrongLineNum.num.join(", ")}`}/> : null }
            {(wrongLineNum.value && !wrongLineNum.num.length) ?
              <InlineError text={`Type anything to search`}/> : null}
            { emptyResult &&  
            <InlineError text={`There isn't any bus on map. Try something else`}/>}
          </SearchBarWrapper>
        </TopSection>
        <Map 
          isMarkerShown={true}
          onMarkerClick={this.handleMarkerClick}
          markers={results}
          defaultCenter={[avgLat, avgLng]}
          searchCounter={searchCounter}
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

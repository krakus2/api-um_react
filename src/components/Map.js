import React, {Component} from 'react';
import { compose, withProps, withHandlers, withState, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { getColor } from '../utils'

class MapComponent extends Component {

  state = {
    zoom: 11
  }

  updateLinesTrue = (line) => () => {
    this.setState({ [line]: true })
  }

  updateLinesFalse = (line) => () => {
    this.setState({ [line]: false })
  }

  onZoomChanged = (event) => {
    console.log(event)
  }

  pinSymbol = (color) => {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}

  render(){
    const { searchCounter } = this.props
    let myProps = {}
    let myProps2 = {}
    if(this.props.defaultCenter[0] && searchCounter){
      myProps.center = {
        lat: this.props.defaultCenter[0],
        lng: this.props.defaultCenter[1]
      }
    } 
    if(searchCounter){
      myProps2.zoom = 11
    }

    return (
      <GoogleMap
        defaultZoom={11}
        defaultCenter={{ lat: 52.22977, lng: 21.01178 }}
        ref={this.props.onMapMounted}
          //TODO - spytaj damiana o tego refa 
        onZoomChanged={this.props.onZoomChanged}
        {...myProps}
        {...myProps2}
        
     >
        {
          this.props.markers && this.props.markers.map((elem, i) => (
            <Marker key={`${elem[0]}${i}`} position={{ lat: elem[1], lng: elem[2] }} 
              onClick={this.updateLinesTrue(`${elem[0]}${i}`)} 
              icon={this.pinSymbol(getColor(elem[0]))}
            >
              {
                this.state[`${elem[0]}${i}`] &&
                <InfoWindow onCloseClick={this.updateLinesFalse(`${elem[0]}${i}`)}>
                  <p>{elem[0]}</p>
                </InfoWindow>
              }
            </Marker>
          ))
        }
      </GoogleMap>
    )
  }
}

const Map = compose(
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS}`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `500px`, width: "70%", marginTop: "30px",
        borderRadius: "4px", boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)" }} />,
      mapElement: <div style={{ height: `100%`, borderRadius: "4px" }} />,
    }),
    withState('zoom', 'onZoomChange', 8),
    withHandlers(() => {
      const refs = {
        map: undefined,
      }

      return {
        onMapMounted: () => ref => {
          refs.map = ref
        },
        onZoomChanged: ({ onZoomChange }) => () => {
          onZoomChange(refs.map.getZoom())
        }
      }
    }),
    lifecycle({
      componentDidUpdate(prevProps, prevState) {
       // console.log(this.props.zoom)
      }
    }),
    withScriptjs,
    withGoogleMap
  )(MapComponent)

export default Map;
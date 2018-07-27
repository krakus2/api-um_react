import React from 'react';
import styled from "styled-components";
import { MyConsumer } from "../context/ContextComp";
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"



const Map = compose(
    withProps({
      googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS}`,
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `500px`, width: "70%", marginTop: "30px",
        borderRadius: "4px", boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)" }} />,
      mapElement: <div style={{ height: `100%`, borderRadius: "4px" }} />,
    }),
    lifecycle({
        componentDidMount(){
            console.log(this.props.markers)
        }
    }),
    withScriptjs,
    withGoogleMap
  )((props) =>
    <GoogleMap
      defaultZoom={11}
      defaultCenter={{ lat: props.defaultCenter[0] ? props.defaultCenter[0] : 52.22977, 
        lng: props.defaultCenter[1] ? props.defaultCenter[1] : 21.01178 }}
    >
      {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />}
      {props.markers && props.markers.map((elem, i) => (
        <Marker key={`${elem[0]}${i}`} position={{ lat: elem[1], lng: elem[2] }} />
      ))}
    </GoogleMap>
  )

export default Map;

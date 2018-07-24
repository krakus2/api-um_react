import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text }) => (
  <span style={{color: "#ae5856", fontSize: "14px",
    width: "auto", marginTop: "5px", textAlign: "center"}}>{text}</span>
)

InlineError.propTypes = {
  text: PropTypes.string.isRequired
}

export default InlineError;

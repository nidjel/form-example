import React, { Component } from 'react';

class Field extends Component {
  state = {
    value: this.props.value || '',
    errorMessage: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        ...this.state,
        value: nextProps.value
      })
    }
  }

  handleChange = (e) => {
    const value = e.target.value
    const errorMessage = this.props.validate(value)
    if (errorMessage) {
      this.setState({
        value,
        errorMessage
      }, () => this.props.onChange({target: {value, name: this.props.name}}, errorMessage))
    } else {
      this.setState({
        value,
        errorMessage: ''
      }, () => this.props.onChange({target: {value, name: this.props.name}}, errorMessage))
    }
  }
  
  render() {
    const {name, placeholder} = this.props;
    const {value, errorMessage} = this.state;
    
    return (
      <div>
        <input type='text' name={name} placeholder={placeholder} value={value} onChange={this.handleChange} />{' '}
        <span>{errorMessage}</span><br/>
      </div>
    )
  }
}

export default Field
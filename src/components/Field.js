import React, { Component } from 'react'
import '../styles/Field.css'

class Field extends Component {
  state = {
    value: this.props.value || '',
    errorMessage: ''
  }

  componentWillReceiveProps(update) {
    if (update.value !== this.state.value) {
      this.setState({
        ...this.state,
        value: update.value
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
      }, () => this.props.onChange(this.props.name, value, errorMessage))
    } else {
      this.setState({
        value,
        errorMessage: ''
      }, () => this.props.onChange(this.props.name, value, errorMessage, errorMessage))
    }
  }
  
  render() {
    const {name, placeholder} = this.props;
    const {value, errorMessage} = this.state;
    
    return (
      <div>
        <input className='input' type='text' name={name} placeholder={placeholder} value={value} onChange={this.handleChange} /><br/>
        <span style={{color: 'red', fontSize: '12px'}}>{errorMessage}</span><br/>
      </div>
    )
  }
}

export default Field
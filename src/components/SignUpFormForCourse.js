import React, { Component } from 'react'
import {validate} from 'email-validator'

import Field from './Field'
import SelectCourse from './SelectCourse'

import client from '../helpers/client'
import '../styles/SignUpFormForCourse.css'

class SignUpFormForCourse extends Component {
  state = {
    fields: {
      name: '',
      email: '',
      faculty: '',
      course: '',
    },
    fieldErrors: {},
    _saveStatus: 'READY'
  }

  handleChange = (name, value, fieldError) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      },
      fieldErrors: {
        ...this.state.fieldErrors,
        [name]: fieldError
      },
      _saveStatus: 'READY'
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.validate()) {
      this.savePerson()
    }
  }
  
  validate = () => {
    const values = Object.values(this.state.fields)
    const fieldErrors = Object.values(this.state.fieldErrors)
    if (values.every(v => v) && !fieldErrors.some(v => v)) {
      return true
    } else {
      return false
    }
  }
  
  savePerson = () => {
    const person = this.state.fields
    this.setState({
      _saveStatus: 'SAVING'
    })
    client.savePerson(person, (err) => {
      if (err) {
        this.setState({
          _saveStatus: 'ERROR'
        })
      } else {
        this.setState({
          _saveStatus: 'SAVED'
        })
        this.props.onSavePerson(person)
      }
    })
  }

  render() {
    const {fields:{name, email}} = this.state;
    
    return (
      <div className='form-container'>
        <h2>Форма регистрации</h2>
        <form onSubmit={this.handleSubmit} >
          <Field 
            name='name' 
            placeholder='Ваше имя' 
            value={name} 
            validate={(val) => val ? null : 'введите корректное имя'}
            onChange={this.handleChange}
          />
          <Field 
            name='email' 
            placeholder='Ваш email' 
            value={email} 
            validate={(val) => validate(val) ? null : 'введите корректный email'}
            onChange={this.handleChange}
          />
          <SelectCourse
            onChange={this.handleChange}
          />
          {{
            READY: <button className='button' type='submit' disabled={!this.validate()}>Записаться</button>,
            SAVING: <button className='button' type='submit' disabled>Сохраняю...</button>,
            ERROR: <button className='button' type='submit' disabled={!this.validate()}>Попробуйте снова</button>,
            SAVED: <button className='button' type='submit' disabled>Сохранено</button>,
          }[this.state._saveStatus]}
        </form>
      </div>
    )
  }
}

export default SignUpFormForCourse
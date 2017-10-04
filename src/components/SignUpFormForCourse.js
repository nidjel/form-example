import React, { Component } from 'react';
import Field from './Field'
import client from '../helpers/client'

class SignUpFormForCourse extends Component {
  state = {
    faculties: [],
    courses: [],
    fields: {
      name: '',
      email: '',
      faculty: '',
      course: '',
    },
    fieldErrors: {},
    _loading: null,
    _saveStatus: 'READY'
  }

  componentDidMount() {
   this.loadData()
  }

  handleChange = (e, fieldError) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value
      },
      fieldErrors: {
        ...this.state.fieldErrors,
        [e.target.name]: fieldError
      },
      _saveStatus: 'READY'
    })
    if (e.target.name === 'faculty') {
      this.setState({
        courses: [],
      })
    }
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.validate()) {
      this.savePerson()
    }
  }
  
  loadData = () => {
    this.setState({_loading: 'loading'})
    client.getFaculties((err, faculties) => {
      if (err) {
        this.setState({_loading: 'error'})
      } else {
        this.setState({faculties, _loading: 'loaded'})
      }
    })
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
    const {faculties, courses, _loading, fields:{faculty, name, email}} = this.state;
    let facultySelect, courseSelect;
    
    if (_loading === 'loading') {
      facultySelect = (<span>загрузка...</span>)
    } else if (_loading === 'error') {
      facultySelect = (<span>ошибка сервера</span>)
    } else {
      facultySelect = (
        <select name='faculty' onChange={this.handleChange}>
          <option value={''}>Выберите факультет</option>
          {faculties.map((f, i) => <option key={i} value={f}>{f}</option>)}
        </select>
      )
    }
    
    if (faculty && !courses.length) {
      courseSelect = (<span>загрузка...</span>)
      client.getCourses(faculty, (err, courses) => {
        if (err) {
          courseSelect = (<span>ошибка сервера</span>)
        } else {
          this.setState({courses})
        }
      })
    } else if (courses.length > 0) {
      courseSelect = (
        <select name='course' onChange={this.handleChange}>
          <option value={''}>Выберите курс</option>
          {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
      )
    } else {
      courseSelect = null
    }
    
    return (
      <div>
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
            validate={(val) => val ? null : 'введите корректный email'}
            onChange={this.handleChange}
          />
          {facultySelect}<br/>
          {courseSelect}<br/>
          {{
            READY: <button type='submit' disabled={!this.validate()}>Записаться</button>,
            SAVING: <button type='submit' disabled>Сохраняю...</button>,
            ERROR: <button type='submit' disabled={!this.validate()}>Попробуйте снова</button>,
            SAVED: <button type='submit' disabled>Сохранено</button>,
          }[this.state._saveStatus]}

        </form>
      </div>
    )
  }
}

export default SignUpFormForCourse
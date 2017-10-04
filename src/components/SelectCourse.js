import React, { Component } from 'react'
import client from '../helpers/client'
import '../styles/SelectCourse.css'

class SelectCourse extends Component {
  state = {
    faculties: [],
    courses: [],
    faculty: '',
    course: '',
    _loading: null,
  }

  componentDidMount() {
    client.getFaculties((err, faculties) => {
      if (err) {
        this.setState({
          _loading: 'error'
        })
      } else {
        this.setState({
          faculties
        })
      }
    })
  }

  handleChange = (e) => {
    const {name, value} = e.target
    
    if (name === 'faculty') {
      this.setState({
        [name]: value,
        courses: [],
      })
    } else {
      this.setState({
        [name]: value
      })
    }
    this.props.onChange(name, value, '')
  }
  
  render() {
    const {faculties, courses, _loading, faculty} = this.state;
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
      <div className='select'>
        {facultySelect}<br/>
        {courseSelect}<br/>
      </div>
    )
  }
}

export default SelectCourse
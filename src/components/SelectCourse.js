import React, { Component } from 'react'
import client from '../helpers/client'
import '../styles/SelectCourse.css'

class SelectCourse extends Component {
  state = {
    faculties: [],
    courses: [],
    faculty: this.props.faculty || '',
    course: this.props.course || '',
    _loading: null,
  }

  componentDidMount() {
    this.setState({
      _loading: 'loading',
    })
    client.getFaculties((err, faculties) => {
      if (err) {
        this.setState({
          _loading: 'error'
        })
      } else {
        this.setState({
          faculties,
          _loading: 'loaded'
        })
      }
    })
  }

  componentWillReceiveProps({faculty, course}) {
    if (faculty !== this.state.faculty || course !== this.state.course) {
      this.setState({
        faculty,
        course
      })
    }  
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
    const {faculties, courses, _loading, faculty, course} = this.state;
    
    const renderFacultySelect = () => {
      let facultySelect
      if (_loading === 'loading') {
        facultySelect = (<span>загрузка...</span>)
      } else if (_loading === 'error') {
        facultySelect = (<span>ошибка сервера</span>)
      } else if (_loading === 'loaded') {
        facultySelect = (
          <select name='faculty' value={faculty} onChange={this.handleChange}>
            <option value={''}>Выберите факультет</option>
            {faculties.map((f, i) => <option key={i} value={f}>{f}</option>)}
          </select>
        )
      } else {
        facultySelect = null
      }
      return facultySelect
    }
    
    const renderCourseSelect = () => {
      let courseSelect
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
          <select name='course' value={course} onChange={this.handleChange}>
            <option value={''}>Выберите курс</option>
            {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        )
      } else {
        courseSelect = null
      }
      return courseSelect
    }
    
    
    return (
      <div className='select'>
        {renderFacultySelect()}<br/>
        {renderCourseSelect()}<br/>
      </div>
    )
  }
}

export default SelectCourse
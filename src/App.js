import React, { Component } from 'react';
import './App.css';

let client;

class App extends Component {
  state = {
    people: []
  }
  
  handleSavePerson = (person) => {
    this.setState({
      people: [...this.state.people, person]
    })
  }  

  render() {
    return (
      <div className="App">
        <SignUpFormForCourse onSavePerson={this.handleSavePerson} />
        <SubscribersSheet people={this.state.people} />
      </div>
    );
  }
}

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
    _loading: null
  }

  componentDidMount() {
   this.loadData()
  }

  handleChange = (e) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value
      }
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
    } else {
      
    }
  }
  
  loadData = () => {
    this.setState({_loading: 'loading'})
    client.getFaculties((err, faculties) => {
      if (err) {
        this.setState({faculties, _loading: 'error'})
      } else {
        this.setState({faculties, _loading: 'loaded'})
      }
    })
  }
  
  validate = () => {
    const values = Object.values(this.state.fields)
    if (values.every(v => v)) {
      return true
    } else {
      return false
    }
  }
  
  savePerson = () => {
    this.props.onSavePerson(this.state.fields)
  }

  render() {
    const {faculties, courses, _loading, fields:{faculty}} = this.state;
    let facultySelect, courseSelect;
    
    if (_loading === 'loading') {
      facultySelect = (<span>loading...</span>)
    } else if (_loading === 'error') {
      facultySelect = (<span>Server error</span>)
    } else {
      facultySelect = (
        <select name='faculty'>
          <option value={''}>Select faculty</option>
          {faculties.map((f, i) => <option key={i} value={f}>{f}</option>)}
        </select>
      )
    }
    
    if (faculty && !courses.length) {
      courseSelect = (<span>loading...</span>)
      client.getCourses(faculty, (err, courses) => {
        if (err) {
          courseSelect = (<span>Server error</span>)
        } else {
          this.setState({courses})
        }
      })
    } else if (courses.length > 0) {
      courseSelect = (
        <select name='course'>
          <option value={''}>Select course</option>
          {courses.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
      )
    } else {
      courseSelect = null
    }
    
    return (
      <div>
        <h2>Sign Up Form</h2>
        <form onChange={this.handleChange} onSubmit={this.handleSubmit} >
          <input type='text' name='name' placeholder='name' value={this.state.name} />
          <span>{this.state.fieldErrors.name}</span><br/>
          <input type='text' name='email' placeholder='email' value={this.state.email} />
          <span>{this.state.fieldErrors.email}</span><br/>
          {facultySelect}<br/>
          {courseSelect}<br/>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}

class SubscribersSheet extends Component {
  render() {
    const {people} = this.props
    return (
      <div>
        <h3>People</h3>
        <ul>
          {people.map((p, i) => <li key={i}>{p.name} зарегертрировался на курс: {p.course} ({p.faculty} факультет)</li>)}
        </ul>
      </div>
    )
  }
}

client = (function() {
  const getFaculties = (cb) => {
    setTimeout(() => cb(null, ['физический', 'исторический', 'философский']), 1000)
  }
  const getCourses = (faculty, cb) => {
    let courses;
    switch(faculty) {
      case 'физический': 
        courses = ['квантовая физика', 'термодинамика', 'космология']
        break
      case 'исторический':
        courses = ['история россии', 'история сша', 'история европы'] 
        break
      case 'философский':
        courses = ['философия древней греции', 'философия Шопенгауэра', 'философия Декарта']
        break
      default:
        courses = ['курсов нет']
    }
    setTimeout(() => cb(null, courses), 1000)
  }
  return {
    getFaculties,
    getCourses
  }
})()

export default App;

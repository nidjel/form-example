import React, { Component } from 'react';
import SignUpFormForCourse from './SignUpFormForCourse'
import SubscribersSheet from './SubscribersSheet'
import '../styles/App.css';

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

export default App;

import React, { Component } from 'react';

class SubscribersSheet extends Component {
  render() {
    const {people} = this.props
    return (
      <div>
        <h3>Люди</h3>
        <ul>
          {people.map((p, i) => <li key={i}>{p.name} зарегиcтрировался на курс: {p.course} ({p.faculty} факультет)</li>)}
        </ul>
      </div>
    )
  }
}

export default SubscribersSheet
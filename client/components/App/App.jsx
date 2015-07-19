import React from 'react';

export default class Home extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      test: 'react'
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className={'app'}>
        <h1>Yo from {this.state.test}</h1>
      </div>
    );
  }
}

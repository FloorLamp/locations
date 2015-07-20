import Nav from './Nav';

export default class Header extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <header>
        <img src="img/fry.png" />
        <h1>Locations</h1>

        <Nav
          search={this.props.search}
          view={this.props.view}
          handleUpdateSearch={this.props.handleUpdateSearch}
          handleChangeView={this.props.handleChangeView} />
      </header>
    );
  }
}

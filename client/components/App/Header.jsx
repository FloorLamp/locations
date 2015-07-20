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
      </header>
    );
  }
}

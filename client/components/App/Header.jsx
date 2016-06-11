import Nav from './Nav';

let Link = Router.Link;

class Header extends React.Component {

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
        <Link to={this.context.router.isActive('calendar') ? 'calendar' : 'list'}>
          <img src="img/fry.png" />
          <h1>Locations</h1>
        </Link>

        <Nav
          search={this.props.search}
          view={this.props.view}
          handleUpdateSearch={this.props.handleUpdateSearch} />
      </header>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default Header;

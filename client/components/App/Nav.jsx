class Nav extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
    }
    this.handleRoute = this.handleRoute.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleRoute() {
    this.context.router.transitionTo(this.context.router.isActive('list') ? 'calendar' : 'list', this.context.router.getCurrentParams());
  }

  render() {
    return (
      <nav>
        <input type="text" className="txt-search" value={this.props.search} onChange={this.props.handleUpdateSearch} />
        <input type="button" className="btn-view" value={this.context.router.isActive('list') ? 'Calendar' : 'List'} onClick={this.handleRoute} />
        <input type="button" className="btn-view" value="All" onClick={this.context.router.transitionTo.bind(null, 'all')} />
      </nav>
    );
  }
}

Nav.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default Nav;

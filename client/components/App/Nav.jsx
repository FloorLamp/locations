export default class Nav extends React.Component {

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
      <nav>
        <input type="text" className="txt-search" value={this.props.search} onChange={this.props.handleUpdateSearch} />
        <input type="button" className="btn-view" value={this.props.view == 'calendar' ? 'List' : 'Calendar'} onClick={this.props.handleChangeView} />
      </nav>
    );
  }
}

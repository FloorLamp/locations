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
        <input type="button" className="view-toggle" value={this.props.view == 'calendar' ? 'List View' : 'Calendar View'} onClick={this.props.handleChangeView} />
      </nav>
    );
  }
}

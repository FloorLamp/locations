class MonthBar extends React.Component {

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
      <div id="month-bar">
        {this.props.month ? this.props.month.format('MMMM YYYY') : ''}
      </div>
    );
  }
}

MonthBar.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default MonthBar;

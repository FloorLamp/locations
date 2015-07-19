import Calendar from '../Calendar/Calendar';

export default class App extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      date_range: moment.range(moment().subtract('30', 'days').startOf('week'), moment().endOf('week')),
      checkins: [],
      checkins_by_day: {}
    }
  }

  componentDidMount() {
    request({
      url: `${API_SERVER}/api/checkins`,
      json: true
    }, (err, res, data) => {
      this.setState({
        date_range: moment.range(moment.unix(data[0].created_at).startOf('month').startOf('week'), moment().endOf('week')),
        checkins: data,
        checkins_by_day: _.groupBy(data, (checkin) => moment.unix(checkin.created_at).startOf('day'))
      });
    })
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <h1>Calendar</h1>
        <Calendar
          date_range={this.state.date_range}
          checkins_by_day={this.state.checkins_by_day} />
      </div>
    );
  }
}

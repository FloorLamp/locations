import Header from './Header';
import Nav from './Nav';

import Calendar from '../Calendar/Calendar';
import List from '../List/List';
import MainMap from '../Map/Map';

export default class App extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      view: 'list',
      calendar_range: moment.range(moment().subtract('30', 'days').startOf('week'), moment().endOf('week')),
      checkins: [],
      checkins_by_day: {}
    }
    this.handleChangeView = this.handleChangeView.bind(this);
  }

  componentDidMount() {
    request({
      url: `${API_SERVER}/api/checkins`,
      json: true
    }, (err, res, data) => {
      this.setState({
        calendar_range: moment.range(moment.unix(data[0].created_at).startOf('month').startOf('week'), moment().endOf('week')),
        checkins: data,
        checkins_by_day: _.groupBy(data, (checkin) => moment.unix(checkin.created_at).startOf('day'))
      });
    })
  }

  componentWillUnmount() {
  }

  handleChangeView() {
    this.setState({
      view: this.state.view == 'calendar' ? 'list' : 'calendar'
    });
  }

  render() {
    return (
      <div>
        <Header />
        <main>
          <aside className="side-1">
            <Nav view={this.state.view} handleChangeView={this.handleChangeView} />
            {this.state.view == 'calendar' ?
            <Calendar
              calendar_range={this.state.calendar_range}
              checkins_by_day={this.state.checkins_by_day} /> :
            <List
              calendar_range={this.state.calendar_range}
              checkins_by_day={this.state.checkins_by_day} />}
          </aside>
          <aside className="side-2">
            <MainMap />
          </aside>
        </main>
      </div>
    );
  }
}

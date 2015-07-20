import Header from './Header';

import Calendar from '../Calendar/Calendar';
import List from '../List/List';
import MainMap from '../Map/Map';

export default class App extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      current_view: 'list',
      default_view: 'list',
      search: '',

      calendar_range: moment.range(moment().subtract('30', 'days').startOf('week'), moment().endOf('week')),
      checkins: [],
      checkins_by_day: {}
    }
    this.handleChangeView = this.handleChangeView.bind(this);
    this.handleUpdateSearch = this.handleUpdateSearch.bind(this);
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
    let default_view = this.state.default_view == 'calendar' ? 'list' : 'calendar';
    this.setState({
      default_view,
      current_view: this.state.search ? 'list' : default_view
    });
  }

  handleUpdateSearch(e) {
    let value = e.target.value;
    this.setState({
      search: value,
      current_view: value ? 'list' : this.state.default_view
    });
  }

  render() {
    return (
      <div>
        <Header
          search={this.state.search}
          view={this.state.default_view}
          handleUpdateSearch={this.handleUpdateSearch}
          handleChangeView={this.handleChangeView} />
        <main className={this.state.current_view}>
          <aside className="side-1">
            {this.state.current_view == 'calendar' ?
            <Calendar
              calendar_range={this.state.calendar_range}
              checkins_by_day={this.state.checkins_by_day} /> :
            <List
              search={this.state.search}
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

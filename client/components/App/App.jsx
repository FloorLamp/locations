import Header from './Header';

import Calendar from '../Calendar/Calendar';
import List from '../List/List';
import MainMap from '../Map/Map';
import Venue from '../Venue/Venue';

let RouteHandler = Router.RouteHandler;

class App extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      view: 'list',
      search: '',

      calendar_range: moment.range(moment().subtract('30', 'days').startOf('week'), moment().endOf('week')),
      all_checkins: [],
      selected_day: null,
      map_venues: [],
      checkins_by_day: {},
      venues: {}
    }
    this.handleUpdateSearch = this.handleUpdateSearch.bind(this);
  }

  componentDidMount() {
    request({
      url: `${API_SERVER}/api/checkins`,
      json: true
    }, (err, res, data) => {
      let checkins_by_day = _.groupBy(data, (checkin) => moment.unix(checkin.created_at).startOf('day').unix());
      let selected_day = moment.unix(data.slice(-1)[0].created_at).startOf('day').unix();
      let venues = {};
      _.each(data, (checkin) => {
        venues[checkin.venue._id] = checkin.venue;
      })

      this.setState({
        all_checkins: data,
        calendar_range: moment.range(moment.unix(data[0].created_at).startOf('month').startOf('week'),
                                     moment().endOf('month').endOf('week')),
        checkins_by_day,
        venues,
      }, () => {
        if (!this.context.router.getCurrentPathname() || this.context.router.getCurrentPathname() == '/') {
          let selected_day = moment.unix(this.state.all_checkins.slice(-1)[0].created_at).startOf('day').unix();
          this.context.router.transitionTo('list', {day: selected_day})
        } else {
          this.componentWillReceiveProps(this.props)
        }
      });
    })
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    let view;
    if (this.context.router.isActive('list')) {
      view = 'list';
    } else if (this.context.router.isActive('all')) {
      view = 'all';

      this.setState({
        map_venues: _.pluck(this.state.all_checkins, 'venue'),
      });
    } else if (this.context.router.isActive('search')) {
      view = 'search';
    } else if (this.context.router.isActive('calendar')) {
      view = 'calendar';
    } else if (this.context.router.isActive('venue')) {
      view = 'venue';

      if (this.context.router.getCurrentParams().venue != this.state.venue) {
        this.setState({
          venue: this.context.router.getCurrentParams().venue,
          map_venues: [this.state.venues[this.context.router.getCurrentParams().venue]],
          search: ''
        });
      }
    }
    this.setState({
      view
    });

    if ((view == 'list' || view == 'calendar')) {
      if (!this.context.router.getCurrentParams().day) {
        let last_day = moment.unix(this.state.all_checkins.slice(-1)[0].created_at).startOf('day').unix();
        this.context.router.transitionTo(view, {day: last_day})
      }

      if (this.context.router.getCurrentParams().day != this.state.selected_day) {
        if (this.state.search) {
          this.setState({
            search: '',
          });
        }
        this.setState({
          selected_day: this.context.router.getCurrentParams().day,
          venue: null,
          map_venues: _.pluck(this.state.checkins_by_day[this.context.router.getCurrentParams().day], 'venue'),
        });
      }
    }
  }

  handleUpdateSearch(e) {
    let value = e.currentTarget.value;
    if (value && !this.context.router.isActive('search')) {
      this.context.router.transitionTo('search');
    }
    this.setState({
      search: value,
    });
  }

  render() {
    return (
      <div className="wrapper">
        <Header
          search={this.state.search}
          view={this.state.view}
          handleUpdateSearch={this.handleUpdateSearch} />
        <main className={this.state.view}>
          <aside className="side-1">
            <RouteHandler
              all_checkins={this.state.all_checkins}
              search={this.state.search}
              venue={this.state.venue}
              venues={this.state.venues}
              calendar_range={this.state.calendar_range}
              checkins_by_day={this.state.checkins_by_day} />
          </aside>
          <aside className="side-2">
            <MainMap
              view={this.state.view}
              map_venues={this.state.map_venues} />
          </aside>
        </main>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default App;

import './list.scss';

class List extends React.Component {
  static willTransitionTo(transition, params, query) {
    console.log('willTransitionTo List');
  }

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
    let list = [];
    let today = moment().startOf('day');
    let search_re = new RegExp(this.props.search, 'i');

    this.props.calendar_range.by('days', (day) => {
      let timestamp = day.unix();
      if (!this.props.checkins_by_day[timestamp]) return;

      let day_checkins = this.props.checkins_by_day[timestamp];
      if (this.props.search) {
        day_checkins = _.filter(day_checkins, (checkin) => {
          return checkin.venue.name.match(search_re) || checkin.venue.categories[0].name.match(search_re);
        });
        if (!day_checkins.length) return;
      }

      let checkins = _.map(day_checkins, (checkin) => {
        return (
          <li key={checkin._id}>
            <img className="icon" src={checkin.venue.categories[0].icon} />
            <div className="venue" onClick={this.context.router.transitionTo.bind(null, '/venue/' + checkin.venue._id)}>
              {checkin.venue.name}
            </div>
            <div className="time">{moment.unix(checkin.created_at).format('HH:mm')}</div>
          </li>
        );
      });

      list.unshift(
        <li key={timestamp} className={classNames({today: day.isSame(today), selected: timestamp == this.props.params.day})}>
          <div className="date" onClick={this.context.router.transitionTo.bind(null, '/list/' + timestamp)}>{day.format('dddd, MMMM D, YYYY')}</div>
          <div className="details">
            <ul>
              {checkins}
            </ul>
          </div>
        </li>
      );
    });

    return (
      <ul id="list">
        {list}
      </ul>
    );
  }
}

List.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default List;

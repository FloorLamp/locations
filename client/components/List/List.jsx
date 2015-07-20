import './list.scss';

export default class List extends React.Component {

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
      if (!this.props.checkins_by_day[day]) return;

      let day_checkins = this.props.checkins_by_day[day];
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
            <div className="venue">
              {checkin.venue.name}
            </div>
            <div className="time">{moment.unix(checkin.created_at).format('HH:mm')}</div>
          </li>
        );
      });

      list.unshift(
        <li key={day.unix()} className={classNames({today: day.isSame(today)})}>
          <div className="date">{day.format('dddd, MMMM D, YYYY')}</div>
          <div className="details">
            <ul>
              {checkins}
            </ul>
          </div>
        </li>
      );
    });

    return (
      <ul className="list">
        {list}
      </ul>
    );
  }
}

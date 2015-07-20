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

    this.props.calendar_range.by('days', (day) => {
      if (!this.props.checkins_by_day[day]) return;

      let checkins = _.map(this.props.checkins_by_day[day], (checkin) => {
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
          <div className="date">{day.format('dddd, MMM D')}</div>
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

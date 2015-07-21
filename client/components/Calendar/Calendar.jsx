import './calendar.scss';

export default class Calendar extends React.Component {

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
    let calendar = [];
    let week = [];
    let today = moment().startOf('day');

    this.props.calendar_range.by('days', (day) => {
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

      let dayClasses = classNames('day', {
        today: day.isSame(today),
        'month-stripe': day.month() % 2,
        selected: day.isSame(this.props.selected_day)
      });

      week.push(
        <div
          key={day.weekday()}
          className={dayClasses}
          onClick={this.props.handleSelectDay.bind(null, day)}>
          <div className="date">{day.date() === 1 && day.format('MMM ')}{day.format('D')}</div>
          <div className="details">
            <ul>
              {checkins}
            </ul>
          </div>
        </div>
      );

      if (day.weekday() === 6) {
        calendar.push(
          <div key={day.unix()} className="week">
            {week}
          </div>
        );
        week = [];
      }
    });

    return (
      <div className="calendar">
        {calendar}
      </div>
    );
  }
}

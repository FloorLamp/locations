import './calendar.scss';

import MonthBar from './MonthBar';

class Calendar extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      month: moment.unix(this.props.params.day).startOf('month'),
      month_scroll_offsets: []
    }

    this.handleScroll = _.throttle(this.handleScroll.bind(this), 250);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.all_checkins.length == this.props.all_checkins.length) return;

    let first_month = moment.unix(this.props.all_checkins[0].created_at).startOf('month');
    let last_month = moment.unix(this.props.all_checkins.slice(-1)[0].created_at).startOf('month');
    let month_scroll_offsets = [];
    moment.range(first_month, last_month).by('months', (month) => {
      month_scroll_offsets.push([month, React.findDOMNode(this.refs[month.unix()]).getBoundingClientRect().top])
    });
    console.log(month_scroll_offsets);
    this.setState({
      month_scroll_offsets
    });
  }

  handleScroll() {
    let height = React.findDOMNode(this.refs.calendar).getBoundingClientRect().height;
    let offset =  -React.findDOMNode(this.refs.calendar).getBoundingClientRect().top;
    let month;
    for (var i = 0; i < this.state.month_scroll_offsets.length; i++) {
      if (offset < this.state.month_scroll_offsets[i][1]) {
        month = this.state.month_scroll_offsets[i][0];
        break;
      }
    };
    if (!month || month.isSame(this.state.month)) return;
    console.log(offset, this.state.month_scroll_offsets[i])

    this.setState({
      month
    });
  }

  render() {
    let calendar = [];
    let week = [];
    let today = moment().startOf('day');

    this.props.calendar_range.by('days', (day) => {
      let timestamp = day.unix();
      let checkins = _.map(this.props.checkins_by_day[timestamp], (checkin) => {
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
        selected: timestamp == this.props.params.day
      });

      week.push(
        <div
          key={day.weekday()}
          ref={timestamp}
          className={dayClasses}
          onClick={this.context.router.transitionTo.bind(null, '/calendar/' + timestamp)}>
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
      <div id="calendar-wrapper">
        <MonthBar month={this.state.month} />
        <div id="calendar" ref="calendar">
          {calendar}
        </div>
      </div>
    );
  }
}

Calendar.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default Calendar;

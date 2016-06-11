import './venue.scss';

import { pluralize } from '../../utils/strings';

class Venue extends React.Component {

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
    let venue = this.props.venues[this.context.router.getCurrentParams().venue];

    if (!venue) return <div />;

    let checkins = _.filter(this.props.all_checkins, (checkin) => checkin.venue._id == venue._id);
    let checkins_list = _.map(checkins, (checkin) => {
      let time = moment.unix(checkin.created_at);
      let day = moment.unix(checkin.created_at).startOf('day');

      return (
        <li key={checkin._id}>
          <div className="date" onClick={this.context.router.transitionTo.bind(null, '/list/' + day.unix())}>
            {time.format('HH:mm ddd, MMM D, YYYY')}
          </div>
        </li>
      );
    });

    let first_date = moment.unix(checkins[0].created_at);
    let last_date = moment.unix(checkins.slice(-1)[0].created_at);
    console.log(first_date.format(), last_date.format());
    let range;
    let format = 'MMMM D, YYYY';

    if (first_date.startOf('day').isSame(last_date.startOf('day'))) {
      range = `starting ${first_date.format(format)}`;
    } else {
      if (first_date.year() == last_date.year())
        format = 'MMMM D';
      range = `from ${first_date.format(format)} to ${last_date.format('MMMM D, YYYY')}`;
    }

    return (
      <div className="venue-details">
        <div className="details">
          <img src={venue.categories[0].icon} />
          <h2>{venue.name}</h2>
        </div>
        <div className="stats">
          {pluralize(checkins.length, 'checkin')} {range}
        </div>
        <ul className="checkins">
          {checkins_list}
        </ul>
      </div>
    );
  }
}

Venue.contextTypes = {
  router: React.PropTypes.func.isRequired
}

export default Venue;

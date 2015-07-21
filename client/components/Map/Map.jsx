import './map.scss';

export default class Map extends React.Component {

  constructor(...args) {
    super(...args);
    this.state = {
      map: null,
      markers: []
    }
  }

  componentDidMount() {
    let lastLocation;
    let mapOptions = {
      center: new google.maps.LatLng(44.5403, -78.5463),
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.setState({
      map: new google.maps.Map(this.refs.map, mapOptions)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current_view !== this.props.current_view) {
      google.maps.event.trigger(this.state.map, 'resize');
    }

    if (!nextProps.mapped_checkins || !nextProps.mapped_checkins.length || _.isEqual(nextProps.mapped_checkins, this.props.mapped_checkins)) return;

    if (this.state.markers.length) {
      _.each(this.state.markers, (marker) => {
        marker.setMap(null);
      });
    }

    let markers = _.map(nextProps.mapped_checkins, (checkin) => {
      return new google.maps.Marker({
        map: this.state.map,
        position: {
          lat: checkin.venue.location.lat,
          lng: checkin.venue.location.lng,
        },
        title: checkin.venue.name,
        icon: checkin.venue.categories[0].icon
      })
    });
    this.setState({
      markers
    });

    let bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(
        _.min(nextProps.mapped_checkins, (checkin) => checkin.venue.location.lat).venue.location.lat,
        _.min(nextProps.mapped_checkins, (checkin) => checkin.venue.location.lng).venue.location.lng
      ),
      new google.maps.LatLng(
        _.max(nextProps.mapped_checkins, (checkin) => checkin.venue.location.lat).venue.location.lat,
        _.max(nextProps.mapped_checkins, (checkin) => checkin.venue.location.lng).venue.location.lng
      )
    );
    this.state.map.fitBounds(bounds);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="map">
        <div ref="map" />
      </div>
    );
  }
}

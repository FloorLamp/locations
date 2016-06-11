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
      map: new google.maps.Map(React.findDOMNode(this.refs.map), mapOptions)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.props.view) {
      google.maps.event.trigger(this.state.map, 'resize');
    }

    if (!nextProps.map_venues || !nextProps.map_venues.length || _.isEqual(nextProps.map_venues, this.props.map_venues)) return;

    if (this.state.markers.length) {
      _.each(this.state.markers, (marker) => {
        marker.setMap(null);
      });
    }

    let venues = _.uniq(nextProps.map_venues, '_id');
    console.log(venues);

    let markers = _.map(venues, (venue) => {
      return new google.maps.Marker({
        map: this.state.map,
        position: {
          lat: venue.location.lat,
          lng: venue.location.lng,
        },
        title: venue.name,
        icon: venue.categories[0].icon
      })
    });
    this.setState({
      markers
    });

    let bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(
        _.min(venues, (venue) => venue.location.lat).location.lat,
        _.min(venues, (venue) => venue.location.lng).location.lng
      ),
      new google.maps.LatLng(
        _.max(venues, (venue) => venue.location.lat).location.lat,
        _.max(venues, (venue) => venue.location.lng).location.lng
      )
    );
    this.state.map.fitBounds(bounds);
    console.log(markers, bounds);

    if (venues.length == 1) {
      this.state.map.setZoom(18);
    }
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div id="map">
        <div ref="map" />
      </div>
    );
  }
}

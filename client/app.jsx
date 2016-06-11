import './index.jade';
import './img/fry.png';

import 'normalize.css/normalize.css';
import './scss/app.scss';

import 'moment-range';

import App from './components/App/App';
import Calendar from './components/Calendar/Calendar';
import List from './components/List/List';
import Venue from './components/Venue/Venue';

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

let routes = (
  <Route handler={App}>
    <Route path="/all" name="all" handler={List} ignoreScrollBehavior={true} />
    <Route path="/search" name="search" handler={List} ignoreScrollBehavior={true} />
    <Route path="/list/:day?" name="list" handler={List} ignoreScrollBehavior={true} />
    <Route path="/calendar/:day?" name="calendar" handler={Calendar} ignoreScrollBehavior={true} />
    <Route path="/venue/:venue" name="venue" handler={Venue} />
  </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root />, document.getElementById('app'));
});

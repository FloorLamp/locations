import './index.jade';
import './img/fry.png';

import 'normalize.css/normalize.css';
import './scss/app.scss';

import 'moment-range';

import App from './components/App/App';

React.render(
  <App />,
  document.getElementById('app')
);

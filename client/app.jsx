import './index.jade';
import './img/fry.png';

import 'normalize.css/normalize.css';
import './scss/app.scss';

import 'moment-range';
import ReactDOM from 'react-dom';

import App from './components/App/App';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

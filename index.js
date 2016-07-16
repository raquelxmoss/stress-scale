import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div} from '@cycle/dom';
import xs from 'xstream';

import data from './data';

function main ({DOM}) {
  return {
    DOM: xs.of(div(JSON.stringify(data)))
  };
}

const drivers = {
  DOM: makeDOMDriver('.app')
};

run(main, drivers);

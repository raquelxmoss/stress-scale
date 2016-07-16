import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, button} from '@cycle/dom';
import xs from 'xstream';

import questions from './data';

function yesReducer (state) {
  const question = state.questions[0];

  return {
    ...state,

    score: state.score + question.score,
    questions: state.questions.slice(1)
  };
}

function noReducer (state) {
  return {
    ...state,

    questions: state.questions.slice(1)
  };
}

function renderFinalScore (score) {
  return (
    div('.score', `Your final score is ${score}`)
  );
}

function view (state) {
  if (state.questions.length === 0) {
    return renderFinalScore(state.score);
  }

  const question = state.questions[0];

  return (
    div('.question', [
      div('.preface', 'In the last year, have you experienced:'),
      div('.question-text', question.event),
      div('.buttons', [
        button('.yes', 'Yes'),
        button('.no', 'No')
      ])
    ])
  );
}

function main ({DOM}) {
  const yes$ = DOM
    .select('.yes')
    .events('click')
    .mapTo(yesReducer);

  const no$ = DOM
    .select('.no')
    .events('click')
    .mapTo(noReducer);

  // TODO:
  // Given an array of stress scale questions
  //  For each question
  //    Render it to the DOM
  //    Give the user the option to select YES or NO
  //  Store the score of the user's answers
  const initialState = {
    questions,
    score: 0
  };

  const reducer$ = xs.merge(
    yes$,
    no$
  );

  const state$ = reducer$.fold((state, reducer) => reducer(state), initialState);

  return {
    DOM: state$.map(view)
  };
}

const drivers = {
  DOM: makeDOMDriver('.app')
};

run(main, drivers);

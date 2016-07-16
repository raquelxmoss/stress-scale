import {run} from '@cycle/xstream-run';
import {makeDOMDriver, div, button, h1, h2} from '@cycle/dom';
import xs from 'xstream';

import questions from './data';

const initialState = {
  questions,
  currentQuestionIndex: 0,
  score: 0
};

function yesReducer (state) {
  const question = currentQuestion(state);

  return {
    ...state,

    score: state.score + question.score,
    currentQuestionIndex: state.currentQuestionIndex + 1
  };
}

function noReducer (state) {
  return {
    ...state,

    currentQuestionIndex: state.currentQuestionIndex + 1
  };
}

function currentQuestion (state) {
  return state.questions[state.currentQuestionIndex];
}

function renderFinalScore (score) {
  return (
    h1('.score', `Your final score is ${score}`)
  );
}

function view (state) {
  if (state.currentQuestionIndex === state.questions.length) {
    return renderFinalScore(state.score);
  }

  const question = currentQuestion(state);
  const progress = state.currentQuestionIndex / state.questions.length;

  const progressStyle = {
    width: `${progress * 100}%`
  };

  return (
    div('.question', [
      h2('.preface', 'In the last year, have you experienced:'),
      h1('.question-text', question.event),
      div('.buttons', [
        button('.yes', 'Yes'),
        button('.no', 'No')
      ]),
      div('.progress-container', [
        div('.progress', {style: progressStyle})
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

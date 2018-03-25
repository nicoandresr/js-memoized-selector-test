# js-memoized-selector-test
A simple utility for test redux memoized selectors, I take the idea and the code from [this post](https://itnext.io/redux-ruins-you-react-app-performance-you-are-doing-something-wrong-82e28ec96cf5) of medium.
## Install
    npm install js-memoized-selector-test
## Synopsis
### Double check yourself
"Always make sure your memoization works and you not producing any regressions. You can use following snippet to wrap you selectors in unit tests and double check it returns the same result for the same set of arguments"
## Usage
```js
var memoizedSelector = require('./dist/index.js').default;
var createSelector = require('reselect').createSelector;
var test = require('tape');

var state = {
  todos: [
    { name: 'task 1', completed: true },
    { name: 'task 2', completed: false }
  ],
  project: 'home'
};

function badSelectorFilter(state) {
  return state.todos.filter(t => t.completed);
};

function badSelectorProp(state) {
  return { project: state.project };
}

test('Bad selectors', function(t) {
  t.plan(2);
  t.throws(function() {
    memoizedSelector(badSelectorFilter)(state);
  }, /Memoization check failed/, 'Memoization check failed');
  t.throws(function() {
    memoizedSelector(badSelectorProp)(state);
  }, /Memoization check failed/, 'Memoization check failed');
});

var getTodos = function(state) {
  return state.todos;
};

var goodSelectorFilter = createSelector(
  [getTodos],
  function(todos) {
    return todos.filter(t => t.completed);
  }
);

var goodSelectorProp = function(state) {
  return state.project;
};

test('Good selector', function(t) {
  t.plan(2);
  t.doesNotThrow(function() {
    memoizedSelector(goodSelectorFilter)(state)
  }, 'Memoization check success');
  t.doesNotThrow(function() {
    memoizedSelector(goodSelectorProp)(state)
  }, 'Memoization check success');
});


```
# Licence
MIT

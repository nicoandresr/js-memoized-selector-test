# js-memoized-selector-test
A simple utility for test redux memoized selectors, I take the idea and the code from [this post](https://itnext.io/redux-ruins-you-react-app-performance-you-are-doing-something-wrong-82e28ec96cf5) of medium.
## Install
    npm install js-memoized-selector-test --save-dev
## Synopsis
### Double check yourself
"Always make sure your memoization works and you not producing any regressions. You can use following snippet to wrap you selectors in unit tests and double check it returns the same result for the same set of arguments"
## Usage

First import js-memoized-selector-test
```js
// import memoizedSelector from 'js-memoized-selector-test';
var memoizedSelector = require('./dist/index.js').default;
// omit this part is for run this test
var test = require('tape');
```
Then if you have the follow state:
```js
var state = {
  todos: [
    { name: 'task 1', completed: true },
    { name: 'task 2', completed: false }
  ],
  project: 'home'
};
```
Then maybe you can have the follow selectors:
```js
function badGetCompletedTodos(state) {
  return state.todos.filter(t => t.completed);
};

function badGetProject(state) {
  return { project: state.project };
}
```
this selectors are bad defined because always returns a diferent instance of the results.

Whit memoizedSelector we apply a double check in our unit test for avoid this:
```js
test('Bad selectors', function(t) {
  t.plan(2);
  t.throws(function() {
    var target = memoizedSelector(badCompletedTodosSelector);
    target(state);
  }, 'Memoization check failed');
  t.throws(function() {
    var target = memoizedSelector(badGetProject);
    target(state);
  }, 'Memoization check failed');
});
```
Here we have a good implementation of selectors, we can use [reselect](https://github.com/reactjs/reselect) for this porpuse.
```js
var createSelector = require('reselect').createSelector;
```
First we can rewrite our selectors:
```js
var getTodos = function(state) {
  return state.todos;
};

var getCompletedTodos = createSelector(
  [getTodos],
  function(todos) {
    return todos.filter(t => t.completed);
  }
);

function getProject(state) {
  return state.project;
};
```
Then we can apply the double check in our unit test
```js
test('Completed todos selector', function(t) {
  t.plan(1);
  var completedTodosSelector = memoizedSelector(getCompletedTodos);
  var completedTodos = completedTodosSelector(state);
  t.deepEqual(completedTodos, [state.todos[0]]);
});
```
```js
test('Project selector', function(t) {
  t.plan(1);
  var projectSelector = memoizedSelector(getProject);
  var project = projectSelector(state);
  t.equal(project, state.project);
});
```
Memoized selector is only for apply a double check for our selectors in our unit test, then you can install like a dev dependency.
# Licence
MIT

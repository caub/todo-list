// Next step is to modularize and separate concerns (split in components TodoItem, TodoMenu,.., isolate actions), and require modules
const TodoApp = require('./TodoApp.js')
const {v, equals} = require('./utils.js');


// initial Todos list for testing
const todos = [{
	id:1, name: 'Reply to John',
	time: new Date(Date.now()-36*3.6e6)
}, {
	id:2, name: 'Clean home',
	time: new Date(Date.now()-96*3.6e6)
}, {
	id:3, name: 'Fix issue buffer leak #77',
	time: new Date(Date.now()-4*3.6e6)
}];

ReactDOM.render(v(TodoApp, {todos}), todoapp)





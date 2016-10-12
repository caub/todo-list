const [React, TodoApp] = require('react', './TodoApp');


// initial Todos list for testing
const todos = localStorage.todos ? 
	JSON.parse(localStorage.todos).map(t=>Object.assign(t,{time:new Date(t.time)})) : 
	[{
		id:1, text: 'Reply to John',
		time: new Date(Date.now()-36*3.6e6)
	}, {
		id:3, text: 'Fix issue wit backticks [#77](https://github.com/caub/todo-list/issues/1)',
		time: new Date(Date.now()-4*3.6e6)
	}, {
		id:2, text: 'Eat a 🍊', checked: true,
		time: new Date(Date.now()-96*3.6e6)
	}];

ReactDOM.render(React.createElement(TodoApp, {todos}), todoapp)





const [React, TodoApp] = require('react', './TodoApp');


// initial Todos list for testing
const todos = localStorage.todos ? 
	JSON.parse(localStorage.todos).map(t=>Object.assign(t,{date:new Date(t.date)})) : 
	[{
		id:1, text: 'Reply to **John**',
		date: new Date(Date.now()-36*3.6e6)
	}, {
		id:5, text: "Fix leak/hole in the ceiling",
		date: new Date(Date.now()-6*86400e3)
	}, {
		id:4, text: "💻 `delete localStorage.todos` if it's buggy", 
		date: new Date('2016-10-13 12:00')
	}, {
		id:6, text: '*drop* [#2](https://github.com/caub/todo-list/issues/2)',
		date: new Date('2016-10-13 18:00'), checked: true
	}, {
		id:3, text: 'Issue with backticks [#1](https://github.com/caub/todo-list/issues/1)',
		date: new Date('2016-10-12 10:00'), checked: true
	}, {
		id:2, text: 'Eat a 🍊', checked: true,
		date: new Date(Date.now()-96*3.6e6)
	}];

ReactDOM.render(React.createElement(TodoApp, {todos}), todoapp)





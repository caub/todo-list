const [React, TodoApp] = require('react', './TodoApp');


// initial Todos list for testing
const todos = localStorage.todos ? 
	JSON.parse(localStorage.todos).map(t=>Object.assign(t,{date:new Date(t.date)})) : 
	[{
		id:1, text: 'Reply to <strong>John</strong>',
		date: new Date(Date.now()-36*3.6e6)
	}, {
		id:5, text: "Fix hole ![in the ceiling](https://s-media-cache-ak0.pinimg.com/564x/21/e3/00/21e300494123462dd0b2b0c4ece3b561.jpg)",
		date: new Date(Date.now()-6*86400e3)
	}, {
		id:4, text: "💻 delete localStorage.todos if it's buggy", 
		date: new Date('2016-10-13 12:00')
	}, {
		id:2, text: 'Eat a 🍊', checked: true,
		date: new Date(Date.now()-96*3.6e6)
	}];

ReactDOM.render(React.createElement(TodoApp, {todos}), todoapp)





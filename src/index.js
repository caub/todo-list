import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore }  from 'redux';
import TodoApp from './TodoApp';

// const store = createStore(todoApp);

const parseTodos = s => {
	try {
		const todos = JSON.parse(s);
		return Array.isArray(todos) ? todos : undefined;
	} catch(e) {
	}
}

const todos = (parseTodos(localStorage.todos) || [{
		id:1, text: 'Reply to <strong>John</strong>',
		date: new Date(Date.now()-36*3.6e6)
	}, {
		id:5, text: "Fix hole ![in the ceiling](https://s-media-cache-ak0.pinimg.com/564x/21/e3/00/21e300494123462dd0b2b0c4ece3b561.jpg)",
		date: new Date(Date.now()-6*86400e3)
	}, {
		id:3, text: "💻 stored locally in localStorage.todos", 
		date: new Date('2016-10-13 12:00')
	}, {
		id:2, text: 'Eat a 🍊', checked: true,
		date: new Date(Date.now()-96*3.6e6)
	}]).map(t=>Object.assign(t, {date:new Date(t.date)}));


const app = ReactDOM.render(React.createElement(TodoApp, {todos}), todoapp);

export default app;
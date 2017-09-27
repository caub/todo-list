import { createElement as v } from 'react';
import TodoMenu from './TodoMenu';
import TodoList from './TodoList';

const TodoApp = () => (
	v('div', null,
		v(TodoMenu),
		v(TodoList)
	)
);

export default TodoApp;

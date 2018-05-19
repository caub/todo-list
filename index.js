// Simple Todo implementation in React, next step will be to use React to organize and simplify it

const v = window.React.createElement;

const todos = [{
	name: 'Reply to John',
	time: new Date(Date.now() - 36 * 3.6e6)
}, {
	name: 'Clean home',
	time: new Date(Date.now() - 96 * 3.6e6)
}, {
	name: 'Fix issue buffer leak #77',
	time: new Date(Date.now() - 4 * 3.6e6)
}]

class TodoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			todos: props.todos.map((o, i) => ({ ...o, id: i, order: i }))
		};
	}
	addTodo() {
		const { todos } = this.state;
		const todo = {
			id: todos.length + 1,
			name: 'New todo #' + todos.length + 1,
			time: new Date(),
			order: todos.length
		};
		this.setState({
			todos: [...todos, todo]
		});
	}
	sortByName() {
		const { todos } = this.state;
		const newTodos = todos.slice();
		this.setState({
			todos: newTodos.sort((a, b) => a.name.localeCompare(b.name)).map((o, i) => ({ ...o, order: i }))
		});
	}
	sortByDate() {
		const { todos } = this.state;
		const newTodos = todos.slice();
		this.setState({
			todos: newTodos.sort((a, b) => a.time - b.time).map((o, i) => ({ ...o, order: i }))
		});
	}
	trashCompletedTodos() {
		const { todos } = this.state;
		this.setState({
			todos: todos.filter(todo => !todo.checked)
		});
	}
	updateTodo(i, patch) {
		const { todos } = this.state;
		this.setState({
			todos: [...todos.slice(0, i), { ...todos[i], ...patch }, ...todos.slice(i + 1)]
		});
	}
	dragEnd(e) {
		this.setState({ dragged: undefined });
	}
	dragStart(e, i) {
		e.dataTransfer.setData('text/custom', 'sort');
		this.setState({ dragged: i });
		const { left, top } = e.currentTarget.getBoundingClientRect();
		e.dataTransfer.setDragImage(e.currentTarget, e.clientX - left, e.clientY - top);
	}
	dragOver(e, i) {
		e.preventDefault();
		const { dragged, todos } = this.state;
		if (dragged === undefined || dragged === i) return;
		// a bit ugly
		[todos[dragged].order, todos[i].order] = [i, dragged]
		this.setState({ todos: todos.slice() });
	}
	render() {
		const { todos } = this.state;

		return v('main', null,
			v('form', { onSubmit: e => e.preventDefault() },
				v('button', { title: 'Add a todo', onClick: () => this.addTodo() },
					v('i', { className: 'fa fa-plus' })
				),
				v('button', { title: 'Sort by name', onClick: () => this.sortByName() },
					v('i', { className: 'fa fa-sort-alpha-asc' })
				),
				v('button', { title: 'Sort by date', onClick: () => this.sortByDate() },
					v('i', { className: 'fa fa-sort-amount-asc' })
				),
				v('button', { title: 'Clear completed', onClick: () => this.trashCompletedTodos() },
					v('i', { className: 'fa fa-trash-o' })
				)
			),
			v('ol', { onDragEnd: e => this.dragEnd(e) },
				todos.map(({ id, name, checked, time, order }, i) => v('li', {
					key: id,
					draggable: true,
					style: { order: order + 1 },
					onDragStart: e => this.dragStart(e, i),
					onDragOver: e => this.dragOver(e, i)
				},
					v('input', { type: 'checkbox', checked }),
					v('span', { draggable: true, className: 'handle', onClick: () => this.updateTodo(i, { checked: !checked }) }, '☰'),
					v('div', { contentEditable: true, className: 'todo' }, name),
					v('time', null, time.toLocaleString())
				))
			),
			'-----'
		);
	}
}

ReactDOM.render(v(TodoApp, { todos }), document.getElementById('root'))

import { createElement as v } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import { addTodo, deleteTodo, trash, sortByText, sortByTime } from './reducers';

const styles = {
	flash: {
		opacity: .5,
		padding: '0 1em',
		fontSize: 12,
		fontFamily: 'monospace',
	},

	buttons: {
		display: 'flex',
		marginBottom: 8,
		alignItems: 'center',
		'& button[disabled]': {
			opacity: .1
		}
	}
};


const Menu = ({ alpha = 'asc', time = 'asc', onDrop, trash, addTodo, sortByText, sortByTime }) => (

	v('div', { className: 'buttons' },
		v('button',
			{
				title: 'Add a todo',
				onClick: addTodo
			},
			v('i', { className: 'fa fa-plus' })
		),
		v('button',
			{
				title: 'Sort by text',
				onClick: sortByText
			},
			v('i', { className: 'fa fa-sort-alpha-' + alpha })
		),
		v('button',
			{
				title: 'Sort by date',
				onClick: sortByTime
			},
			v('i', { className: 'fa fa-sort-amount-' + time })
		),
		v('button',
			{
				title: 'Drop completed',
				onClick: trash,
				onDrop, onDragOver: e => e.preventDefault()
			},
			v('i', { className: 'fa fa-trash-o' })
		),
		v('flash', null, 'ctrl+(shift+)z to undo/redo')
	)
);

const TodoMenu = connect(
	({ alpha, time }) => ({ alpha, time }),
	{
		addTodo,
		onDrop: e => {
			e.preventDefault();
			const text = e.dataTransfer.getData('text');
			try {
				const data = JSON.parse(text);
				console.log('delete', data)
				return deleteTodo(data.id);
				// dispatch({ type: 'delete', id: data.id });
			} catch (e) {
				console.error(e);
				return {};
			}
		},
		trash,
		sortByText,
		sortByTime
	}
)(Menu);

export default injectSheet(styles)(TodoMenu);

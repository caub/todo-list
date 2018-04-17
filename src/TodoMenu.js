import { createElement as v } from 'react';
import { connect } from 'react-redux';
import { addTodo, deleteTodo, trash, sortByText, sortByTime } from './reducers';

// const mapDispatchToProps = (dispatch, ownProps) => ({
// 	onDrop: e => {
// 		e.preventDefault();
// 		const text = e.dataTransfer.getData('text');
// 		try {
// 			const data = JSON.parse(text);
// 			dispatch({ type: 'delete', id: data.id });
// 		} catch (e) {
// 			console.error(e)
// 		}
// 	},
// 	onTrash: e => {
// 		dispatch({ type: 'trash' });
// 	},
// 	onAdd: e => {
// 		dispatch({ type: 'add' });
// 	},
// 	onSortByTime: e => {
// 		dispatch({ type: 'sortByTime' });
// 	},
// 	onSortByText: e => {
// 		dispatch({ type: 'sortByText' });
// 	}
// });


const Menu = ({ alpha = 'asc', time = 'asc', onDrop, trash, addTodo, sortByText, sortByTime }) => (

	v('div', { className: 'buttons' },
		v('button', { title: 'Add a todo', onClick: addTodo }, v('i', { className: 'fa fa-plus' })),
		v('button', { title: 'Sort by text', onClick: sortByText }, v('i', { className: 'fa fa-sort-alpha-' + alpha })),
		v('button', { title: 'Sort by date', onClick: sortByTime }, v('i', { className: 'fa fa-sort-amount-' + time })),
		v('button', { title: 'Drop completed', onClick: trash, onDrop, onDragOver: e => e.preventDefault() }, v('i', { className: 'fa fa-trash-o' })),
		v('flash', null, 'ctrl+(shift+)z to undo/redo')
	)
);

const TodoMenu = connect(
	null,
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

export default TodoMenu;

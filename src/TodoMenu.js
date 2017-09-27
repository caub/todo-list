import { createElement as v } from 'react';
import { connect } from 'react-redux';


const mapDispatchToProps = (dispatch, ownProps) => ({
	onDrop: e => {
		e.preventDefault();
		const text = e.dataTransfer.getData('text');
		try {
			const data = JSON.parse(text);
			dispatch({type: 'delete', id: data.id});
		} catch(e){
			console.error(e)
		}
	}, 
	onTrash: e => {
		dispatch({type: 'trash'});
	}, 
	onAdd: e => {
		dispatch({type: 'add'});
	},
	onSortByTime: e => {
		dispatch({type: 'sortByTime'});
	},
	onSortByText: e => {
		dispatch({type: 'sortByText'});
	}
});


const Menu = ({alpha='asc', time='asc', onDrop, onTrash, onAdd, onSortByTime, onSortByText}) => (

	v('div', {className:'buttons'},
		v('button', {title: 'Add a todo', onClick: onAdd}, v('i', {className:'fa fa-plus'})),
		v('button', {title: 'Sort by text', onClick: onSortByText}, v('i', {className:'fa fa-sort-alpha-' + alpha})),
		v('button', {title: 'Sort by date', onClick: onSortByTime}, v('i', {className:'fa fa-sort-amount-' + time})),
		v('button', {title: 'Drop completed', onClick: onTrash, onDrop, onDragOver: e=>e.preventDefault()}, v('i', {className:'fa fa-trash-o'})),
		v('flash', null, 'ctrl+(shift+)z to undo/redo')
	)
);

const TodoMenu = connect(
	null,
	mapDispatchToProps
)(Menu);

export default TodoMenu;
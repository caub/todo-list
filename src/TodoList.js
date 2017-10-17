import { createElement as v, PureComponent } from 'react';
import { connect } from 'react-redux';
import TodoItem from './TodoItem';
import TodoTime from './TodoTime';
import {updateHeights} from './utils';


function restorePointerEvents(li){
	li.style.pointerEvents = '';
}

const mapStateToProps = (state, ownProps) => {
	// console.log('todolist__', 'states', state, "props",  ownProps)
	return {
		todos: state.value
		// todo map also state ones, but how to do then, to update a local state? from the container wrappper?
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	undo: () => dispatch({type: 'undo'}),
	redo: () => dispatch({type: 'redo'}),
	updateTodo: (i, todo) => {
		dispatch({type: 'updateTodo', i, todo});
	},
	onDrop: todos => {
		dispatch({type: 'update', todos});
	}
});

class List extends PureComponent {

	constructor(props){
		super(props);
		this.state = {todos: undefined, dragI: -1}; // local state, serves during dragging

		this.dragEnd = e => {
			this.setState({todos:undefined, dragI:-1});
		};

		this.updateHeights = () => updateHeights(this.refs.list);

		this.onDrop = e => {
			if (this.state.dragI < 0) return;
			e.preventDefault();
			this.props.onDrop(this.state.todos);
		};
	}


	dragOver(e, i){
		const {dragI, todos} = this.state;
		if (dragI<0 || dragI===i) return;
		e.preventDefault();

		const {top, bottom} = e.currentTarget.getBoundingClientRect(),
			// pivot = (bottom+top)/2; // easy way
			dragHeight = this.refs.list.children[dragI].offsetHeight,
			pivot = dragHeight>=e.currentTarget.offsetHeight ? 
							(dragI<i ? top : bottom):
							(dragI<i ? (bottom-dragHeight+top)/2 : (top+dragHeight+bottom)/2);
		// console.log(dragHeight>=height, dragHeight, height, dragI, i, pivot)
		
		if (i===dragI+1 && e.clientY < pivot || i===dragI-1 && e.clientY > pivot) return;

		const todos2 = todos.slice(0, dragI).concat(todos.slice(dragI+1)); // removing dragI
		const i2 = i - (dragI<i) + (e.clientY > pivot); // if dragI was before, we need to remove 1, if we drag after the center we add 1
		const todos3 = todos2.slice(0,i2).concat(todos[dragI]).concat(todos2.slice(i2));
		this.setState({todos:todos3, dragI:i2});
		
		e.currentTarget.style.pointerEvents='none';
		setTimeout(restorePointerEvents, 250, e.currentTarget); // transitionend not reliable
	}
	dragStart(e, i){
		const {todos} = this.props;
		this.setState({dragI:i, todos});
		e.dataTransfer.setData('text', JSON.stringify(todos[i]));
		const {left, top} = e.currentTarget.parentNode.getBoundingClientRect();
		e.dataTransfer.setDragImage(e.currentTarget.parentNode, e.clientX - left, e.clientY - top);
	}


	componentDidMount(){
		this.updateHeights();
		window.addEventListener('resize', this.updateHeights);
		this.refs.list.addEventListener('keyup', this.updateHeights, true);

		window.addEventListener('keydown', e=>{
			if (document.activeElement.isContentEditable) return;
			if (e.ctrlKey && e.shiftKey && e.keyCode===90 || e.ctrlKey && e.keyCode===89)
				this.props.redo();
			else if (e.ctrlKey && e.keyCode===90)
				this.props.undo();
		});
	}

	componentDidUpdate(p,s){
		this.updateHeights();
	}

	render() {
		const {todos = this.props.todos, dragI} = this.state; // todos is searched in local state, when it's undefined, we take it in props
		// console.log('render todo list', this.state.todos==undefined, ...todos.map((t,i)=>[i, t.text]));

		return v('ol', {
				ref:'list',
				onDragOver: e => dragI >= 0 && e.preventDefault(),
				onDrop: this.onDrop,
				onDragEnd: this.dragEnd
			},
			todos.map((todo, i)=>
				v('li', {key:todo.id,
						onDragOver: e => this.dragOver(e, i),
						style: {opacity:dragI === i ? .5 : 1}
					},
					v(TodoTime, {
						onDragStart: e => this.dragStart(e, i), 
						checked: Boolean(todo.checked),
						date: todo.date,
						onChange:e => this.props.updateTodo(i, {checked: e.target.checked})
					}),
					v(TodoItem, {
						text: todo.text,
						checked: Boolean(todo.checked),
						update: text => this.props.updateTodo(i, {text})
					})
				)
			)
		);
	}
}

const TodoList = connect(
	mapStateToProps,
	mapDispatchToProps
)(List);

export default TodoList;

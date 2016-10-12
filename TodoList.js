const [React, TodoItem, {updateHeights, timeago}]  = require('react', './TodoItem', './utils');
const v = React.createElement;
const {abs} = Math;

function restorePointerEvents(e){
	e.currentTarget.removeEventListener('transitionend', restorePointerEvents);
	e.currentTarget.style.pointerEvents = '';
}

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {todos: undefined, dragI: -1}; // local state, serves during dragging
		
		this.updateTodo=(i, todo)=>{ // update i-th todo item with the object todo
			const {todos} = this.props;
			const todo2 = Object.assign({}, todos[i], todo);
			this.props.update(Object.assign(todos.slice(), {[i]: todo2})); // make a copy and set todo at i-th position
		};
		this.dragEnd=(e)=>{
			this.props.update(this.state.todos);
			this.setState({todos:undefined, dragI:-1});
		};
	}


	dragOver(e, i){
		e.preventDefault();
		const {dragI, todos, transitioning} = this.state;
		if (dragI===i) return;
		const {top, bottom} = e.currentTarget.getBoundingClientRect(),
			// pivot = (bottom+top)/2; // easy way
			height = e.currentTarget.offsetHeight,
			dragHeight = this.refs.list.children[dragI].offsetHeight,
			pivot = dragHeight>=height ? 
							(dragI<i ? top : bottom):
							(dragI<i ? (bottom-dragHeight+top)/2 : (top+dragHeight+bottom)/2);
		// console.log(dragHeight>=height, dragHeight, height, dragI, i, pivot)
		
		if (i===dragI+1 && e.clientY < pivot || i===dragI-1 && e.clientY > pivot) return;

		const todos2 = todos.slice(0, dragI).concat(todos.slice(dragI+1)); // removing dragI
		const i2 = i - (dragI<i) + (e.clientY > pivot); // if dragI was before, we need to remove 1, if we drag after the center we add 1
		const todos3 = todos2.slice(0,i2).concat(todos[dragI]).concat(todos2.slice(i2));
		this.setState({todos:todos3, dragI:i2});
		e.currentTarget.addEventListener('transitionend', restorePointerEvents);
		e.currentTarget.style.pointerEvents='none';
	}
	dragStart(e, i){
		this.setState({dragI:i, todos: this.props.todos});
		e.dataTransfer.setData('text/custom', 'sort');
	}
	// drop(e){
	// 	console.log('dropped');
	// },

	componentDidMount(){
		updateHeights(this.refs.list);
		window.addEventListener('resize', e=>this.forceUpdate());
	}
	componentDidUpdate(p,s){
		updateHeights(this.refs.list);
	}

	render() { // todos is in priority searched in local state, when it's undefined, we take it in props
		const {todos=this.props.todos, dragI} = this.state;

		// console.log('render todo list', this.state.todos==undefined, ...todos.map((t,i)=>[i, t.text]));

		return v('ol', {
				ref:'list',
				// onDrop:dragI>=0&&this.drop,
				onDragEnd:dragI>=0&&this.dragEnd,
				onKeyUp:e=>updateHeights(e.currentTarget)
			},
			todos.map((todo,i)=>
				v('li', {key:todo.id, draggable:true,
						onDragStart:e=>this.dragStart(e,i), 
						onDragOver:dragI>=0&&(e=>this.dragOver(e,i)),
						style: {opacity:dragI===i?.5:1}
					},
					v('input', {
						type:'checkbox', 
						onChange:e=>this.updateTodo(i, {checked:e.target.checked}),
						checked:Boolean(todo.checked)
					}),
					v(TodoItem, {
						text: todo.text,
						update: text=>this.updateTodo(i,{text})
					}),
					v('time', null, timeago(todo.time))
				)
			)
		);
	}
};


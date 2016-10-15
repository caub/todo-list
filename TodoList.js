const [React, TodoItem, TodoTime, {updateHeights}]  = require('react', './TodoItem', './TodoTime', './utils');
const v = React.createElement;
const {round} = Math;

function restorePointerEvents(e){
	e.currentTarget.removeEventListener('transitionend', restorePointerEvents);
	e.currentTarget.style.pointerEvents = '';
}
const preventDefault = e=>e.preventDefault();

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {todos: undefined, dragI: -1}; // local state, serves during dragging
		
		this.updateTodo=(i, todo)=>{ // update i-th todo item with the object todo
			const {todos} = this.props;
			const todo2 = Object.assign({}, todos[i], todo);
			this.props.update(Object.assign(todos.slice(), {[i]: todo2})); // make a copy and set todo at i-th position
		};
		this.drop=(e)=>{
			e.preventDefault();
			this.props.update(this.state.todos);
		};
		this.dragEnd=(e)=>{
			this.setState({todos:undefined, dragI:-1});
		};

		this.updateHeights = () => updateHeights(this.refs.list);

		this.updateHeights2 = () => console.log(222)||updateHeights(this.refs.list);
	}


	dragOver(e, i){
		e.preventDefault();
		const {dragI, todos, transitioning} = this.state;
		if (dragI===i) return;
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
		e.currentTarget.addEventListener('transitionend', restorePointerEvents);
		e.currentTarget.style.pointerEvents='none';
	}
	dragStart(e, i){
		const {todos} = this.props;
		this.setState({dragI:i, todos});
		e.dataTransfer.setData('text', JSON.stringify(todos[i]));
	}

	componentDidMount(){
		this.updateHeights();
		window.addEventListener('resize', this.updateHeights);
		this.refs.list.addEventListener('keyup', this.updateHeights, true);
	}
	componentDidUpdate(p,s){
		this.updateHeights();
	}
	

	render() { // todos is in priority searched in local state, when it's undefined, we take it in props
		const {todos=this.props.todos, dragI} = this.state;

		// console.log('render todo list', this.state.todos==undefined, ...todos.map((t,i)=>[i, t.text]));

		return v('ol', {
				ref:'list',
				onDragOver: preventDefault,
				onDrop: this.drop,
				onDragEnd: this.dragEnd
			},
			todos.map((todo,i)=>
				v('li', {key:todo.id, draggable:true,
						onDragStart: e=>this.dragStart(e,i), 
						onDragOver: e=>this.dragOver(e,i),
						style: {opacity:dragI===i?.5:1}
					},
					v(TodoTime, {
						checked: Boolean(todo.checked),
						time: (Date.now()-todo.date.getTime())/60000,
						onChange:e=>this.updateTodo(i, {checked:e.target.checked})
					}),
					v(TodoItem, {
						text: todo.text,
						update: text=>this.updateTodo(i,{text})
					})
				)
			)
		);
	}
};


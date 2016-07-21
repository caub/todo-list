const {v, equals, updateHeights, splice} = require('./utils.js');

module.exports = React.createClass({
	shouldComponentUpdate(p, s){
		return !equals(s, this.state) || !equals(p, this.props); // pure comp (always false)
	},

	getInitialState(){
		return {todos: undefined, dragI: -1}; // local state, serves during dragging
	},

	// Next step is to isolate those actions/logic below in a module
	updateTodo(i, todo){
		const {todos} = this.props;
		if (todo.name && todo.name==todos[i].name) return; // nothing changed
		const todo2 = Object.assign({}, todos[i], todo);
		this.props.app.update(Object.assign(todos.slice(), {[i]: todo2})); // make a copy and set todo at i-th position
	},

	dragOver(e, i){
		e.preventDefault();
		const {dragI, todos} = this.state;
		if (dragI===i) return;
		const {top, bottom} = e.currentTarget.rect(),
			center = (top+bottom)/2;
		
		if (i===dragI+1 && e.clientY < center || i===dragI-1 && e.clientY > center) return;

		const todos2 = todos.slice(0,dragI).concat(todos.slice(dragI+1)); // removing dragI
		const i2 = i - (dragI<i) + (e.clientY > center); // if dragI was before, we need to remove 1, if we drag after the center we add 1
		const todos3 = todos2.slice(0,i2).concat(todos[dragI]).concat(todos2.slice(i2));
		this.setState({todos:todos3, dragI:i2})
	},
	dragStart(e, i){
		this.setState({dragI:i, todos: this.props.todos});

		e.dataTransfer.setData('text/custom', 'sort');
	},
	// drop(e){
	// 	console.log('dropped');
	// },
	dragEnd(e){
		this.props.app.update(this.state.todos);
		this.setState({todos:undefined, dragI:-1});
	},

	componentDidMount(){
		updateHeights(this.refs.list);
	},
	componentDidUpdate(){
		updateHeights(this.refs.list);
	},

	render() { // todos is in priority searched in local state, when it's undefined, we take it in props
		const {todos=this.props.todos, dragI} = this.state;

		// console.log('render todo list', this.state.todos, todos);

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
						style: {opacity:dragI===i?.6:1}
					},
					v('label',
						v('span', '☰'),
						v('input', {
							type:'checkbox', 
							onChange:e=>this.updateTodo(i, {checked:e.target.checked}),
							checked:Boolean(todo.checked)
						}),
						v('span', {
							contentEditable:true,
							dangerouslySetInnerHTML:{__html:todo.name},
							onClick:e=>e.preventDefault(),
							onBlur:e=>this.updateTodo(i, {name:e.target.innerHTML})
						}),
						v('time', todo.time.toLocaleString())
					)
				)
			)
		);
	}
});
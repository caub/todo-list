const React = require('react');
const {updateHeights, timeago} = require('./utils.js');
const v = React.createElement;
const sel = getSelection();

function setRange(r) {
	sel.removeAllRanges();
	sel.addRange(r);
}
const getRange = ()=>sel.rangeCount?sel.getRangeAt(0):new Range();

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {todos: undefined, dragI: -1, anim:true}; // local state, serves during dragging
		this.updateTodo=(i, todo)=>{ // update i-th todo item with the object todo
			const {todos} = this.props;
			if (todo.name && todo.name==todos[i].name) return; // nothing changed
			const todo2 = Object.assign({}, todos[i], todo);
			this.setState({anim: false});
			this.props.update(Object.assign(todos.slice(), {[i]: todo2}), ()=>this.setState({anim: true})); // make a copy and set todo at i-th position
		};

		this.dragEnd=(e)=>{
			this.props.update(this.state.todos);
			this.setState({todos:undefined, dragI:-1});
		};
	}


	dragOver(e, i){
		e.preventDefault();
		const {dragI, todos} = this.state;
		if (dragI===i) return;
		const {top, bottom} = e.currentTarget.getBoundingClientRect(),
			center = (top+bottom)/2;
		
		if (i===dragI+1 && e.clientY < center || i===dragI-1 && e.clientY > center) return;

		const todos2 = todos.slice(0,dragI).concat(todos.slice(dragI+1)); // removing dragI
		const i2 = i - (dragI<i) + (e.clientY > center); // if dragI was before, we need to remove 1, if we drag after the center we add 1
		const todos3 = todos2.slice(0,i2).concat(todos[dragI]).concat(todos2.slice(i2));
		this.setState({todos:todos3, dragI:i2})
	}
	dragStart(e, i){
		this.setState({dragI:i, todos: this.props.todos, anim:true});
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
		const {todos=this.props.todos, dragI, anim} = this.state;

		// console.log('render todo list', anim, this.state.todos, todos);

		return v('ol', {
				ref:'list',
				// onDrop:dragI>=0&&this.drop,
				className:anim?'anim':'',
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
					v('span', {
						dangerouslySetInnerHTML:{__html:todo.name},
						onMouseDown:e=>{
							e.target.contentEditable=true;
							
							if (!e.target.contains(getRange().commonAncestorContainer)){
								const r = document.caretRangeFromPoint(e.clientX, e.clientY);
								setRange(r);
							}
							
						},
						onBlur:e=>{
							e.target.contentEditable=false;
							this.updateTodo(i, {name:e.target.innerHTML, edit:false})
						}
					}),
					v('time', null, timeago(todo.time))
				)
			)
		);
	}
};


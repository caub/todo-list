// Next step is to modularize and separate concerns (split in components TodoItem, TodoMenu,.., isolate actions), and require modules
const {v, equals, updateHeights, updateTodos} = require('./utils.js');

const Todos = React.createClass({

	shouldComponentUpdate(p, s){
		return !equals(s, this.state);
	},

	getInitialState(){

		this.history = [this.props.todos];
		this.historyI = 0; // 0 is most recent .. length-1 oldest entry

		return {
			todos: this.props.todos,
			dragI: -1 // index of dragged item
		};
	},

	updateState(state){// setState and update history
		this.setState(state);
		const {todos=this.state.todos}=state, h = this.history[this.historyI];
		if (h.length!==todos.length || h.some((hi,i)=>hi!==todos[i])){
			this.history = [todos].concat(this.history.slice(this.historyI));
			this.historyI = 0;
		}
		
	},

	undo(e){
		if (this.historyI<this.history.length-1){
			this.setState({todos: this.history[++this.historyI]});
		}
	},
	redo(e){
		if (this.historyI>0){
			this.setState({todos: this.history[--this.historyI]});
		}
	},
	add(){
		const {todos}=this.state;
		this.updateState({todos:[{id:todos.length+1, name:'New todo #'+(todos.length+1), time: new Date()}].concat(todos)})
	},
	trash(){
		this.updateState({todos:this.state.todos.filter(t=>!t.checked)})
	},
	sortByName(){
		this.updateState({todos:this.state.todos.slice().sort((a,b)=>(a.name>b.name)-.5)})
	},
	sortByTime(){
		this.updateState({todos:this.state.todos.slice().sort((a,b)=>(a.time<b.time)-.5)})
	},
	blur(e, i){
		const {todos} = this.state;
		if (todos[i].name==e.target.textContent) return; // nothing changed
		this.updateState({todos: updateTodos(todos,i,{name:e.target.innerHTML})});
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
		this.setState({dragI:i});
		e.dataTransfer.setData('text/custom', 'sort');
	},
	dragEnd(e){
		this.updateState({dragI:-1});
	},

	componentDidMount(){
		updateHeights(this.refs.list);
	},
	componentDidUpdate(){
		updateHeights(this.refs.list);
	},

	render(){
		const {todos, dragI} = this.state;
		
		return v('div',
			v('div', {className:'buttons'},
				v('div',
					v('button', {disabled:this.historyI===this.history.length-1, onClick:this.undo}, v('i', {className:'fa fa-mail-reply'})),
					v('button', {disabled:this.historyI===0, onClick:this.redo}, v('i', {className:'fa fa-mail-forward'}))
				),
				v('div',
					v('button', {title: 'Add a todo', onClick: this.add}, v('i', {className:'fa fa-plus'})),
					v('button', {title: 'Sort by name', onClick:this.sortByName}, v('i', {className:'fa fa-sort-alpha-asc'})),
					v('button', {title: 'Sort by date', onClick:this.sortByTime}, v('i', {className:'fa fa-sort-amount-asc'})),
					v('button', {title: 'Clear completed', onClick:this.trash}, v('i', {className:'fa fa-trash-o'}))
				)
			),
			v('ol', {ref:'list', onDrop:dragI>=0&&this.dragEnd, onDragEnd:dragI>=0&&this.dragEnd, onKeyUp:e=>updateHeights(e.currentTarget)},
				todos.map((todo,i)=>
					v('li', {key:todo.id, draggable:true, 
							onDragStart:e=>this.dragStart(e,i), 
							onDragOver:dragI>=0&&(e=>this.dragOver(e,i)),
							style: {opacity:dragI===i?.6:1}
						},
						v('label',
							v('span', '☰'),
							v('input', {type:'checkbox', onChange:e=>this.updateState({todos:updateTodos(todos,i,{checked:e.target.checked})}), checked:Boolean(todo.checked)}),
							v('span', {contentEditable:true, dangerouslySetInnerHTML:{__html:todo.name}, onClick:e=>e.preventDefault(), onBlur:e=>this.blur(e,i)}),
							v('time', todo.time.toLocaleString())
						)
					)
				)
			)
		)
	}
});



// initial Todos list
const todos = [{
	id:1, name: 'Reply to John',
	time: new Date(Date.now()-36*3.6e6)
}, {
	id:2, name: 'Clean home',
	time: new Date(Date.now()-96*3.6e6)
}, {
	id:3, name: 'Fix issue buffer leak #77',
	time: new Date(Date.now()-4*3.6e6)
}];

ReactDOM.render(v(Todos, {todos}), todoapp)





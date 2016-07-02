// in React, with undo/redo. Next step is to modularize and separate concerns (create a component TodoList for the list, Sortable for the sorting behaviour), and require modules
// todo make transitions during sort and drag

// main React util
const v = (tag='div', p, ...children) =>
	!p || React.isValidElement(p)||typeof p==='string'||Array.isArray(p) ?
		React.createElement(tag, undefined, p, ...children) :
		React.createElement(tag, p, ...children);

function equals(o, o2){ //object equal only, and assume same keys
	for (var i in o)
		if (o[i]!==o2[i]) return false;
	return true;
}


const Todos = React.createClass({

	shouldComponentUpdate(p, s){
		return !equals(s, this.state);
	},

	getInitialState(){

		this.history = [this.props.todos];
		this.historyI = 0; // 0 is most recent, length-1 oldest entry

		return {
			todos: this.props.todos,
			dragged: null // todo item being dragged
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
	blur(e, todo){
		if (todo.name!==e.target.textContent){
			const todos = this.state.todos.slice();
			todos.splice(todos.indexOf(todo),1,Object.assign({},todo,{name:e.target.innerHTML}))
			this.updateState({todos});
		}
	},

	dragOver(e, todo){
		e.preventDefault();
		if (todo===this.state.dragged) return;
		const {top, bottom} = e.currentTarget.rect(), oC = (top+bottom)/2;
		if(oC > this.dC && e.clientY > oC) {
			const todos = this.state.todos.slice();
			todos.splice(todos.indexOf(this.state.dragged),1)
			todos.splice(todos.indexOf(todo)+1,0,this.state.dragged)
			this.setState({todos});
		} else if (oC < this.dC && e.clientY < oC) {
			const todos = this.state.todos.slice();
			todos.splice(todos.indexOf(this.state.dragged),1)
			todos.splice(todos.indexOf(todo),0,this.state.dragged)
			this.setState({todos});
		}
	},
	dragStart(e, todo){
		this.setState({dragged:todo});
		const {top, bottom} = e.currentTarget.rect();
		this.dE = e.currentTarget;
		this.dC = (top+bottom)/2;
	},
	dragEnd(e){
		this.updateState({dragged:null});
		this.dE = null;
	},

	componentDidMount(){
		this.forceUpdate()
	},

	componentDidUpdate(p,s){ // we must keep track of dragged elements position, so a nasty side-effect
		let y=0;
		for (let el of this.refs.list.children){
			el.style.transform = `translateY(${y}px)`;
			y+=el.offsetHeight;
		}
		this.refs.list.style.height = y+'px';
		if (this.dE){
			const {top, bottom} = this.dE.rect();
			this.dC = (top+bottom)/2;
		}
	},

	render(){
		const {todos, dragged} = this.state;
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
			v('ol', {ref:'list', onDrop:dragged&&this.dragEnd, onDragEnd:dragged&&this.dragEnd},
				todos.map((todo,i)=>
					v('li', {key:todo.id, draggable:true, 
							onDragStart:e=>this.dragStart(e,todo), 
							onDragOver:dragged&&(e=>this.dragOver(e,todo)),
							style: {opacity:dragged===todo?.6:1}
						},
						v('label',
							v('span', '☰'),
							v('input', {type:'checkbox', onChange:e=>{todo.checked=e.target.checked; this.setState({todos:todos.slice()})}, checked:Boolean(todo.checked)}),
							v('span', {contentEditable:true, dangerouslySetInnerHTML:{__html:todo.name}, onClick:e=>e.preventDefault(), onBlur:e=>this.blur(e,todo)}),
							v('time', todo.time.toLocaleString())
						)
					)
				)
			)
		)
	}

})


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



// DOM utils

Element.prototype.rect = Element.prototype.getBoundingClientRect;
Text.prototype.closest = function(s) {
	return this.parentNode.closest(s);
};

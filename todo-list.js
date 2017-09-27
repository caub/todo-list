(function (react,reactDom,reactRedux,redux) {
'use strict';

const actions = {
	undo: state => state.prev.length ? {
			prev: state.prev.slice(0,-1), 
			value: state.prev[prev.length-1], 
			next: [state.value].concat(state.next)
		} : state,

	redo: state => state.next.length ? {
		prev: state.prev.concat([value]),
		value: state.next[0],
		next: state.next.slice(1)
	} : state,

	update: ({value, prev = []}, {todos}) => ({
		value: todos,
		prev: prev.concat(value)
	}),

	updateTodo: ({value, prev = []}, {i, todo}) => ({ // make a copy and set todo at i-th position
		value: value.slice(0, i).concat(Object.assign({}, value[i], todo)).concat(value.slice(i+1)),
		prev: prev.concat(value)
	}),

	add: ({value, prev = []}) => {
		const id = Math.max(1, ...value.map(t=>t.id)) + 1;
		return {
			value: [{id, text:'New todo #' + id, date: new Date()}].concat(value),
			prev: prev.concat(value)
		};
	},

	trash: ({value, prev = []}) => ({
		value: value.filter(t => !t.checked),
		prev: prev.concat(value)
	}),

	delete: ({value, prev = []}, {id}) => ({
		value: value.filter(t => t.id !== id),
		prev: prev.concat(value)
	}),

	sortByText: ({value, prev = []}) => {
		const sort = value.slice().sort((a,b) => !a.checked === !b.checked ? a.text.localeCompare(b.text) : a.checked ? 1 : -1);
		const isSorted = sort.length === value.length && value.every((ti, i) => ti.id === sort[i].id);

		return isSorted ? {
			value: sort.reverse(),
			alpha:'desc',
			prev: prev.concat(value)
		} : {
			value: sort,
			alpha:'asc',
			prev: prev.concat(value)
		};
	},

	sortByTime: ({value, prev = []}) => {
		const sort = value.slice().sort((a,b) => !a.checked === !b.checked ? a.date-b.date : a.checked ? 1 : -1);
		const isSorted = sort.length === value.length && value.every((ti, i) => ti.id === sort[i].id);

		return isSorted ? {
			value: sort.reverse(),
			time:'desc',
			prev: prev.concat(value)
		} : {
			value: sort,
			time:'asc',
			prev: prev.concat(value)
		};
	}

};


var todoApp = function (state = {}, action) {

	console.log('action', action);
	const fn = actions[action.type];
	return fn ? fn(state, action) : state;

};

const mapDispatchToProps = (dispatch, ownProps) => ({
	onDrop: e => {
		e.preventDefault();
		const text = e.dataTransfer.getData('text');
		try {
			const data = JSON.parse(text);
			dispatch({type: 'delete', id: data.id});
		} catch(e){
			console.error(e);
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

	react.createElement('div', {className:'buttons'},
		react.createElement('button', {title: 'Add a todo', onClick: onAdd}, react.createElement('i', {className:'fa fa-plus'})),
		react.createElement('button', {title: 'Sort by text', onClick: onSortByText}, react.createElement('i', {className:'fa fa-sort-alpha-' + alpha})),
		react.createElement('button', {title: 'Sort by date', onClick: onSortByTime}, react.createElement('i', {className:'fa fa-sort-amount-' + time})),
		react.createElement('button', {title: 'Drop completed', onClick: onTrash, onDrop, onDragOver: e=>e.preventDefault()}, react.createElement('i', {className:'fa fa-trash-o'})),
		react.createElement('flash', null, 'ctrl+(shift+)z to undo/redo')
	)
);

const TodoMenu = reactRedux.connect(
	null,
	mapDispatchToProps
)(Menu);

const sel = getSelection();

function setRange(r) {
	sel.removeAllRanges();
	sel.addRange(r);
}
const getRange = () => sel.rangeCount ? sel.getRangeAt(0) : new Range();

class TodoItem extends react.PureComponent {
	constructor(props) {
		super(props);
		this.state = {text: undefined};

		this.blur = e => {
			// const stateText = this.state.text
			this.setState({text: undefined});
			if (this.props.text!==e.currentTarget.innerHTML)
				this.props.update(e.currentTarget.innerHTML);
		};
		this.focus = e => {
			if (this.state.text!==undefined || e.target.matches('a, a *')) return;
			const propsText = this.props.text, evt = new KeyboardEvent('keyup', e);
			this.setState({text: propsText}, ()=>this.refs.div.dispatchEvent(evt));
			// console.log('focus');
			// if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
			const r = document.caretRangeFromPoint(e.clientX, e.clientY);
			setRange(r);
			// }
		};
		this.shortcuts = e=>{
			if (e.ctrlKey && (e.keyCode==66||e.keyCode==73)) { // ctrl+b or ctrl+i
				const r = getRange();
				if (r.isCollapsed) return;
				const s = r+'', pattern = '*'.repeat(e.keyCode==66?2:1);
				const s2 = s.startsWith(pattern) && s.endsWith(pattern) ? s.slice(pattern.length,-pattern.length) : pattern+s+pattern;
				document.execCommand('insertText', null, s2);
				const r2 = getRange();
				r2.setStart(r2.startContainer, r2.startOffset-s2.length);
				setRange(r2);
				// todo extends to |**..**| or **|..|** 
				// todo don't do nested things
				// **..|.|.** -> ..**|.|**.
				// |.**..**..| -> **|.....|**
			}
		};
		
	}

	render() { 
		const stateText = this.state.text, propsText = this.props.text;
		return react.createElement('div', Object.assign({ref:'div',
			onDrop: this.props.onDrop,
			dangerouslySetInnerHTML:{__html: stateText||markdownToHtml(propsText)}, // final text (props) or text editing mode (state)
			onMouseDown:this.focus,
			onBlur: this.blur
			// onKeyDown: this.shortcuts
		}, !this.props.checked && stateText!==undefined && {contentEditable: ''}));
	}

}

const markdownToHtml = text => text.replace(/(!)?\[([^\]]+)\]\(([^)]+)\)/g, (_,i,t,u)=>i?`<img src="${u}" title="${t}" onload="event.target.dispatchEvent(new KeyboardEvent('keyup', event))">`:`<a href="${u}">${t}</a>`);

function updateHeights(list){ // update heights for each <li> item, that are absolute positioned
	let y=0;
	for (let el of list.children){
		el.style.transform = `translateY(${y}px)`;
		y+=el.offsetHeight;
	}
	list.style.height = y+'px';
}

function timeago(time) { // time in minutes
	if (time<1) return 'just now';
	if (time<60) return `${Math.floor(time)}' ago`;
	if (time<1440) return `${Math.floor(time/60)}h ago`;
	const y = Math.floor(time/525600), d = Math.floor((time-y*525600)/1440);
	return (y?`${y}y`:'')+(y&&d?' ':'')+(d?`${d}d`:'')+' ago';
}

if (document.caretPositionFromPoint && !document.caretRangeFromPoint){
	document.caretRangeFromPoint = function(x, y) {
		let range = document.caretPositionFromPoint(x,y);
		let r = new Range();
		r.setStart(range.offsetNode, range.offset);
		return r;
	};
}

const rgb1 = [120,175,255];
const rgb2 = [255,255,0];
const rgb3 = [255,40,0];


function TodoTime({date, checked, onChange, onDragStart, onDrop}) {
	const time = (Date.now()-date.getTime())/60000,
		k = 2/(1+1440/time)-1;
	const rgb = k<0 ? rgb1.map((x,i) => Math.round(-x*k+rgb2[i]*(1+k))) : rgb3.map((x,i) => Math.round(x*k+rgb2[i]*(1-k)));

	return react.createElement('input', {
		draggable:true,
		onDragStart,
		onDrop,
		type:'checkbox',
		title: timeago(time),
		style: {backgroundImage:`radial-gradient(ellipse closest-side, rgba(${rgb},.8) 50%, transparent)`},
		onChange,
		checked
	});
}

function restorePointerEvents(li){
	li.style.pointerEvents = '';
}

const mapStateToProps = (state, ownProps) => {
	// console.log('todolist__', 'states', state, "props",  ownProps)
	return {
		todos: state.value
		// todo map also state ones, but how to do then, to update a local state? from the container wrappper?
	};
};

const mapDispatchToProps$1 = (dispatch, ownProps) => ({
	updateTodo: (i, todo) => {
		dispatch({type: 'updateTodo', i, todo});
	},
	onDrop: todos => {
		dispatch({type: 'update', todos});
	}
	
});

class List extends react.PureComponent {

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
				this.redo();
			else if (e.ctrlKey && e.keyCode===90)
				this.undo();
		});
	}

	componentDidUpdate(p,s){
		this.updateHeights();
	}

	render() {
		const {todos = this.props.todos, dragI} = this.state; // todos is searched in local state, when it's undefined, we take it in props
		// console.log('render todo list', this.state.todos==undefined, ...todos.map((t,i)=>[i, t.text]));

		return react.createElement('ol', {
				ref:'list',
				onDragOver: e => dragI >= 0 && e.preventDefault(),
				onDrop: this.onDrop,
				onDragEnd: this.dragEnd
			},
			todos.map((todo, i)=>
				react.createElement('li', {key:todo.id,
						onDragOver: e => this.dragOver(e, i),
						onDrop: this.onDrop,
						style: {opacity:dragI === i ? .5 : 1}
					},
					react.createElement(TodoTime, {
						onDragStart: e => this.dragStart(e, i),
						onDrop: this.onDrop, 
						checked: Boolean(todo.checked),
						date: todo.date,
						onChange:e => this.props.updateTodo(i, {checked: e.target.checked})
					}),
					react.createElement(TodoItem, {
						text: todo.text,
						checked: Boolean(todo.checked),
						onDrop: this.onDrop,
						update: text => this.props.updateTodo(i, {text})
					})
				)
			)
		);
	}
}

const TodoList = reactRedux.connect(
	mapStateToProps,
	mapDispatchToProps$1
)(List);

const TodoApp = () => (
	react.createElement('div', null,
		react.createElement(TodoMenu),
		react.createElement(TodoList)
	)
);

const parseTodos = s => {
	try {
		const todos = JSON.parse(s, (k,v) => k==='date' ? new Date(v) : v);
		if (Array.isArray(todos)) return todos;
	} catch(e) {
	}
	// else return a random initial default
	return [{
		id:1, text: 'Reply to <strong>John</strong>',
		date: new Date(Date.now()-36*3.6e6)
	}, {
		id:5, text: "Fix hole ![in the ceiling](https://s-media-cache-ak0.pinimg.com/564x/21/e3/00/21e300494123462dd0b2b0c4ece3b561.jpg)",
		date: new Date(Date.now()-6*86400e3)
	}, {
		id:3, text: "💻 stored locally in localStorage.todos", 
		date: new Date('2016-10-13 12:00')
	}, {
		id:2, text: 'Eat a 🍊', checked: true,
		date: new Date(Date.now()-96*3.6e6)
	}];
};

const todos = parseTodos(localStorage.todos);

const store = redux.createStore(todoApp, {value: todos});

store.subscribe(() => {
	localStorage.todos = JSON.stringify(store.getState().value);
});

reactDom.render(
	react.createElement(reactRedux.Provider, {store},
		react.createElement(TodoApp)
	),
	todoapp
);

}(react,reactDom,reactRedux,redux));

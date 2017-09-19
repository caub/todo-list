import React from 'react';
import TodoMenu from './TodoMenu';
import TodoList from './TodoList';

const v = React.createElement;

export default class TodoApp extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {
			value: this.props.todos,
			next: [],
			prev: []
		};

		this.update = (todos, cb) => {
			const {value, prev} = this.state;
			const todos2 = typeof todos==='function' ? todos(value) : todos;
			
			this.setState({value: todos2, prev: prev.concat([value]), next: []}, cb);
		};

		this.undo = ()=>{
			const {value, next, prev} = this.state;
			if (prev.length) {
				this.setState({prev: prev.slice(0,-1), value: prev[prev.length-1], next:[value].concat(next)});
			}
		};
		this.redo = ()=>{
			const {value, next, prev} = this.state;
			if (next.length) {
				this.setState({prev: prev.concat([value]), value: next[0], next:next.slice(1)});
			}
		};

	}

	componentDidUpdate(){
		localStorage.todos = JSON.stringify(this.state.value);
		// this.refs.flash.animate([{opacity:.1}, {opacity:.7, offset:.2},{opacity:0}], {duration: 1500});
	}


	componentDidMount(){
		window.addEventListener('keydown', e=>{
			if (document.activeElement.isContentEditable) return;
			if (e.ctrlKey && e.shiftKey && e.keyCode===90 || e.ctrlKey && e.keyCode===89)
				this.redo();
			else if (e.ctrlKey && e.keyCode===90)
				this.undo();
		});
	}
	

	render(){

		return v('div', null,

			v(TodoMenu, {ref:'menu', update:this.update}),

			// v('flash', {ref:'flash'}, getFlash()),

			v(TodoList, {todos: this.state.value, update:this.update})

		)
	}
};


// function getFlash() {
// 	var r = Math.random();
// 	if (r<.33) return '🆗';
// 	if (r<.66) return '🆒';
// 	if (r<.99) return '🆙';
// 	return '☘️';
// }
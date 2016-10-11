const React = require('react');
const TodoMenu = require('./TodoMenu');
const TodoList = require('./TodoList');
const v = React.createElement;

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		this.state = {
			historyI: 0, // history index representing the current state of app // 0 is most recent .. length-1 oldest entry
			history: [this.props.todos], //  list/store of all historical todos, need to find a better way to expose it
		};

		// update/'increment' history with a new todos lists
		this.update = (todos, cb) => { // no top-level class props in JS yet, but it's coming
			const {historyI, history} = this.state;
			const todos2 = typeof todos==='function' ? todos(history[historyI]) : todos;
			// not check quickly if it's really worth updating
			// take longest between the old one and the new:
			const [a, b] = todos2.length<history[historyI].length ? [history[historyI],todos2]:[todos2,history[historyI]]; // could .sort too

			if (a.some((ai,i)=>ai!==b[i])) // put a new history entry entry
				this.setState({historyI:0, history:[todos2].concat(history.slice(historyI)), dragI:-1}, cb);
			else 
				this.setState({history:Object.assign(history.slice(), {[historyI]:todos2}), dragI:-1}, cb);
		};

		this.undo = ()=>{
			const {historyI, history} = this.state;
			if (historyI<history.length-1)
				this.setState({historyI: historyI+1});
		};
		this.redo = ()=>{
			const {historyI} = this.state;
			if (historyI>0)
				this.setState({historyI: historyI-1});
		};

	}

	componentDidUpdate(p,s){
		localStorage.todos = JSON.stringify(this.state.history[this.state.historyI]);
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
		const {dragI, historyI, history} = this.state;

		// console.log('render app', historyI, history.length);
		
		return v('div', null,

			v(TodoMenu, {historyI, historyLength:history.length, update:this.update}),

			v(TodoList, {todos:history[historyI], update:this.update})

		)
	}
};

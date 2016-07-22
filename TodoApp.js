const {v, equals} = require('./utils.js');
const TodoMenu = require('./TodoMenu.js');
const TodoList = require('./TodoList.js');

// 

module.exports = React.createClass({

	shouldComponentUpdate(p, s){
		return !equals(s, this.state); // pure comp
	},

	getInitialState(){ // initialize the app's state tree and history

		return {
			historyI: 0, // history index representing the current state of app // 0 is most recent .. length-1 oldest entry
			history: [this.props.todos], //  list/store of all historical todos, need to find a better way to expose it
		};
	},

	// update/'increment' history with a new todos lists
	update(todos){
		// const {todos=this.state.todos}=state, h = this.history[this.historyI];
		// if (h.length!==todos.length || h.some((hi,i)=>hi!==todos[i])){
		// ^ commented, make sure to updateState only when you chnaged the content, see blur 
		const {historyI, history} = this.state;
		this.setState({historyI:0, history:[todos].concat(history.slice(historyI)), dragI:-1});
		// this.setState( // old  way
		// 	{todos, historyI:0, dragI},
		// 	()=>this.history = [this.state].concat(history.slice(historyI)) // could limit history size here // we could use a linkedlist as well
		// );
		// }
	},
	updateWith(cb) {
		const {historyI, history} = this.state;
		this.update(cb(history[historyI]))
	},

	undo(e){
		const {historyI, history} = this.state;
		if (historyI<history.length-1){
			this.setState({historyI: historyI+1});
		}
	},
	redo(e){
		const {historyI} = this.state;
		if (historyI>0){
			this.setState({historyI: historyI-1});
		}
	},
	

	render(){
		const {dragI, historyI, history} = this.state;

		// console.log('render app', historyI, history.length);
		
		return v('div',

			v(TodoMenu, {updateWith:this.updateWith, undo:this.undo,redo:this.redo, historyI, historyLength:history.length}),

			v(TodoList, {update:this.update, todos:history[historyI]})

		)
	}
});

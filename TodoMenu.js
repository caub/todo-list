const {v, equals} = require('./utils.js');
let tempid = 1;

module.exports = React.createClass({
	shouldComponentUpdate(p, s){
		return !equals(p, this.props); // pure comp (always false)
	},

	add(){
		this.props.update(todos=>[{id:'_'+tempid++, name:'New todo #'+(todos.length+1), time: new Date()}].concat(todos));
	},
	trash(){
		this.props.update(todos=>todos.filter(t=>!t.checked))
	},
	sortByName(){
		this.props.update(todos=>todos.slice().sort((a,b)=>(a.name>b.name)-.5))
	},
	sortByTime(){
		this.props.update(todos=>todos.slice().sort((a,b)=>(a.time<b.time)-.5))
	},

	render() {
		const {historyI, historyLength, undo, redo} = this.props;

		// console.log('render menu', historyI, historyLength);

		return v('div', {className:'buttons'},
			v('div',
				v('button', {
						disabled: historyI===historyLength-1,
						onClick: undo
					}, 
					v('i', {className:'fa fa-mail-reply'})
				),
				v('button', {
						disabled: historyI===0,
						onClick: redo
					}, 
					v('i', {className:'fa fa-mail-forward'})
				)
			),
			v('div',
				v('button', {title: 'Add a todo', onClick: this.add}, v('i', {className:'fa fa-plus'})),
				v('button', {title: 'Sort by name', onClick:this.sortByName}, v('i', {className:'fa fa-sort-alpha-asc'})),
				v('button', {title: 'Sort by date', onClick:this.sortByTime}, v('i', {className:'fa fa-sort-amount-asc'})),
				v('button', {title: 'Clear completed', onClick:this.trash}, v('i', {className:'fa fa-trash-o'}))
			)
		);
	}
})
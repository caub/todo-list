const React = require('react');
const v = React.createElement;

const maxId = todos => Math.max(1, ...todos.map(t=>t.id));

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		const {update} = props;
		this.add = () =>
			update(todos=>[{id:maxId(todos)+1, text:'New todo #'+(todos.length+1), time: new Date()}].concat(todos));
		this.trash = () =>
			update(todos=>todos.filter(t=>!t.checked))

		this.sortByText = () =>
			update(todos=>todos.slice().sort((a,b)=>(a.text>b.text)-.5))

		this.sortByTime = () =>
			update(todos=>todos.slice().sort((a,b)=>(a.time<b.time)-.5))

	}
	

	render() {

		return v('div', {className:'buttons'},
			v('button', {title: 'Add a todo', onClick: this.add}, v('i', {className:'fa fa-plus'})),
			v('button', {title: 'Sort by text', onClick:this.sortByText}, v('i', {className:'fa fa-sort-alpha-asc'})),
			v('button', {title: 'Sort by date', onClick:this.sortByTime}, v('i', {className:'fa fa-sort-amount-asc'})),
			v('button', {title: 'Clear completed', onClick:this.trash}, v('i', {className:'fa fa-trash-o'}))
		);
	}
};
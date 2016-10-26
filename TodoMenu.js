const React = require('react');
const v = React.createElement;

const maxId = todos => Math.max(1, ...todos.map(t=>t.id));

module.exports = class extends React.PureComponent {

	constructor(props){
		super(props);
		const {update} = props;
		this.add = () =>
			update(todos=>{
				const id = maxId(todos)+1;
				return [{id, text:'New todo #'+id, date: new Date()}].concat(todos);
			});
		this.trash = () =>
			update(todos=>todos.filter(t=>!t.checked))

		this.sortByText = () =>
			update(todos=>todos.slice().sort((a,b)=>!a.checked==!b.checked? a.text.localeCompare(b.text) : a.checked?1:-1 ))

		this.sortByTime = () =>
			update(todos=>todos.slice().sort((a,b)=>!a.checked==!b.checked? a.date-b.date : a.checked?1:-1 ))

		this.drop = e=>{
			e.preventDefault();
			const text = e.dataTransfer.getData('text');
			try {
				const data = JSON.parse(text);
				update(todos=>todos.filter(t=>t.id!==data.id));
			} catch(e){
				console.error(e)
			}
		}

	}
	

	render() {

		return v('div', {className:'buttons'},
			v('button', {title: 'Add a todo', onClick: this.add}, v('i', {className:'fa fa-plus'})),
			v('button', {title: 'Sort by text', onClick:this.sortByText}, v('i', {className:'fa fa-sort-alpha-asc'})),
			v('button', {title: 'Sort by date', onClick:this.sortByTime}, v('i', {className:'fa fa-sort-amount-asc'})),
			v('button', {title: 'Drop completed', onClick:this.trash, onDrop:this.drop, onDragOver: e=>e.preventDefault()}, v('i', {className:'fa fa-trash-o'}))
		);
	}
};
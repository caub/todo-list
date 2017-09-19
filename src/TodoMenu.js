import React from 'react';
import { connect } from 'react-redux';

const v = React.createElement;

const maxId = todos => Math.max(1, ...todos.map(t=>t.id));

export default class TodoMenu extends React.PureComponent {

	constructor(props){
		super(props);

		this.add = () =>
			this.props.update(todos=>{
				const id = maxId(todos)+1;
				return [{id, text:'New todo #'+id, date: new Date()}].concat(todos);
			});
		this.trash = () =>
			this.props.update(todos=>todos.filter(t=>!t.checked))

		this.sortByText = () => {
			this.props.update(todos=> {
				var sort = todos.slice().sort((a,b)=>!a.checked==!b.checked? a.text.localeCompare(b.text) : a.checked?1:-1 );
				var isSorted = sort.length==todos.length && todos.every((ti, i) => ti.id == sort[i].id);
				if (isSorted) {
					this.setState({alpha:'desc'});
					return sort.reverse()
				}
				this.setState({alpha:'asc'});
				return sort;
			})
		}

		this.sortByTime = () => {
			this.props.update(todos=> {
				var sort = todos.slice().sort((a,b)=>!a.checked==!b.checked? a.date-b.date : a.checked?1:-1 );
				var isSorted = sort.length==todos.length && todos.every((ti, i) => ti.id == sort[i].id);
				if (isSorted) {
					this.setState({time:'desc'});
					return sort.reverse()
				}
				this.setState({time:'asc'});
				return sort;
			})
		}

		this.drop = e=>{
			e.preventDefault();
			const text = e.dataTransfer.getData('text');
			try {
				const data = JSON.parse(text);
				this.props.update(todos=>todos.filter(t=>t.id!==data.id));
			} catch(e){
				console.error(e)
			}
		}

		this.state = {alpha:'asc', time:'asc'};

	}

	

	render() {
		var {alpha, time} = this.state;
		return v('div', {className:'buttons'},
			v('button', {title: 'Add a todo', onClick: this.add}, v('i', {className:'fa fa-plus'})),
			v('button', {title: 'Sort by text', onClick:this.sortByText}, v('i', {className:'fa fa-sort-alpha-'+alpha})),
			v('button', {title: 'Sort by date', onClick:this.sortByTime}, v('i', {className:'fa fa-sort-amount-'+time})),
			v('button', {title: 'Drop completed', onClick:this.trash, onDrop:this.drop, onDragOver: e=>e.preventDefault()}, v('i', {className:'fa fa-trash-o'})),
			v('flash', {ref:'flash'}, 'ctrl+(shift+)z to undo/redo')
		);
	}
};


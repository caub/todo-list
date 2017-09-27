
const actions = {
	undo: state => state.prev && state.prev.length ? {
			prev: state.prev.slice(0,-1), 
			value: state.prev[state.prev.length-1], 
			next: [state.value].concat(state.next || [])
		} : state,

	redo: state => state.next && state.next.length ? {
		prev: (state.prev || []).concat([state.value]),
		value: state.next[0],
		next: state.next.slice(1)
	} : state,

	update: ({value, prev = []}, {todos}) => ({
		value: todos,
		prev: prev.concat([value])
	}),

	updateTodo: ({value, prev = []}, {i, todo}) => ({ // make a copy and set todo at i-th position
		value: value.slice(0, i).concat(Object.assign({}, value[i], todo)).concat(value.slice(i+1)),
		prev: prev.concat([value])
	}),

	add: ({value, prev = []}) => {
		const id = Math.max(1, ...value.map(t=>t.id)) + 1;
		return {
			value: [{id, text:'New todo #' + id, date: new Date()}].concat(value),
			prev: prev.concat([value])
		};
	},

	trash: ({value, prev = []}) => ({
		value: value.filter(t => !t.checked),
		prev: prev.concat([value])
	}),

	delete: ({value, prev = []}, {id}) => ({
		value: value.filter(t => t.id !== id),
		prev: prev.concat([value])
	}),

	sortByText: ({value, prev = []}) => {
		const sort = value.slice().sort((a,b) => !a.checked === !b.checked ? a.text.localeCompare(b.text) : a.checked ? 1 : -1);
		const isSorted = sort.length === value.length && value.every((ti, i) => ti.id === sort[i].id);

		return isSorted ? {
			value: sort.reverse(),
			alpha:'desc',
			prev: prev.concat([value])
		} : {
			value: sort,
			alpha:'asc',
			prev: prev.concat([value])
		};
	},

	sortByTime: ({value, prev = []}) => {
		const sort = value.slice().sort((a,b) => !a.checked === !b.checked ? a.date-b.date : a.checked ? 1 : -1);
		const isSorted = sort.length === value.length && value.every((ti, i) => ti.id === sort[i].id);

		return isSorted ? {
			value: sort.reverse(),
			time:'desc',
			prev: prev.concat([value])
		} : {
			value: sort,
			time:'asc',
			prev: prev.concat([value])
		};
	}

};


export default function (state = {}, action) {
	const fn = actions[action.type];
	return fn ? fn(state, action) : state;
}

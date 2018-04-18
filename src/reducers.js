const UNDO = 'UNDO';
const REDO = 'REDO';
const UPDATE = 'UPDATE';
const UPDATE_TODO = 'UPDATE_TODO';
const ADD_TODO = 'ADD_TODO';
const DELETE_TODO = 'DELETE_TODO';
const TRASH = 'TRASH';
const SORT_BY_TEXT = 'SORT_BY_TEXT';
const SORT_BY_TIME = 'SORT_BY_TIME';

// action creators:
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const update = value => ({ type: UPDATE, value });
export const updateTodo = value => ({ type: UPDATE_TODO, value });
export const addTodo = value => ({ type: ADD_TODO, value });
export const deleteTodo = id => ({ type: DELETE_TODO, value: id });
export const trash = () => ({ type: TRASH });
export const sortByText = () => ({ type: SORT_BY_TEXT });
export const sortByTime = () => ({ type: SORT_BY_TIME });

const historyPush = ({ value, prev = [], next }, newValue) => {
	if (newValue.length === value.length && newValue.every((o, i) => o === value[i])) {
		return { prev, value, next };
	}
	return {
		value: newValue,
		prev: prev.concat([value]),
		next: undefined
	}
};

const reducers = {
	[UNDO]: state => state.prev && state.prev.length ? {
		prev: state.prev.slice(0, -1),
		value: state.prev[state.prev.length - 1],
		next: [state.value].concat(state.next || [])
	} : state,

	[REDO]: state => state.next && state.next.length ? {
		prev: (state.prev || []).concat([state.value]),
		value: state.next[0],
		next: state.next.slice(1)
	} : state,

	[UPDATE]: (state, todos) => historyPush(state, todos),

	[UPDATE_TODO]: (state, todo) => historyPush(
		state,
		state.value.map(o => o.id === todo.id ? { ...o, ...todo } : o)
	),

	[ADD_TODO]: state => {
		const id = Math.max(1, ...state.value.map(t => t.id)) + 1;
		return historyPush(
			state,
			[{ id, text: 'New todo #' + id, date: new Date() }].concat(state.value)
		);
	},

	[TRASH]: state => historyPush(state, state.value.filter(t => !t.checked)),

	[DELETE_TODO]: (state, id) => historyPush(state, state.value.filter(o => o.id !== id)),

	[SORT_BY_TEXT]: ({ value, prev = [], alpha }) => {
		const sorted = value.slice().sort((a, b) => !a.checked === !b.checked ? a.text.localeCompare(b.text) : a.checked ? 1 : -1);
		const isSame = value.every((ti, i) => ti.id === sorted[i].id);

		return isSame ? {
			value: sorted.reverse(),
			alpha: 'desc',
			prev: prev.concat([value])
		} : {
				value: sorted,
				alpha: 'asc',
				prev: prev.concat([value])
			};
	},

	[SORT_BY_TIME]: ({ value, prev = [], time }) => {
		const sorted = value.slice().sort((a, b) => !a.checked === !b.checked ? b.date - a.date : a.checked ? -1 : 1);
		const isSame = value.every((ti, i) => ti.id === sorted[i].id);

		return isSame ? {
			value: sorted.reverse(),
			time: time === 'asc' ? 'desc' : 'asc',
			prev: prev.concat([value])
		} : {
				value: sorted,
				time: 'asc',
				prev: prev.concat([value])
			};
	}
};


export default (state = {}, { type, value }) => {
	const fn = reducers[type];
	return fn ? fn(state, value) : state;
}

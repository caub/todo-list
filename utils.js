
const React = require('react');

// update todos action
const updateTodos = (todos, i, todo) => // updates todos i-th item with todo
	todos.slice(0,i)
			.concat(Object.assign({},todos[i],todo))
			.concat(todos.slice(i+1))


// react non-jsx util
function v (tag, p, ...children){
	return !p || React.isValidElement(p)||typeof p==='string'||Array.isArray(p) ?
		React.createElement(tag, undefined, p, ...children) :
		React.createElement(tag, p, ...children);
}

// general util
function equals(o, o2){ //object equal only, and assume same keys
	for (let i in o)
		if (o[i]!==o2[i]) return false;
	return true;
}

function updateHeights(list){ // update heights for each <li> item, that are absolute positioned
	let y=0;
	for (let el of list.children){
		el.style.transform = `translateY(${y}px)`;
		y+=el.offsetHeight;
	}
	list.style.height = y+'px';
}

// function historize(items){
// 	let i = 0; // items if the historical list of states. // 0 is most recent .. length-1 oldest entry
// 	function push(item){
// 		items = [todos].concat(items.slice(i)); // we could slice(i, MAX_ITEMS) to ensure max memory
// 		i = 0;
// 	}
// 	const isOldest = ()=>i===items.length-1;
// 	const isNewest = ()=>{console.log(i); return i===0};
// 	return {
// 		push,
// 		isOldest,
// 		isNewest,
// 		undo() {
// 			if (!isOldest()) i++;
// 			console.log('undo', i);
// 			return items[i];
// 		},
// 		redo(){
// 			if (!isNewest()) i--;
// 			console.log('redo', i);
// 			return items[i];
// 		}
// 	}
// }

// function historize(items){
// 	return {
// 		items,
// 		i: 0, // items if the historical list of states. // 0 is most recent .. length-1 oldest entry
// 		push(item){
// 			this.items = [todos].concat(this.items.slice(this.i)); // we could slice(this.i, MAX_ITEMS) to ensure max memory
// 			this.i = 0;
// 		},
// 		undo(){
// 			console.log('undo()', this.i, this.items.length-1);
// 			if (this.i<this.items.length-1) this.i++;
// 		},
// 		redo(){
// 			console.log('redo()', this.i, this.items.length-1);
// 			if (this.i>0) this.i--;
// 		}
// 	}
// }


module.exports = {
	// actions
	updateTodos,

	// utils 
	v,
	equals,
	updateHeights
};


Element.prototype.rect = Element.prototype.getBoundingClientRect; // lazy..
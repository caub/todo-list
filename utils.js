
const {floor} = Math;


export function updateHeights(list){ // update heights for each <li> item, that are absolute positioned
	let y=0;
	for (let el of list.children){
		el.style.transform = `translateY(${y}px)`;
		y+=el.offsetHeight;
	}
	list.style.height = y+'px';
}

export function timeago(time) { // time in minutes
	if (time<1) return 'just now';
	if (time<60) return `${floor(time)}' ago`;
	if (time<1440) return `${floor(time/60)}h ago`;
	const y = floor(time/525600), d = floor((time-y*525600)/1440);
	return (y?`${y}y`:'')+(y&&d?' ':'')+(d?`${d}d`:'')+' ago';
}

export default updateHeights;

// console.log(...[
// 	new Date('2016-10-09 20:40'),
// 	new Date('2014-12-12 20:40'),
// 	new Date('2016-09-30 20:40'),
// 	new Date('2016-06-10 10:26')
// ].map(d=>[d.toLocaleDateString(), timeago(d)]))

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

if (document.caretPositionFromPoint && !document.caretRangeFromPoint){
	document.caretRangeFromPoint = function(x, y) {
		let range = document.caretPositionFromPoint(x,y);
		let r = new Range();
		r.setStart(range.offsetNode, range.offset);
		return r;
	}
}


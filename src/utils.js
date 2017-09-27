
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
	if (time<60) return `${Math.floor(time)}' ago`;
	if (time<1440) return `${Math.floor(time/60)}h ago`;
	const y = Math.floor(time/525600), d = Math.floor((time-y*525600)/1440);
	return (y?`${y}y`:'')+(y&&d?' ':'')+(d?`${d}d`:'')+' ago';
}

if (document.caretPositionFromPoint && !document.caretRangeFromPoint){
	document.caretRangeFromPoint = function(x, y) {
		let range = document.caretPositionFromPoint(x,y);
		let r = new Range();
		r.setStart(range.offsetNode, range.offset);
		return r;
	}
}


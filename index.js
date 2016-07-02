// Simple Todo implementation in pure JavaScript, next step will be to use React to organize and simplify it

const {add, name, date, trash} = modify.elements;

modify.addEventListener('submit', e=>{
	e.preventDefault();
})

name.addEventListener('click', e=>{
	const items = Array.from(list.children);
	items.sort((a,b)=>a.textContent>b.textContent);
	for (let item of items)
		list.appendChild(item);
	update(list)
})

date.addEventListener('click', e=>{
	const items = Array.from(list.children);
	items.sort((a,b)=>+b.dataset.time-a.dataset.time);
	for (let item of items)
		list.appendChild(item);
	update(list)
})

trash.addEventListener('click', e=>{
	Array.from(list.children)
		.filter(li=>li.querySelector('input').checked)
		.forEach(li=>li.remove());
	update(list)
})

add.addEventListener('click', e=>{
	list.appendChild(Todo({name:'New todo #'+list.childElementCount, time: new Date()}))
	update(list)
})

list.addEventListener('dragstart', e=>{
	let dragged = e.target.closest('li'), dR = dragged.rect(), dC = (dR.top+dR.bottom)/2; // dragged center
	const dragover = e=>{
		e.preventDefault();
		const over = e.currentTarget;
		if (over===dragged) return;
		const oR = over.rect(), oC = (oR.top+oR.bottom)/2;
		if(oC > dC && e.clientY > oC) {
			if (over.nextElementSibling) list.insertBefore(dragged, over.nextElementSibling)
			else list.appendChild(dragged)
			update(list)
			dR = dragged.rect(); dC = (dR.top+dR.bottom)/2;
		} else if (oC < dC && e.clientY < oC) {
			list.insertBefore(dragged, over);
			update(list)
			dR = dragged.rect(); dC = (dR.top+dR.bottom)/2;
		}

	};
	const drop = e=>{
		console.log(e.type);
		for (let el of list.children)
			el.removeEventListener('dragover', dragover);
		list.removeEventListener('dragend', drop);
		list.removeEventListener('drop', drop);
	}

	for (let el of list.children)
			el.addEventListener('dragover', dragover);
	list.addEventListener('dragend', drop);
	list.addEventListener('drop', drop);


	// console.log('ds', e.target);
	// e.dataTransfer.setDragImage(frag, e.clientX-e.target.offsetLeft, e.clientY-e.target.offsetY)
})


list.addEventListener('click', e=>{
	if (e.target.isContentEditable) {
		e.stopPropagation();
		e.preventDefault();
	} 
})



const todos = [{
	name: 'Reply to John',
	time: new Date(Date.now()-36*3.6e6)
}, {
	name: 'Clean home',
	time: new Date(Date.now()-96*3.6e6)
}, {
	name: 'Fix issue buffer leak #77',
	time: new Date(Date.now()-4*3.6e6)
}];

const Todo = ({name, time}) => h('li', {draggable: true, data:{time:time.getTime()}},
		h('label',
			h('span', '☰'),
			h('input', {type:'checkbox'}),
			h('span', {contentEditable:true}, name),
			h('time', time.toLocaleString())
		)
	);


// init Todo List
for (let todo of todos)
	list.appendChild(Todo(todo))

update(list)
function update(list){
	let y=0;
	for (let el of list.children){
		el.style.transform = `translateY(${y}px)`;
		y+=el.offsetHeight;
	}
	list.style.height = y+'px';
}




// DOM utils

function h(tag, p, ...children){ // 'hyperscript' util function, to make quickly DOM elements
	if (p instanceof Node||typeof p==='string'||Array.isArray(p)) return h(tag, null, p, ...children);
	const el=document.createElement(tag);
	if (p){
		Object.assign(el, p);
		if (p.style) Object.assign(el.style, p.style);
		if (p.data) for (let i in p.data) el.dataset[i]=p.data[i];
		for (let name in p){
			if (name.startsWith('on') && p[name])
				el.addEventListener(name.substring(2).toLowerCase(), p[name], true); // or el[name.toLowerCase()] = p[name];
		}
	}
	[].concat(...children.map(c=>typeof c==='string'?document.createTextNode(c):c))// flatten a list of children, and make text nodes when needed
	.forEach(c=>el.appendChild(c)) // and append them to el
	return el;
}

Element.prototype.rect = Element.prototype.getBoundingClientRect;
Text.prototype.closest = function(s) {
	return this.parentNode.closest(s);
};

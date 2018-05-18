// Simple Todo implementation in pure JavaScript, next step will be to use React to organize and simplify it

const {add, name, date, trash} = modify.elements;

modify.addEventListener('submit', e => {
	e.preventDefault();
})

name.addEventListener('click', e => {
	const items = Array.from(list.children);
	items.sort((a, b) => a.textContent > b.textContent);
	for (let item of items)
		list.appendChild(item);
	update(list)
})

date.addEventListener('click', e => {
	const items = Array.from(list.children);
	items.sort((a, b) => +b.dataset.time - a.dataset.time);
	for (let item of items)
		list.appendChild(item);
	update(list)
})

trash.addEventListener('click', e => {
	Array.from(list.children)
		.filter(li => li.querySelector('input').checked)
		.forEach(li => li.remove());
	update(list)
})

add.addEventListener('click', e => {
	list.appendChild(Todo({name: 'New todo #' + list.childElementCount, time: new Date()}))
	update(list)
})

list.addEventListener('dragstart', e => {
	const dragged = e.target.closest('li');
	const children = Array.from(list.children); // capture children order

	const dragover = e => {
		e.preventDefault();
		const over = e.currentTarget;
		if (over === dragged) return;
		const {top: dragTop} = dragged.getBoundingClientRect();
		const {top, bottom} = over.getBoundingClientRect();
		const dragHeight = dragged.offsetHeight;

		// pivot = (bottom+top)/2; // easy way
		const pivot = dragHeight >= e.currentTarget.offsetHeight ?
			(dragTop < top ? top : bottom) :
			(dragTop < top ? (bottom - dragHeight + top) / 2 : (top + dragHeight + bottom) / 2);

		if (over === dragged.nextElementSibling && e.clientY <= pivot || over === dragged.previousElementSibling && e.clientY >= pivot) return;
		over.style.pointerEvents = 'none';

		if (e.clientY > pivot) {
			over.after(dragged);
		} else {
			over.before(dragged);
		}
		update(list);
		setTimeout(() => {over.style.pointerEvents = ''}, 300); // transitionend not reliable
	};

	const drop = e => {
		children.forEach(el => el.removeEventListener('dragover', dragover));
		list.removeEventListener('dragend', drop);
		list.removeEventListener('drop', drop);
	}



	children.forEach(el => el.addEventListener('dragover', dragover));
	list.addEventListener('dragend', drop);
	list.addEventListener('drop', drop);

	e.dataTransfer.setData('text/custom', 'sort');
	const {left, top} = dragged.getBoundingClientRect();
	e.dataTransfer.setDragImage(dragged, e.clientX - left, e.clientY - top);
})


list.addEventListener('click', e => {
	if (e.target.isContentEditable) {
		e.stopPropagation();
		e.preventDefault();
	}
})


const todos = [{
	name: 'Reply to John',
	time: new Date(Date.now() - 36 * 3.6e6)
}, {
	name: 'Clean home',
	time: new Date(Date.now() - 96 * 3.6e6)
}, {
	name: 'Fix issue buffer leak #77',
	time: new Date(Date.now() - 4 * 3.6e6)
}];

const Todo = ({name, time}) => h('li', {'data-time': time.getTime()})(
	h('div')(
		h('span', {draggable: true, className: 'handle'})('☰'),
		h('input', {type: 'checkbox'})(),
		h('div', {contentEditable: true, className: 'todo'})(name),
		h('time')(time.toLocaleString())
	)
);


// init Todo List
for (let todo of todos)
	list.appendChild(Todo(todo))

update(list);

function update(list) {
	let y = 0;
	for (let i = 0; i < list.childElementCount; i++) {
		list.children[i].style.transform = `translateY(${y}px)`;
		y += list.children[i].offsetHeight;
	}
	list.style.height = y + 'px';
}


// DOM utils

function h(nodeName, {style, className, ...attrs} = {}) {
	const el = document.createElement(nodeName);
	el.className = className;
	if (typeof style === 'object') {
		Object.assign(el.style, style);
	} else if (typeof style === 'string') {
		el.setAttribute('style', style);
	}
	Object.keys(attrs).forEach(k => {
		if (typeof attrs[k] === 'function') {
			el.addEventListener(name.replace(/^on/, '').toLowerCase(), attrs[k], true);
		} else {
			el.setAttribute(k, attrs[k]);
		}
	});
	return (...children) => {
		el.append(...children);
		return el;
	}
}

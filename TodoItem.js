const React = require('react');
const v = React.createElement;
const sel = getSelection();

function setRange(r) {
	sel.removeAllRanges();
	sel.addRange(r);
}
const getRange = ()=>sel.rangeCount?sel.getRangeAt(0):new Range();

module.exports = class extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {text: undefined};

		this.blur = (e, text) => {
			// const stateText = this.state.text
			this.setState({text: undefined});
			// if (text!==e.currentTarget.innerHTML)
			this.props.update(e.currentTarget.innerHTML);
		};
		this.focus = e=>{
			if (this.state.text!==undefined || e.target.matches('a, a *')) return;
			const propsText = this.props.text, evt = new KeyboardEvent('keyup', e);
			this.setState({text: propsText}, ()=>this.refs.div.dispatchEvent(evt));
			// console.log('focus');
			// if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
			const r = document.caretRangeFromPoint(e.clientX, e.clientY);
			setRange(r);
			// }
		};
		this.shortcuts = e=>{
			if (e.ctrlKey && (e.keyCode==66||e.keyCode==73)) { // ctrl+b or ctrl+i
				const r = getRange();
				if (r.isCollapsed) return;
				const s = r+'', pattern = '*'.repeat(e.keyCode==66?2:1);
				const s2 = s.startsWith(pattern) && s.endsWith(pattern) ? s.slice(pattern.length,-pattern.length) : pattern+s+pattern;
				document.execCommand('insertText', null, s2);
				const r2 = getRange();
				r2.setStart(r2.startContainer, r2.startOffset-s2.length);
				setRange(r2);
				// todo extends to |**..**| or **|..|** 
				// todo don't do nested things
				// **..|.|.** -> ..**|.|**.
				// |.**..**..| -> **|.....|**
			}
		};
		
	}

	render() { 
		const stateText = this.state.text, propsText = this.props.text;
		return v('div', {ref:'div',
			contentEditable: stateText!==undefined,
			dangerouslySetInnerHTML:{__html: stateText||markdownToHtml(propsText)}, // final text (props) or text editing mode (state)
			onMouseDown:this.focus,
			onBlur: this.blur
			// onKeyDown: this.shortcuts
		});
	}

};

const markdownToHtml = text => text.replace(/(!)?\[([^\]]+)\]\(([^)]+)\)/g, (_,i,t,u)=>i?`<img src="${u}" title="${t}">`:`<a href="${t}">${t}</a>`);


// v('div', {
// 	dangerouslySetInnerHTML:{__html:todo.text},
// 	onMouseDown:e=>{
// 		e.currentTarget.contentEditable=true;
		
// 		if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
// 			const r = document.caretRangeFromPoint(e.clientX, e.clientY);
// 			setRange(r);
// 		}
// 		// e.currentTarget.
// 	},
// 	onBlur:e=>{
// 		e.currentTarget.contentEditable=false;
// 		if (e.currentTarget.innerHTML!==todo.text)
// 			this.updateTodo(i, {text:e.currentTarget.innerHTML})
// 	}
// }),
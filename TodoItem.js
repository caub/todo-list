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
			if (this.state.text!==undefined || e.target.tagName=='A') return;
			const propsText = this.props.text;
			this.setState({text: propsText});
			// console.log('focus');
			this.refs.div.dispatchEvent(new KeyboardEvent('keyup', e))
			// if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
			const r = document.caretRangeFromPoint(e.clientX, e.clientY);
			setRange(r);
			// }
		};
		// click on links todo
	}

	render() { 
		const stateText = this.state.text, propsText = this.props.text;
		return v('div', {ref:'div',
			contentEditable: stateText!==undefined?'plaintext-only':false,
			dangerouslySetInnerHTML:{__html: stateText||markdownToHtml(propsText)}, // final text (props) or text editing mode (state)
			onMouseDown:this.focus,
			onBlur: this.blur
		});
	}

};

const markdownToHtml = text => text
	.replace(/`(.+)`/g, '<code>$1</code>')
	.replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>')
	.replace(/\*(.+)\*/g, '<em>$1</em>')
	.replace(/\[(.+)\]\((.+)\)/g, '<a href="$2">$1</a>');


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
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
		this.state = {edit: false};

		this.blur = (e, text, i) => {
			this.setState({edit: false});
			if (text!==e.currentTarget.innerHTML)
				props.update(e.currentTarget.innerHTML);
				// props.updateTodo(i, {text: e.currentTarget.innerHTML});
		};
		this.mouseDown = e=>{
			this.setState({edit: true});
			if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
				const r = document.caretRangeFromPoint(e.clientX, e.clientY);
				setRange(r);
			}
		};
	}

	render() {
		const {text, i} = this.props;
		return v('div', {
			contentEditable: this.state.edit,
			dangerouslySetInnerHTML:{__html: text},
			onMouseDown:this.mouseDown,
			onBlur: e=>this.blur(e, text, i)
		});
	}

};

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
import { createElement as v, PureComponent } from 'react';
import injectSheet from 'react-jss';

const styles = {
	todo: {
		minWidth: '2em',
		padding: '.75rem 1rem',
		flex: 1,
		cursor: 'text',
		whiteSpace: 'pre-wrap',
		'& img': {
			maxHeight: 70,
			verticalAlign: 'middle'
		}
	}
};

const sel = getSelection();

function setRange(r) {
	sel.removeAllRanges();
	sel.addRange(r);
}
const getRange = () => sel.rangeCount ? sel.getRangeAt(0) : new Range();

class TodoItem extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { text: undefined };

		this.blur = e => {
			// const stateText = this.state.text
			this.setState({ text: undefined });
			if (this.props.text !== e.currentTarget.innerHTML)
				this.props.update(e.currentTarget.innerHTML);
		};
		this.focus = e => {
			if (this.state.text !== undefined || e.target.matches('a, a *')) return;
			const propsText = this.props.text, evt = new KeyboardEvent('keyup', e);
			this.setState({ text: propsText }, () => this.div.dispatchEvent(evt));
			// console.log('focus');
			// if (!e.currentTarget.contains(getRange().commonAncestorContainer)){
			const r = document.caretRangeFromPoint(e.clientX, e.clientY);
			setRange(r);
			// }
		};
		this.shortcuts = e => {
			if (e.ctrlKey && (e.key === 'b' || e.key === 'i')) {
				const r = getRange();
				if (r.isCollapsed) return;
				const s = r + '', pattern = '*'.repeat(e.key === 'b' ? 2 : 1);
				const s2 = s.startsWith(pattern) && s.endsWith(pattern) ? s.slice(pattern.length, -pattern.length) : pattern + s + pattern;
				document.execCommand('insertText', null, s2);
				const r2 = getRange();
				r2.setStart(r2.startContainer, r2.startOffset - s2.length);
				setRange(r2);
				// todo extends to |**..**| or **|..|** 
				// todo don't do nested things
				// **..|.|.** -> ..**|.|**.
				// |.**..**..| -> **|.....|**
			}
		};

	}

	render() {
		const { classes, text: propsText } = this.props;
		const stateText = this.state.text;
		return v('div', {
			ref: el => { this.div = el; },
			className: classes.todo,
			onDrop: this.props.onDrop,
			dangerouslySetInnerHTML: { __html: stateText || markdownToHtml(propsText) }, // final text (props) or text editing mode (state)
			onMouseDown: this.focus,
			onBlur: this.blur,
			// onKeyDown: this.shortcuts,
			...!this.props.checked && stateText !== undefined && { contentEditable: '' }
		});
	}
};

export default injectSheet(styles)(TodoItem);

const markdownToHtml = text => text.replace(/(!)?\[([^\]]+)\]\(([^)]+)\)/g, (_, i, t, u) => i ? `<img src="${u}" title="${t}" onload="event.target.dispatchEvent(new KeyboardEvent('keyup', event))">` : `<a href="${u}">${t}</a>`);

import { createElement as v } from 'react';
import injectSheet from 'react-jss';
import { timeago } from './utils';

const styles = {
	check: {
		'-webkit-appearance': 'none',
		'-moz-appearance': 'none',
		outline: 'none',
		cursor: 'pointer',
		lineHeight: 0,
		margin: [0, 8],
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 30,
		height: 30,
		transition: 'all .15s ease-in-out',
		overflow: 'hidden',
		'&::before': {
			content: 'attr(data-time)',
			transition: 'all .15s ease-in-out',
			padding: '.5rem 1rem'
		},
		'&:hover': {
			opacity: .6
		},
		'&:checked': {
			backgroundImage: 'none!important',
		},
		'&:checked::before': {
			content: `"✓"`,
			color: '#16c60c',
			fontSize: '1.5em'
		},
		'&:checked + div': {
			textDecoration: 'line-through',
			opacity: .25
		}
	}
}

const rgb1 = [120, 175, 255],
	rgb2 = [255, 255, 0],
	rgb3 = [255, 40, 0];


function TodoTime({ classes, date, checked, onChange, onDragStart, onDrop }) {
	const time = (Date.now() - date.getTime()) / 60000,
		k = 2 / (1 + 1440 / time) - 1;
	const rgb = k < 0 ? rgb1.map((x, i) => Math.round(-x * k + rgb2[i] * (1 + k))) : rgb3.map((x, i) => Math.round(x * k + rgb2[i] * (1 - k)));

	return v('input', {
		className: classes.check,
		draggable: true,
		onDragStart,
		onDrop,
		type: 'checkbox',
		title: timeago(time),
		style: { backgroundImage: `radial-gradient(ellipse closest-side, rgba(${rgb},.8) 50%, transparent)` },
		onChange,
		checked
	});
}

export default injectSheet(styles)(TodoTime);
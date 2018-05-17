import { createElement as v, Fragment } from 'react';
import injectSheet from 'react-jss';
import { timeago } from './utils';

const styles = {
	check: {
		'-webkit-appearance': 'none',
		'-moz-appearance': 'none',
		outline: 'none',
		display: 'none',
		'&:checked + $handle': {
			backgroundImage: 'none!important',
		},
		'&:checked + $handle::before': {
			content: `"✓"`,
			color: '#16c60c',
			fontSize: '1.5em'
		},
		'&:checked ~ div': {
			textDecoration: 'line-through',
			opacity: .25
		}
	},
	handle: {
		width: 30,
		height: 30,
		cursor: 'pointer',
		margin: [0, 8],
		transition: 'all .15s ease-in-out',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'&::before': {
			content: 'attr(data-time)',
			transition: 'all .15s ease-in-out',
			padding: '.5rem 1rem'
		},
		'&:hover': {
			opacity: .6
		}
	}
}

const rgb1 = [120, 175, 255],
	rgb2 = [255, 255, 0],
	rgb3 = [255, 40, 0];


function TodoTime({ classes, date, checked, onChange, ...props }) {
	const time = (Date.now() - date.getTime()) / 60000,
		k = 2 / (1 + 1440 / time) - 1;
	const rgb = k < 0 ? rgb1.map((x, i) => Math.round(-x * k + rgb2[i] * (1 + k))) : rgb3.map((x, i) => Math.round(x * k + rgb2[i] * (1 - k)));

	return v(Fragment, null,
		v('input', {
			className: classes.check,
			type: 'checkbox',
			checked,
			onChange
		}),
		v('span', {
			draggable: true,
			className: classes.handle,
			title: timeago(time),
			style: { backgroundImage: `radial-gradient(ellipse closest-side, rgba(${rgb},.8) 50%, transparent)` },
			onClick: e => e.currentTarget.previousElementSibling.click(), // bit lazy, should rather call onChange here :p
			...props
		})
	);
}

export default injectSheet(styles)(TodoTime);
import React from 'react';
import {timeago} from '../utils';

const v = React.createElement;
const rgb1 = [120,175,255],
			rgb2 = [255,255,0],
			rgb3 = [255,40,0];


const TodoTime = ({date, checked, onChange, onDragStart, onDrop}) => {
	const time = (Date.now()-date.getTime())/60000,
		k = 2/(1+1440/time)-1;
	const rgb = k<0 ? rgb1.map((x,i) => Math.round(-x*k+rgb2[i]*(1+k))) : rgb3.map((x,i) => Math.round(x*k+rgb2[i]*(1-k)));

	return v('input', {
		draggable:true,
		onDragStart,
		onDrop,
		type:'checkbox',
		title: timeago(time),
		style: {backgroundImage:`radial-gradient(ellipse closest-side, rgba(${rgb},.8) 50%, transparent)`},
		onChange,
		checked
	});
};

export default TodoTime;
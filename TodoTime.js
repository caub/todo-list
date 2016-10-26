const [React, {timeago}] = require('react', './utils');
const v = React.createElement;
const {round} = Math;
const rgb1 = [120,175,255],
			rgb2 = [255,255,0],
			rgb3 = [255,40,0];


module.exports = class extends React.PureComponent {

	render() { 
		const {date, checked, onChange} = this.props,
			time = (Date.now()-date.getTime())/60000,
			k = 2/(1+1440/time)-1;
		const rgb = k<0 ? rgb1.map((x,i)=>round(-x*k+rgb2[i]*(1+k))) : rgb3.map((x,i)=>round(x*k+rgb2[i]*(1-k)));
		return v('input', {
			type:'checkbox',
			title: timeago(time),
			style: {backgroundImage:`radial-gradient(ellipse closest-side, rgba(${rgb},.8) 50%, transparent)`},
			onChange,
			checked
		});
	}

};


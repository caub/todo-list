const libs = new Set(JSON.parse(new URLSearchParams(location.search).get('l')));

const srcUrl = location.origin + location.pathname.slice(0, location.pathname.lastIndexOf('/')) + '/src/';

self.addEventListener('fetch', function(event) {

	if (event.request.url.startsWith(srcUrl)) {
		// console.log(1, event.request.url);

		event.respondWith(
			fetch(event.request).then(r => r.text())
			.then(text => { // get all import lines so we search the first line not starting with import 
				const m = text.match(/^(?!import|$)/m) || {index:0};
				const lines = text.slice(0, m.index).split('\n')
				.filter(l => l.startsWith('import'))
				.map(l => {
					const m2 = l.match(/'([\w.\/-]+)';?$/), name = m2[1];
					if (name[0] === '.') {
						return `${l.slice(0, m2.index)}'${name + (/\.js*$/.test(name) ? '' : '.js')}';`;
					}
					if (libs.has(name)) {
						if (l.includes('{')) {
							const m3 = l.match(/(\{[\w\s,]+\})\s+from\s+'([\w-]+)';?$/);
							return `const ${m3[1]} = ${m3[2].split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('')};`
						}
						return ''; //`${l.slice(0, m2.index)}'${libs.get(name)}';`; // the dist versions are not easily importable, so using <script> rather for now in index.html, todo try the normal entry point of react.. if it's not slow
					}
					return l;
				});
				const newText = lines.join('\n') + '\n' + text.slice(m.index);
				return new Response(newText, {headers: {'Content-Type': 'application/javascript'}});
			})
		);
	}

	else {
		// console.log(2, event.request.url);

		event.respondWith(
			fetch(event.request)
		);
	}
	
});
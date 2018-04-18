const libs = new Map(JSON.parse(new URLSearchParams(location.search).get('l')));

const srcUrl = location.origin + location.pathname.slice(0, location.pathname.lastIndexOf('/')) + '/src/';


// const CACHE_NAME = 'caub-todolist';
// const CACHE_VERSION = '1.0';

// self.addEventListener('install', event => {
// self.skipWaiting();
// event.waitUntil<d<d(
// 	caches
// 		.open(CACHE_NAME + '-v' + CACHE_VERSION)
// 		.then(cache => {
// 			return cache.addAll([
// 				new Request('./src/index.js')
// 			]);
// 		})
// );
// });

self.addEventListener('activate', event => {
	event.waitUntil(clients.claim());
});


self.addEventListener('fetch', function (event) {

	if (event.request.url.startsWith(srcUrl)) {
		// console.log(1, event.request.url);

		event.respondWith(
			fetch(event.request).then(r => r.text())
				.then(text => { // get all import lines so we search the first line not starting with import
					const m = text.match(/^(?!import|$)/m) || { index: 0 };
					const lines = text.slice(0, m.index).split('\n')
						.filter(l => l.startsWith('import'))
						.map(l => {
							const m2 = l.match(/'([\w.\/-]+)';?$/), name = m2[1];
							if (name[0] === '.') {
								return `${l.slice(0, m2.index)}'${name + (/\.js*$/.test(name) ? '' : '.js')}';`;
							}
							if (libs.has(name)) {
								const m3 = l.match(/import (\{[\w\s,]+\}|[\w\s,]+)\s+from\s+'([\w-]+)';?$/);
								const libName = libs.get(name) || m3[2].split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
								return m3[1][0] === '{' ?
									`const ${m3[1].replace(/\bas\b/g, ':')} = ${libName};` :
									`const ${m3[1]} = ${libName}.default;`; // well it sucks, need to support import foo, {..}
							}
							return '';
						});
					const newText = lines.join('\n') + '\n' + text.slice(m.index);
					return new Response(newText, { headers: { 'Content-Type': 'application/javascript' } });
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

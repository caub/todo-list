export default {
  entry: 'src/index.js',
  // plugins: [
  //   babel({
  //     runtimeHelpers: true
  //   }),
  //   uglify()
  // ],
  external: ['react', 'react-dom', 'redux', 'react-redux'],
  name: 'todolist',
  dest: 'todo-list.js',
  format: 'iife'
};

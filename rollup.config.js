export default {
  input: 'src/index.js',
  // plugins: [
  //   babel({
  //     runtimeHelpers: true
  //   }),
  //   uglify()
  // ],
  external: ['react', 'react-dom', 'redux', 'react-redux'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-jss': 'reactJss',
    'react-redux': 'ReactRedux',
    redux: 'redux'
  },
  output: {
    name: 'todolist',
    file: 'todo-list.js',
    format: 'iife'
  }
};

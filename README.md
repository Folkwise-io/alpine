# Alpine

Alpine is a library creation framework for rapidly building robust libraries and CLI applications.

### Features

Alpine allows developers to build a library of methods that can also be used as a CLI out-of-the-box. Amongst each method of the library are features such as:

- Run-time type validation
- Custom parameter validation
- Unit testing using Mocha
- and more!

### Installation

```
npm i -g alpine
```

### How to use

To create a new project, run the following command...

```
alpine new <project_name_here>
```

This will create a folder in your current directory with the chosen project name. Navigate to the new folder and install the dependencies by running `npm i`.

At this point, you can immediately start adding methods to the methods folder manually or by using `alpine generate method`. Each method definition file must export an object which defines the method similar to:

```javascript
export default {
  name: 'sum', // Name of the method
  parameters: [
    {
      name: 'x',
      type: 'number', // Type validation
      validate: value => value >= 0 && value <= 100 // Custom validation
    },
    {
      name: 'y',
      type: 'number', // Type validation,
      validate: value => value >= 0 && value <= 100 // Custom validation
    }
  ],
  returns: {
    type: 'number',
    validate: value => value >= 0 && value <= 200
  },
  value: (x, y) => x + y // Method definition
};
```

It's important to note that to define a method, a file must be created with the method's name under `/methods`. Each method, by default, is CLI enabled meaning you can access it through the CLI of your application. This can be disabled by setting `cli: false` on the exported object of the method.

If you're curious about other commands that Alpine offers, just run `alpine --help` for a detailed list!

### Project structure

By default, your project will be structured like the following:

```
Project
├── methods				# Method definitions
|	└── sum.method.js
├── test				# Unit tests
|   └── sum.test.js
├── index.js			# Main hook
├── cli.js				# CLI hook
└── alpine.conf.js		# Alpine configuration
```

For each method file, there should be one or less unit testing file. The location of where you store methods and tests can be changed by editing your `alpine.conf.js`.

### Testing

```
npm test
```

This will build your application and test the resulting bundle with your written unit tests found in `/tests`.

### Building

```
npm run build
```

This will build your application using Rollup.js. The result will be three bundles located in `/dist`. The formats of these three bundles are:

- CommonJS
- ES Module
- UMD (Universal Module Definition)

This allows your library to be used in almost every environment.

### License

[License]

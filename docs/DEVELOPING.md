# Development

## Project setup
```
npm install
```

### Compiles and minifies for distribution
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Run your e2e tests

Because this project is a Vue component library, it doesn't export an App.
To test with e2e tests there is a TestApp. However we have to run it first before
running the e2e tests.

```
npm run test:serve
npm run test:e2e
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

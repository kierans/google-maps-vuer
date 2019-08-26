# google-maps-vuer

A [Vue](https://vuejs.org/) component to use [Google Maps](https://developers.google.com/maps/)

## Why this module?

This module is inspired by [vue-google-maps](https://github.com/GuillaumeLeclerc/vue-google-maps) and [vue2-google-maps](https://github.com/xkjyeah/vue-google-maps). However I wanted to write this because:

1. Completeness. I wanted a Vue component that was feature complete with the Google Maps API. My use case weren't covered by the existing modules.

2. Tested. I TDD'd this component.

3. As an exercise to write a Vue component that is a wrapper around another library.

## Usage

TODO

## Development

### Project setup
```
npm install
```

#### Compiles and minifies for distribution
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Run your unit tests
```
npm run test:unit
```

#### Run your e2e tests

Because this project is a Vue component library, it doesn't export an App.
To test with e2e tests there is a TestApp. However we have to run it first before
running the e2e tests.

```
npm run test:serve
npm run test:e2e
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

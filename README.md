# google-maps-vuer

A [Vue](https://vuejs.org/) component to use [Google Maps](https://developers.google.com/maps/)

## Why this module?

This module is inspired by [vue-google-maps](https://github.com/GuillaumeLeclerc/vue-google-maps) and [vue2-google-maps](https://github.com/xkjyeah/vue-google-maps). However I wanted to write this because:

1. Completeness. I wanted a Vue component that was feature complete with the Google Maps API. My use case weren't covered by the existing modules.

2. Tested. I TDD'd this component.

3. Versioned. This library knows what versions of Google Maps it will work with

3. As an exercise to write a Vue component that is a wrapper around another library.

## Usage

```bash
$ npm install google-maps-vuer
```

```js
// TODO Add imports
// TODO Component registration and async components
 
Vue.use(GoogleMapVuer, {
  apiKey: API_KEY
});

// Create your Vue app however you want to.
new Vue({
  render: (h) => h(App),
}).$mount("#app");
```
## Example
```vue
// TODO
```

For other examples please see the [example docs]()

## How does it work?

1. Every Map property that has a "setter" has a corresponding Vue prop that is bound to the setter. For example `google.maps.Map::setCenter` is called when the `center` prop is changed. `options` are special properties in that they are also passed to Maps API class constructors (if supported) as well as bound to the setter.

2. Every event that is emitted by the Google Maps API is available on the component. For example, `center_changed` is available on the `GoogleMap` component. The event that is emitted from the component for a Maps property will have the value from the corresponding "getter". For example, when `center_changed` is fired from the `GoogleMap` component, it will have the value of `getCenter()` in the event.

    For events on a Google Maps class that have values, all arguments will be available in the component event. For example `google.maps.Map@click` has an `event` which will be available to `GoogleMap@click` listeners.

3. Every non getter/setter method that is on a Google Maps class is exposed on the component.

### Differences with other libraries

GoogleMapsVuer only supports [one way data binding](https://vuejs.org/v2/guide/components-props.html#One-Way-Data-Flow). Vue 2 got rid of two way data binding for good reasons as it's very easy to get into a mess.

The best summary of the interaction between [parent and child components](https://stackoverflow.com/a/40915910/586182) is:

> In Vue.js, the parent-child component relationship can be summarized as props down, events up. The parent passes data down to the child via props, and the child sends messages to the parent via events.

GoogleMapsVuer will not change props in a child component, you must listen for events in the parent. Each component does have "loop protection" to stop changing a property on the Maps API, which emits an event, which changes the property etc. Consequently parent components can implement `v-model` like behaviour where on an event a `data` member (which may be bound to a child component as a prop) can be updated without causing an infinite reactive loop. 

## Developing

See the [developer docs]()

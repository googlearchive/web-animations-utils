# Web Animations Utilities

This repository contains utility libraries for Web Animations, which is a new JavaScript API for driving animated content on the web.

For more information, see the [specification](https://w3c.github.io/web-animations/), [browser support](http://caniuse.com/#feat=web-animation), and [polyfill][polyfill].

## Usage



### Timeline

The timeline library is supported natively on Chrome 39+, and requires the [web-animations](https://github.com/web-animations/web-animations-js#web-animationsminjs) polyfill on other, modern browsers.

It is a manager of many `Animation` player instances.
It is useful for scheduling and scrubbing a collection of animations and related callbacks.

```js
var timeline = new FauxTimeline();

var element = ...;
var steps = [{transform: 'translate(0)'}, {transform: 'translate(1000px)'}];

timeline.schedule(250, element, steps, 1500);
timeline.call(250 + 750, function() {
  console.info('half-way there!');
  timeline.playbackRate *= 2;

  // schedule a further animation, after the timeline has started.
  timeline.schedule(1500, otherElement, differentSteps, 1000);
});
```

[polyfill]: https://github.com/web-animations/web-animations-js

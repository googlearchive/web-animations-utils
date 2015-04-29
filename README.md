# Web Animations Utilities

This repository contains utility libraries for Web Animations, which is a new JavaScript API for driving animated content on the web.

For more information, see the [specification](https://w3c.github.io/web-animations/), [browser support](http://caniuse.com/#feat=web-animation), and [polyfill][polyfill].

## Usage

### Timeline

The [timeline library](timeline.js) is a manager of many `Animation` player instances, and is useful for scheduling and scrubbing a collection of animations and related callbacks.

It is supported natively on Chrome 39+, and requires the [web-animations](https://github.com/web-animations/web-animations-js#web-animationsminjs) polyfill on other, modern browsers.

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

### Externs

Externs can be used inside the [Closure Compiler](https://developers.google.com/closure/compiler) to hint at functions provided outside a project's code base, such as third-party libraries or for upcoming APIs such as Web Animations.
For more information, see [Advanced Compilation and Externs](https://developers.google.com/closure/compiler/docs/api-tutorial3).

The utility library provides an externs file that may be used in Closure.

```bash
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS \
  --js yourcode.js --externs web-animaitons-utils/externs.js
```

[polyfill]: https://github.com/web-animations/web-animations-js

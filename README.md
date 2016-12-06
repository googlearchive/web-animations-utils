# Web Animations Utilities

This repository contains utility libraries for Web Animations, which is a new JavaScript API for driving animated content on the web.

For more information, see the [specification](https://w3c.github.io/web-animations/), [browser support](http://caniuse.com/#feat=web-animation), and [polyfill][polyfill].

## Usage

### Timeline

The [timeline library](timeline.js) provides a manager of many `Animation` player instances, and is useful for scheduling and scrubbing a collection of animations and related callbacks.

It is supported natively on Chrome 39+, and requires the [web-animations][js] polyfill on other, modern browsers.

```js
var timeline = new AnimationUtilTimeline();

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

### Props

The [props library](props.js) provides a helper to apply the final state of the passed animation as inline CSS properties.

It is supported natively on Chrome 39+, and requires the [web-animations][js] polyfill on other, modern browsers.

```js
var element = ...;
var steps = [{transform: 'translate(0)'}, {transform: 'translate(1000px)'}];
var anim = element.animate(steps, 1000);
AnimationUtilApply(steps, element);
````

It also supports the advanced polyfill features in [web-animations-next][js-next], such as `KeyframeEffect`, `GroupEffect` and `SequenceEffect`.

```js
var effect = new KeyframeEffect(target, steps);
var group = new GroupEffect([effect, ...]);
var anim = document.timeline.play(group);
AnimationUtilApply(group);
````

### Externs

This repository used to contain the Closure Compiler externs for the Web Animations API.
They have now moved into the [official polyfill repo](https://github.com/web-animations/web-animations-js/tree/dev/externs).


[polyfill]: https://github.com/web-animations/web-animations-js
[js]: https://github.com/web-animations/web-animations-js#web-animationsminjs
[js-next]: https://github.com/web-animations/web-animations-js#web-animations-nextminjs

/*
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


/**
 * Translates the given argument into a function that applies its final state
 * as inline CSS properties. This can apply to a single target (if specified,
 * or as part of a KeyframeEffect) or many (if a sequence is specified).
 *
 * @param {!Array<*>|!AnimationEffectReadOnly} anim to parse, not cloned
 * @param {!Element=} opt_target required if not inferred from anim
 * @return {!Function} that applies the final state
 */
function AnimationUtilApply(anim, opt_target) {
  if (anim.children && anim.children.length !== undefined) {
    var all = anim.children.map(function(x) {
      return AnimationUtilApply(x, opt_target);
    });
    return function() {
      all.map(function(x) {
        x();
      });
    }
  }

  var target = opt_target || null;

  // Check for MotionEffect, which has a target.
  if (anim.target !== undefined) {
    if (target && anim.target != target) {
      // Can't apply to this target, it's not within the filter.
      return AnimationUtilApply.noop;
    }
    target = anim.target;
    anim = anim.getFrames();
  }

  var n = 'AnimationUtilApply';
  if (anim instanceof Function) {
    throw new Error(n + ' does not support EffectCallback syntax');
  }
  if (anim.length === undefined) {
    throw new Error(n + ' expected Array or effect');
  }
  if (!target) {
    throw new Error(n + ' can\'t resolve target');
  }
  if (!anim.length) {
    return AnimationUtilApply.noop;  // unusual, but valid - no keyframes
  }

  var last = anim[anim.length - 1];
  return function() {
    var s = target.style;
    for (var x in last) {
      s[x] = last[x];
    }
  }
}

/**
 * Used directly as a finish handler on an Animation (aka, the this object),
 * and will apply the underlying effect's final keyframes as inline CSS.
 *
 * @this {!Animation}
 */
function AnimationUtilApplyHandler() {
  if (this.effect === undefined) {
    throw new Error('AnimationUtilApplyHandler can\'t apply, no effect');
  }
  if (this.effect) {
    console.info('applying handler to', this, this.effect);
    var fn = AnimationUtilApply(this.effect);
    fn();
  }
}

/**
 * Helper function that is intentionally empty.
 */
AnimationUtilApply.noop = function() {}

window["AnimationUtilApply"] = AnimationUtilApply;
window["AnimationUtilApplyHandler"] = AnimationUtilApplyHandler;

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
 * Applies the final state of the passed animation as inline CSS properties.
 * This can apply to a single target (if specified, or as part of a
 * KeyframeEffect) or many (if a sequence is specified).
 *
 * Due to the limitations of some browsers, the final state will be applied
 * using rAF (it won't be immediately visible when this function returns).
 *
 * @param {!Array<*>|!AnimationEffectReadOnly|!Animation} anim to parse
 * @param {!Element=} opt_target required if not inferred from anim
 */
function AnimationUtilApply(anim, opt_target) {
  var me = AnimationUtilApply; // nb: arguments.callee not allowed in strict
  if (!anim) {
    throw new Error(me.name + ' requires non-null anim');
  }

  // Search for an Animation instance.
  if ('currentTime' in anim && 'effect' in anim) {
    var player = /** @type {!Animation} */ (anim);
    anim = player.effect;
  }

  // Search for a GroupEffect or SequenceEffect.
  if ('children' in anim && anim.children.length !== undefined) {
    anim.children.forEach(function(each) {
      me(each, opt_target);
    });
    return;
  }

  var target = opt_target || null;

  // Check for KeyframeEffect, which has a target.
  var ke = /** @type {!KeyframeEffect} */ (anim);
  if (ke.target !== undefined) {
    if (target && ke.target != target) {
      return;  // can't apply to this target, not selected
    }
    target = ke.target;
    anim = ke.getFrames();
  }

  if (!target) {
    throw new Error(me.name + ' can\'t resolve target');
  } else if (!anim || !anim.length) {
    throw new Error(me.name + ' has no keyframes');
  }

  var last = anim[anim.length - 1];

  // NOTE: This works around bad implementations of requestAnimationFrame in
  // many browsers. The spec says that rAF must be called before any layout
  // or style recalc is done; however, as of Oct 2015, Safari, Firefox (among
  // others) will sometimes layout before this.
   window.requestAnimationFrame(function() {
    var s = target.style;
    for (var x in last) {
      s[x] = last[x];
    }
    var t = last['transform'];
    if (t !== undefined) {
      s['webkitTransform'] = t;
    }
  });
}

window["AnimationUtilApply"] = AnimationUtilApply;

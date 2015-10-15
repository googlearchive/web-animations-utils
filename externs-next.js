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
 * @fileoverview Basic externs for the Web Animations API (Level 2 / Groups).
 * This is not intended to be exhaustive, and requires externs.js.
 * @externs
 */


/**
 * @interface
 */
var AnimationEffectReadOnly = function() {};

/** @type {!AnimationEffectTiming} */
AnimationEffectReadOnly.prototype.timing;

/**
 * @param {Element} target
 * @param {!Array<!Object>} frames
 * @param {number|!Object} options
 * @interface
 * @extends {AnimationEffectReadOnly}
 */
var KeyframeEffect = function(target, frames, options) {};

/**
 * @return {!Array<!Object>}
 */
KeyframeEffect.prototype.getFrames = function() {};

/** @type {Element} */
KeyframeEffect.prototype.target;

/** @type {?function(number, !KeyframeEffect, !Animation)} */
KeyframeEffect.prototype.onsample;

/**
 * @param {!Array<!AnimationEffectReadOnly>} children
 * @interface
 * @extends {AnimationEffectReadOnly}
 */
var SequenceEffect = function(children) {};

/** @type {!Array<!AnimationEffectReadOnly>} */
SequenceEffect.prototype.children;

/**
 * @param {!Array<!AnimationEffectReadOnly>} children
 * @interface
 * @extends {AnimationEffectReadOnly}
 */
var GroupEffect = function(children) {};

/** @type {!Array<!AnimationEffectReadOnly>} */
GroupEffect.prototype.children;


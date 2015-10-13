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
 * @fileoverview Basic externs for the Web Animations API. This is not
 * intended to be exhaustive.
 * @externs
 */


/**
 * @constructor
 * @implements {EventTarget}
 */
var Animation = function() {};

// Stub out EventTarget so that Closure is confident Animation implements it.
Animation.prototype = {
	addEventListener: function() {},
	removeEventListener: function() {},
	dispatchEvent: function() {},
};

/**
 * @return {undefined}
 */
Animation.prototype.cancel = function() {};

/** @type {AnimationEffectReadOnly|undefined} */
Animation.prototype.effect;

/** @type {number} */
Animation.prototype.currentTime;

/** @type {string} */
Animation.prototype.playState;

/**
 * @param {!Array<!Object>} steps
 * @param {number|!Object} timing
 * @return {!Animation}
 */
Element.prototype.animate = function(steps, timing) {};

/**
 * @constructor
 */
var AnimationEffectReadOnly = function() {};

/**
 * @constructor
 * @extends {AnimationEffectReadOnly}
 */
var KeyframeEffectReadOnly = function() {};

/**
 * @return {!Array<!Object>}
 */
KeyframeEffectReadOnly.prototype.getFrames = function() {};

/** @type {Element} */
KeyframeEffectReadOnly.prototype.target;
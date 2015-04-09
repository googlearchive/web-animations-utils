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
 * FauxTimeline is a manager of many Animation player instances. It is useful
 * for scheduling and scrubbing a collection of players and related callbacks.
 *
 * The timeline emulates the Animation interface, but is not intended to
 * completely implement it. It supports the playbackRate and currentTime
 * properties.
 *
 * This object expects the Web Animations API to be available either natively
 * or via polyfill (https://github.com/web-animations/web-animations-js).
 *
 * @constructor
 */
var FauxTimeline = function() {
  if (!('animate' in Element.prototype)) {
    throw new Error('FauxTimeline expects Web Animations support');
  }

  var timing = {duration: 1000, iterations: Infinity};
  this.hintAtCall_ = this.hintAtCall_.bind(this);

  /**
   * @type {!Element}
   * @private
   */
  this.node_ = document.createElement('div');

  /**
   * @type {!Animation}
   * @private
   */
  this.anim_ = this.node_.animate([], timing);

  /**
   * @type {!Array<{offset: number, anim: !Animation}>}
   * @private
   */
  this.players_ = [];

  /**
   * @type {!Array<{when: number, fn: !Function}>}
   * @private
   */
  this.calls_ = [];

  /**
   * Works around issues in some WA implementations. Changing the playbackRate
   * of an Animation can cause its currentTime to become invalid (null or
   * undefined). In this case, store the currentTime here before the change.
   * @type {number}
   * @private
   */
  this.localTime_ = 0;
};

FauxTimeline.prototype = {

  /**
   * Hints to this FauxTimeline that it should run any pending calls.
   * @private
   */
  hintAtCall_: function() {
    var now = this.currentTime;
    var i;

    for (i = 0; i < this.calls_.length; ++i) {
      var call = this.calls_[i];
      if (call.when > now) {
        break;
      }
      call.fn();
    }

    this.calls_ = this.calls_.slice(i);
  },

  /**
   * @param {number} playbackRate to set
   */
  set playbackRate(playbackRate) {
    this.localTime_ = this.anim_.currentTime;
    this.anim_.playbackRate = playbackRate;
    this.players_.forEach(function(p) { p.anim.playbackRate = playbackRate; });
  },

 /**
  * @return {number}
  */
  get playbackRate() {
    return this.anim_.playbackRate;
  },

  /**
   * @param {number} currentTime to set
   */
  set currentTime(currentTime) {
    var seekForward = currentTime > this.currentTime;

    this.anim_.currentTime = currentTime;
    this.players_.forEach(function(p) {
      p.anim.currentTime = p.offset + currentTime;
    });

    if (seekForward) {
      // For now, we can't trigger calls in the past.
      this.hintAtCall_();
    }
  },

  /**
   * @return {number}
   */
  get currentTime() {
    var time = this.anim_.currentTime;
    if (time === null) {
      console.debug('currentTime was null, returning fake localTime_');
      return this.localTime_;
    }
    return time;
  },

  /**
   * Schedule an animation on this FauxTimeline.
   *
   * @param {number} when to start the animation, may be in the past
   * @param {!Element} el to animate
   * @param {!Array<!Object>} steps of the animation
   * @param {number|!Object} timing to run for
   * @return {!Animation}
   */
  schedule: function(when, el, steps, timing) {
    var now = this.currentTime;
    var player = el.animate(steps, timing);

    player.playbackRate = this.anim_.playbackRate;
    player.currentTime = now - when;

    this.players_.push({anim: player, offset: now - when});
    return player;
  },

  /**
   * Call a function at an absolute time. This must be in the future (even if
   * the playbackRate is negative), and the call will be cleared once it has
   * been invoked.
   *
   * @param {number} when to call, must be past currentTime
   * @param {!Function} fn to invoke
   */
  call: function(when, fn) {
    var now = this.currentTime;
    if (when < now) {
      throw new Error('FauxTimeline doesn\'t support calls in past: ' + (now - when));
    }

    // Insert into the calls list, maintaining sort order.
    // TODO: binary search would be faster.
    var i;
    for (i = 0; i < this.calls_.length; ++i) {
      var call = this.calls_[i];
      if (call.when > when) {
        break;
      }
    }
    this.calls_.splice(i, 0, {when: when, fn: fn});

    var player = this.schedule(when, this.node_, [], 0);
    player.addEventListener('finish', this.hintAtCall_);
  },

  /**
   * Removes a previously registered animation via its AnimationPlayer.
   *
   * @param {!Animation=} opt_player to remove, undefined for all
   */
  remove: function(opt_player) {
    if (opt_player === undefined) {
      this.players_.forEach(function(p) { p.anim.cancel(); });
      this.players_ = [];
      this.calls_ = [];
      return;
    }

    if (!('cancel' in opt_player)) {
      throw new Error('FauxTimeline remove expects Animation, was: ' + opt_player);
    }
    opt_player.cancel();

    var i;
    for (i = 0; i < this.players_.length; ++i) {
      var player = this.players_[i];
      if (player.anim == opt_player) {
        break;
      }
    }
    this.players_.splice(index, 1);
  }

};

window["FauxTimeline"] = FauxTimeline;

/**
 * player
 *
 * @author Tiberiu Georgescu <tibi@qbyco.com>
 * @version 0.1.0
 */
window['Player'] = (function () {
    'use strict';

    /**
     * Player Main object
     */
    var Player = {},
        AI = {};

    /**
     * Create player
     */
    Player.Instance = function (name) {
        this.name = name;
        this.isAI = false;
    };

    Player.Instance.prototype.setAsAI = function () {
        this.isAI = true;
    };

    return Player
}());
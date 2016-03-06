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
        AI = {
            _level: 'dummy', // dummy, normal, master
            events: {},
            strategy: {},
            thinking: false
        };

    /**
     * Create player
     */
    Player.Instance = function (name) {
        this.name = name;
        this.nickname = name;
        this.isAI = false;
    };

    Player.Instance.prototype.setAsAI = function (level) {
        this.isAI = true;
        this.nickname += '(AI:Level '+ level +')';
        AI.setLevel(level);
    };

    /**
     * AI Logic
     */
    AI.install = function () {
        Events.register('ai.move', AI.events.move);
        Events.register('ai.reset', AI.events.reset);
    };

    /**
     * How many will AI draw
     * @param {Number} itemsLeft
     */
    AI.events.move = function (itemsLeft) {
        Events.trigger('setbusy.game', true);
        AI.strategy[AI._level].call(AI.strategy[AI._level], itemsLeft);
    };

    /**
     * Reset ai
     */
    AI.events.reset = function () {
        if(false !== AI.thinking) {
            clearTimeout(AI.thinking);
        }
    };

    /**
     * Set AI level
     * @param level
     */
    AI.setLevel = function (level) {
        console.debug('[Player][AI][Set Level]::', level);
        AI._level = level;
    };

    /**
     * Fake thinking to give more of a human touch
     * @param {Object} aiMove
     */
    AI.thinkMove = function(aiMove) {
        AI.thinking = setTimeout(function() {

            Events.trigger('setbusy.game', false);
            Events.trigger('game.takeItem', aiMove.draw);

            AI.thinking = false;
        }, (aiMove.think * 100));
    };

    /**
     * AI random
     */
    AI.random = function (min, max) {
        return random(min, max);
    };


    /**
     * ----------------------------------
     * AI Strategies
     * ----------------------------------
     */

    /**
     * dummy level - Will draw a random number between 1-3 sticks
     * @param {Number} itemsLeft
     */
    AI.strategy.dummy = function (itemsLeft) {
        var draw = AI.random(1,3),
            think = AI.random(10, 50);

        AI.thinkMove({
            draw: draw,
            think: think
        });
    };

    /**
     * normal level - Will act as regular player
     * @param {Number} itemsLeft
     */
    AI.strategy.normal = function (itemsLeft) {
        var luck = AI.random(1,100), //Go 50/50
            draw,
            think;

        draw = AI.random(1,3);
        think = AI.random(7, 30);

        if(50 < luck) {

            if(7 === itemsLeft) {
                draw = 2
            }

            if(6 === itemsLeft) {
                draw = 1
            }

            if(4 >= itemsLeft) {
                draw = (itemsLeft - 1);
            }
        } else {
            if(6 >= itemsLeft && 3 < itemsLeft) {
                draw = AI.random(1, 2);
            }

            if(3 >= itemsLeft && 1 < itemsLeft) {
                draw = AI.random(2,3);
            }

            if (6 < itemsLeft) {
                draw = AI.random(1,3);
            }
        }


        AI.thinkMove({
            draw: draw,
            think: think
        });
    };

    /**
     * Supernatural frustration
     * @param {Number} itemsLeft
     */
    AI.strategy.master = function (itemsLeft) {
        var luck = AI.random(1,100), //If above 25 will crush you
            draw,
            think;

        draw = AI.random(1,3);
        think = AI.random(5, 12);

        if(25 < luck) {
            if(7 == itemsLeft) {
                draw = 2;
            }

            if(6 === itemsLeft) {
                draw = 1;
            }

            if(4 >= itemsLeft) {
                draw = (itemsLeft - 1);
            }
        }

        AI.thinkMove({
            draw: draw,
            think: think
        });
    };

    AI.install();

    return Player
}());
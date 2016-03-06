/**
 * game
 *
 * @author Tiberiu Georgescu <tibi@qbyco.com>
 * @version 0.1.0
 */
window['Game'] = (function () {
    'use strict';

    var Game = {
            _dom: null,
            events: {},
            running: false,
            players: {
                p1: {},
                p2: {},
                next: 'p1'
            }
        },
        SinglePlayer = {},
        MultiPlayer = {},
        Board = {
            items: 20,
            itemsLeft: 20,
            _itemDom: '<div class="item" data-name="game.item" data-type="item"></div>'
        };

    /**
     * Install game component
     */
    Game.install = function () {
        Events.register('start.game', Game.events.start);
        Events.register('reset.game', Game.events.reset);
        Events.register('draw.board', Game.events.drawBoard);
        Events.register('set.players', Game.events.setPlayers);

        Events.register('game.takeItem', Game.events.takeItem);

        Game._dom = $('[data-name="board"][data-type="page"]');
    };

    /**
     * @event
     * @param {String} type
     */
    Game.events.start = function (type) {
        console.debug('start game::', type, Game.running);
        /**
         * Avoid spamming
         */
        if(true === Game.running) {
            return false;
        }

        if('single' === type) {
            SinglePlayer.init();
        }

        if('multi' === type) {
            MultiPlayer.init();
        }
    };

    /**
     * @event
     * Stop and reset game module
     */
    Game.events.reset = function () {
        Game.running = false;
    };

    /**
     * @event
     * drawBoard Draw game board
     */
    Game.events.drawBoard = function () {
        var i_item,
            output = $(),
            itemTpl,
            tmpItemTpl;

        itemTpl = $(Board._itemDom);

        for(i_item = 0; i_item < Board.items; i_item += 1) {
            tmpItemTpl = itemTpl.clone();
            tmpItemTpl.attr('data-value', parseInt(Board.items - i_item));

            tmpItemTpl.addClass('item active');
            output = output.add(tmpItemTpl);
        }

        Game._dom.find('.game_board .content').html(output);

        Events.trigger('app.activeScreen', 'board.page');
    };

    /**
     * @event
     * Set players
     * @param {Object} playersObject
     */
    Game.events.setPlayers = function (playersObject) {

        Game.players.p1 = playersObject.p1;
        Game.players.p2 = playersObject.p2;
    };

    /**
     * Game item take
     */
    Game.events.takeItem = function (count) {
        var nextPlayer;

        /**
         * Decide next player
         */
        nextPlayer = ('p1' === Game.players.next ? 'p2' : 'p1');

        /**
         * Set move
         */
        console.debug('Player', Game.players.next, 'Draw:', count);

        /**
         * Count items left
         */

        Game.players.next = nextPlayer;
    };

    /**
     * -------------------
     * Single player game
     * -------------------
     */
    SinglePlayer.init = function () {

        var player_1,
            player_2;

        player_1 = new Player.Instance('p1');
        player_2 = new Player.Instance('p2');
        player_2.setAsAI();

        Events.trigger('set.players', {
            p1: player_1,
            p2: player_2
        });

        /**
         * Draw bord and start the game
         */
        Events.trigger('draw.board');
        Game.running = true;
    };


    /**
     * -------------------
     * Multi player player game
     * -------------------
     */
    MultiPlayer.init = function () {
        var player_1,
            player_2;

        player_1 = new Player.Instance('p1');
        player_2 = new Player.Instance('p2');

        Events.trigger('set.players', {
            p1: player_1,
            p2: player_2
        });

        /**
         * Draw bord and start the game
         */
        Events.trigger('draw.board');
        Game.running = true;
    };

    /**
     * Install
     */
    Game.install();
}());
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
            isBusy: false,
            running: false,
            players: {
                p1: {},
                p2: {},
                next: 'p1'
            },
            monitor: {
                output: ''
            },
            type: false
        },
        SinglePlayer = {},
        MultiPlayer = {},
        Board = {
            _itemDom: '<div class="item" data-name="game.item" data-type="item"></div>',
            defaults: {
                items: 20,
                itemsLeft: 20
            }
        },
        AILevel = 'master'; // dummy/normal/master

    /**
     * Install game component
     */
    Game.install = function () {
        Events.register('start.game', Game.events.start);
        Events.register('reset.game', Game.events.reset);
        Events.register('restart.game', Game.events.restart);
        Events.register('draw.board', Game.events.drawBoard);
        Events.register('setbusy.game', Game.events.setBusy);

        Events.register('set.players', Game.events.setPlayers);
        Events.register('unset.players', Game.events.unsetPlayers);

        Events.register('game.takeItem', Game.events.takeItem);

        Events.register('game.monitor', Game.events.writeToMonitor);

        Game._dom = $('[data-name="board"][data-type="page"]');
    };

    /**
     * Check current game status
     */
    Game.turn = function (itemsExit) {
        var result = 0;

        /**
         * Update items left
         */
        Board.itemsLeft = Board.itemsLeft - itemsExit;

        /**
         * Current user looses
         */
        if(0 >= Board.itemsLeft) {
            result = 1;
        }

        /**
         * Next user looses
         */
        if(1 === Board.itemsLeft) {
            result = 2;
        }

        return result;

    };

    /**
     * @event
     * @param {String} type
     */
    Game.events.start = function (type) {
        console.debug('[Game][start]::', type);
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

        Board.items = Board.defaults.items;
        Board.itemsLeft = Board.defaults.itemsLeft;

        /**
         * Set game type
         */
        Game.type = type;

        /**
         * Unbusy
         */
        Events.trigger('setbusy.game', false);

        /**
         * Draw bord and start the game
         */
        Events.trigger('draw.board');
        Game.running = true;
    };

    /**
     * @event
     * Stop and reset game module
     */
    Game.events.reset = function (restart) {
        /**
         * Rest game dom
         */
        Game._dom.find('.game_board .content').html($());
        Game._dom.find('[data-name="monitor"] .content').html($());

        /**
         * Reset board settings
         */
        delete Board.items;
        delete Board.itemsLeft;

        /**
         * On restart keep game type
         */
        if(undefined !== restart && false === restart) {
            Game.type = false;
        }

        /**
         * Reset players
         */
        Events.trigger('unset.players');

        /**
         * Allow new game
         */
        Game.running = false;
    };

    /**
     * @event
     * Game restart
     */
    Game.events.restart = function () {
        Events.trigger('reset.game', true);
        Events.trigger('start.game', Game.type);
    };

    /**
     * Set game busy flag
     */
    Game.events.setBusy = function (isBusy) {
        Game.isBusy = isBusy;
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

        /**
         * Everything look good. Draw the board
         */
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
     * Unset players
     */
    Game.events.unsetPlayers = function () {

        Game.players.p1 = {};
        Game.players.p2 = {};
        Game.players.next = 'p1';

        Events.trigger('ai.reset');
    };

    /**
     * Game item take
     */
    Game.events.takeItem = function (count) {
        var nextPlayer,
            i_take,
            tmpItem,
            turnResult;

        /**
         * More buttons spamming check
         */
        if(true === Game.isBusy) {
            return false;
        }

        /**
         * Decide next player
         */
        nextPlayer = ('p1' === Game.players.next ? 'p2' : 'p1');

        /**
         * Set move
         */
        for(i_take = 0; i_take < count; i_take += 1) {
            tmpItem = (Board.itemsLeft - i_take);

            Game._dom.find('[data-name="game.item"][data-value="'+ tmpItem +'"]')
                .addClass('inactive')
                .removeClass('active');
        }

        turnResult = Game.turn(count);

        if(0 === turnResult) {
            /**
             * Set next player
             */
            Game.players.next = nextPlayer;

            /**
             * Check if is AI
             */
            if(true === Game.players[nextPlayer].isAI) {
                Events.trigger('ai.move', Board.itemsLeft);
            }


            /**
             * Write to monitor
             */
            Events.trigger('game.monitor', '<p>Next is: '+ Game.players[Game.players.next].nickname +'</p>');
            Events.trigger('game.monitor', '<p>Items left: '+ Board.itemsLeft +'</p>');
        }

        if(1 === turnResult) {
            Events.trigger('game.monitor', '<p>Player: ['+ Game.players[nextPlayer].nickname +'] Win!</p>');
            Events.trigger('game.monitor', '<p>Player: ['+ Game.players[Game.players.next].nickname +'] Lost!</p>');
            Events.trigger('setbusy.game', true);
        }

        if(2 === turnResult) {
            Events.trigger('game.monitor', '<p>Player: ['+ Game.players[Game.players.next].nickname +'] Win!</p>');
            Events.trigger('game.monitor', '<p>Player: ['+ Game.players[nextPlayer].nickname +'] Lost!</p>');
            Events.trigger('setbusy.game', true);
        }
    };

    /**
     * Write to game monitor
     */
    Game.events.writeToMonitor = function(message) {
        Game.monitor.output += message;

        Game._dom.find('[data-name="monitor"] .content').append(message);

        Game._dom.find('[data-name="monitor"] .content').animate({
            scrollTop: Game._dom.find('[data-name="monitor"] .content p').last().offset().top
        });
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
        player_2.setAsAI(AILevel);

        Events.trigger('set.players', {
            p1: player_1,
            p2: player_2
        });
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

    };

    /**
     * Install
     */
    Game.install();
}());
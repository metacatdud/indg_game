/**
 * app
 *
 * @author Tiberiu Georgescu <tibi@qbyco.com>
 * @version 0.1.0
 */
window['App'] = (function () {
    'use strict';

    /**
     * Main App object
     */
    var App = {
        events: {},
        activeScreen: 'menu.page'
    };

    /**
     * Install app handlers and events
     */
    App.install = function () {
        Events.register('app.help', App.events.help);
        Events.register('app.activeScreen', App.events.setScreen);
        Events.register('app.back', App.events.goBack);
        Events.register('app.exit', App.events.reset);
    };

    /**
     * Init application
     */
    App.init = function () {
        /**
         * player
         * game
         * dom
         * score
         */
        UI.show('menu', 'page');
        App.activeScreen = 'menu.page';
    };

    /**
     * Reset application
     */
    App.reset = function () {
        /**
         * game reset - done
         * score reset
         * player reset
         * dom reset - done
         */
        var currentScreen;

        currentScreen = App.activeScreen.split('.');

        Events.trigger('reset.game');

        UI.hide(currentScreen[0], currentScreen[1], function () {
            UI.show('menu', 'page');
            App.activeScreen = 'menu.page';
        });
    };

    /**
     * @event
     * Show help screen
     */
    App.events.help = function () {
        var currentScreen;

        currentScreen = App.activeScreen.split('.');

        UI.hide(currentScreen[0], currentScreen[1], function () {
            UI.select('help', 'page').find('[data-target="app.back"]').attr('data-params', App.activeScreen);
            UI.show('help', 'page');
            App.activeScreen = 'help.page';
        });
    };

    /**
     * @event
     * @param {String} destination
     * Back button event
     */
    App.events.goBack = function (destination) {
        Events.trigger('app.activeScreen', destination);
    };

    /**
     * Set active screen
     */
    App.events.setScreen = function (screenName) {
        var currentScreen,
            newScreen;

        currentScreen = App.activeScreen.split('.');
        newScreen = screenName.split('.');

        UI.hide(currentScreen[0], currentScreen[1], function() {
            UI.show(newScreen[0], newScreen[1]);
            App.activeScreen = newScreen.join('.');
        });
    };

    /**
     * @event
     * Reset game and exit to main menu
     */
    App.events.reset = function () {
        App.reset();
    };

    /**
     * Run installer
     */
    App.install();

    return App;
}());
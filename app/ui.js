/**
 * ui
 *
 * @author Tiberiu Georgescu <tibi@qbyco.com>
 * @version 0.1.0
 */
window['UI'] = (function () {
    'use strict';

    var UI = {};


    /**
     * Show a HTML block
     * @param {String} name
     * @param {String} type
     * @param {Function} cb
     */
    UI.show = function(name, type, cb) {
        var el = $('[data-name="' + name + '"][data-type="' + type + '"]');
        el.show(400, function() {
            el.addClass('visible');
            el.removeClass('hidden');
            if(undefined !== cb && 'function' === typeof cb) {
                cb.call(cb);
            }
        });
    };

    /**
     * Hide a HTML block
     * @param name
     * @param type
     * @param {Function} cb
     */
    UI.hide = function (name, type, cb) {
        var el = $('[data-name="' + name + '"][data-type="' + type + '"]');
        el.hide(400, function() {
            el.addClass('hidden');
            el.removeClass('visible');

            if(undefined !== cb && 'function' === typeof cb) {
                cb.call(cb);
            }
        });
    };

    /**
     * select
     * @param name
     * @param type
     * @return {$}
     */
    UI.select = function (name, type, selector) {

        if(undefined !== selector && 'string' === selector) {
            return $('[data-' + selector + '="' + name + '"][data-type="' + type + '"]');
        }

        return $('[data-name="' + name + '"][data-type="' + type + '"]');
    };

    /**
     * Custom bind
     */
    UI.bind = function (element, action) {
        var eventHeader,
            eventParams;

        element.on(action, function(e) {
            eventHeader = $(e.currentTarget).data('target');
            eventParams = $(e.currentTarget).data('params');
            //console.debug('Custom binded::', eventHeader, eventParams);
            Events.trigger(eventHeader, eventParams);
        });
    };

    /**
     * Install UI Handlers on runtime
     */
    UI.install = function () {
        var eventHeader,
            eventParams;

        $('[data-target]').on('click', function(e) {
            eventHeader = $(e.currentTarget).data('target');
            eventParams = $(e.currentTarget).data('params');
            //console.debug('Click::', eventHeader, eventParams);
            Events.trigger(eventHeader, eventParams);
        });

    };


    UI.install();

    return UI;
}());
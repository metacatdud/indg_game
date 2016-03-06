/**
 * events
 *
 * @author Tiberiu Georgescu <tibi@qbyco.com>
 * @version 0.1.0
 */
window['Events'] = (function () {
    'use strict';

    var Events = {
        storage: {}
    };

    /**
     * Register event
     * @param name
     * @param body
     */
    Events.register = function (name, body) {
        if(undefined === Events.storage[name]) {
            Events.storage[name] = body;
        }
    };

    /**
     * Trigger event
     * @param {String} name
     */
    Events.trigger = function (name) {
        var args = [],
            i_args;

        for(i_args = 1; i_args < arguments.length; i_args +=1) {
            args.push(arguments[i_args]);
        }

        if(undefined !== Events.storage[name]) {
            Events.storage[name].apply(Events.storage[name], args);
        }

    };

    return Events;

}());
"use strict";
/**
 * The core module of the Skynet suite. Responsible for standardizing how http requests are made
 * to restful APIs.
 *
 * @returns {object} Instance of Skynet
 * @constructor
 */
function Skynet(initConfig){
    // if this isn't a new instance of Skynet make it so
    if (!(this instanceof Skynet)) {
        return new Skynet(initConfig);
    }

    // Dependencies
    const _ = require('lodash');  // Utils
    const querystring = require('querystring');
    const Wreck = require('wreck'); // Library to standardize HTTP request methods
    const HttpProxyAgent = require('http-proxy-agent'); // Provides an HTTP agent for proxying requests
    const HttpsProxyAgent = require('https-proxy-agent'); // Provides an HTTPS agent for proxying requests
    let wreckDefaults = { json: "force" }; // default to force json parse for all calls
    let wreck = Wreck.defaults(wreckDefaults); // set the wreck defaults

    // Define the pseudo-class members here
    let config;

    /*-------------------------------------------------------------------------
     Internals
     ------------------------------------------------------------------------*/
    /**
     * Default Skynet Configuration
     *
     * @type {Object}
     */
    config = {
        endpoint: "api.skynet.com",
        headers: {},
        proxy: null,
        ssl: false,
        timeout: 5000
    };

    /**
     * Converts an object into a URL query string. Creating
     *
     * @param {object} params Query Parameters
     * @returns {string} URL Query String
     */
    this.queryString = function(params){
        let stringifiedParams = querystring.stringify(params);
        return `?${stringifiedParams}`;
    };

    /*-------------------------------------------------------------------------
     PUBLIC METHODS
     -------------------------------------------------------------------------*/
    /**
     * Updates the Skynet configs with any desired customizations
     *
     * @param {object} modConfig An object containing the Skynet configurations intended for modification.
     */
    this.setConfig = function (modConfig) {
        // set options
        if (typeof modConfig === "object") {
            _.assign(config, modConfig);
        }

        wreckDefaults.baseUrl = (config.ssl) ? `https://${config.endpoint}` : `http://${config.endpoint}` ;
        wreckDefaults.headers = config.headers;
        wreckDefaults.timeout = config.timeout;

        // Setup Proxy Agent if configured
        // This is to support going through Squid Proxy for external connections
        // Such as BazaarVoice
        if (config.proxy) {
            wreckDefaults.agent = (config.ssl) ? new HttpsProxyAgent(config.proxy) : new HttpProxyAgent(config.proxy);
        }

        // Allow for special case overrides for non JSON responses (ex. XML, HTML)
        if (config.json) {
            wreckDefaults.json = config.json;
        }

        wreck = Wreck.defaults(wreckDefaults);
    };

    /**
     * Gets the headers from Skynets config object
     *
     * @returns {object} The current Skynet config object
     */
    this.getConfig = function () {
        return config;
    };

    /**
     * Makes a service request
     *
     * @param   {String}    path   Service URL path (with Params)
     * @param   {Object}    options Options to pass to Wreck
     * @param   {Function}  cb Callback called when request finishes, returns (error, response)
     */
    this.get = function (path, options, cb) {
        if (typeof options === "function") {
            cb = options;
            options = {};
        }

        return wreck.get(path, options, function (err, response, payload) {
            if (!err){
                // Catch Errors in the response here.
                if (response.statusCode == 200 || response.statusCode == 204) {
                    cb(null, payload, response);
                } else {
                    cb(new Error("Failed with status code of " + response.statusCode), payload);
                }
            } else {
                cb(err);
            }
        });
    };

    /**
     * POST
     *
     * @param   {String}    path   URL path to POST to
     * @param   {Object}    options Options to pass to Wreck, must include payload object for POST
     * @param   {Function}  cb Callback called when POST request finishes, returns (error, response)
     */
    this.post = function (path, options, cb) {
        if (typeof options === "function") {
            cb = options;
            options = {};
        }

        if (typeof options.payload !== "undefined") {
            options.payload = querystring.stringify(options.payload); // convert data object to string for wreck
        }

        return wreck.post(path, options, function (err, response, payload) {
            if (!err){
                // Catch Errors in the response here.
                // 200 is success, 201 is created
                if (response.statusCode == 200 || response.statusCode == 201) {
                    cb(null, payload, response);
                } else {
                    cb(new Error("Failed with status code of " + response.statusCode), payload);
                }
            } else {
                cb(err);
            }
        });
    };

    /**
     * PUT
     *
     * @param   {String}    path   URL path to PUT to
     * @param   {Object}    options Options to pass to Wreck, must include payload object for PUT
     * @param   {Function}  cb Callback called when PUT request finishes, returns (error, response)
     */
    this.put = function (path, options, cb) {
        if (typeof options === "function") {
            cb = options;
            options = {};
        }

        if (typeof options.payload !== "undefined") {
            options.payload = querystring.stringify(options.payload); // convert data object to string for wreck
        }

        return wreck.put(path, options, function (err, response, payload) {
            if (!err){
                // Catch Errors in the response here.
                // 200 is success, 204 is no content
                if (response.statusCode == 200 || response.statusCode == 204) {
                    cb(null, payload, response);
                } else {
                    cb(new Error("Failed with status code of " + response.statusCode), payload);
                }
            } else {
                cb(err);
            }
        });
    };

    /**
     * DELETE
     *
     * @param   {String}    path   URL path to send DELETE to
     * @param   {Object}    options Options to pass to Wreck
     * @param   {Function}  cb Callback called when DELETE request finishes, returns (error, response)
     */
    this.delete = function (path, options, cb) {
        if (typeof options === "function") {
            cb = options;
            options = {};
        }

        return wreck.delete(path, options, function (err, response, payload) {
            if (!err){
                // Catch Errors in the response here.
                // 200 is success, 204 is no content
                if (response.statusCode == 200 || response.statusCode == 204) {
                    cb(null, payload, response);
                } else {
                    cb(new Error("Failed with status code of " + response.statusCode), payload);
                }
            } else {
                cb(err);
            }
        });
    };

    // Initialize before returning an instance
    this.setConfig(initConfig);
}

module.exports = Skynet;

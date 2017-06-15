/* global window,$,console */
/**
 *
 * @class The Skynet class. Responsible for standardizing front-end service calls and important cookies.
 * @constructor
 * @returns {object} Instance of Skynet
 *
 *
 * @property {object} member All public methods related to Member (User/Customer)
 * @property {function} getConfig Returns private config object
 * @property {function} setConfig Provides ability to set config options.
 * @property {function} get Standard Method to AJAX GET to a url.
 * @property {function} post Standard Method to AJAX POST to a url
 * @property {function} put Standard Method to AJAX PUT to a url
 * @property {function} delete Standard Method to AJAX DELETE to a url
 *
 */
function Skynet() {

    /*-------------------------------------------------------------------------
     Internals Vars
     ------------------------------------------------------------------------*/
    var
        /**
         * Internal Constants
         *
         * @type {Object}
         */
        constants = {
            /**
             * Service Paths
             */
            SOME_SERVICE_PATH: "/some/service/path"
        },

        /**
         *  Default settings for Global Cookies
         */
        globalCookieSettings = {
            path: "/"
        },

        /**
         * This instance of SkynetUI
         *
         * @type {Skynet}
         */
        instance = this,

        /**
         *
         * @type {boolean}
         */
        debug = false,

        /**
         * A reusable error placeholder so we don't have to redefine it in each method that uses it.
         * @type {undefined}
         */
        e = undefined
    ;

    /*
     *  Configuration that can be changed per need
     *
     *  @type {object}
     */
    var config = {
    };

    /**
     * Get configuration
     */
    this.getConfig = function() {
        return config;
    };

    /**
     * Set configuration overrides
     *
     *  @param      options     the config object to override defaults
     */
    this.setConfig = function(options) {
        $.extend( true, config, options );
    };

    /*-------------------------------------------------------------------------
     Internals Functions
     ------------------------------------------------------------------------*/
    /**
     * Logs to the console when debug is set to true.
     *
     * @param logContent
     * @param logType
     */
    function log(logContent, logType){
        logType = logType || 'log';
        if(debug){
            if (logType === "error") {
                console.error(logContent);
            } else {
                console.log(logContent);
            }
        }
    }

    /**
     * Stores the errors in e, outputs the error in the console, returns the rejected promise.
     *
     * @param error
     *
     * @returns {object} reject   A rejected promise.
     */
    function error(error){
        e = error;
        log(e, 'error');
        return $.Deferred().reject(e);
    }

    /**
     * DataFilter constructor for $.ajax() options
     *
     * @param       {Function}      applyDataNormalizations         Function to run on the response
     *
     * @returns     {Function}
     *
     * @constructor
     */
    var DataFilter = function(applyDataNormalizations) {
        return function(response) {
            if(response) {
                response = JSON.parse(response);

                log(response);

                // Any data normalizations can be applied here.
                applyDataNormalizations && applyDataNormalizations(response);

                return JSON.stringify(response);
            }
        };
    };

    /**
     * All public methods related to Member (User/Customer)
     * @namespace
     * @type {Object}
     */
    this.member = {};

    /*-------------------------------------------------------------------------
     PUBLIC METHODS
     -------------------------------------------------------------------------*/

    /**
     * Standard Method to AJAX GET to a url
     *
     * @param      {string}        url                     the url to get from
     * @param      {object}        options[optional]       options to pass to the ajax method
     */
    this.get = function(url, options) {

        options = options || {};

        var headers = options.headers;

        var ajaxOptions = $.extend({
            url: url,
            method: "GET",
            dataType: "json",
            headers: headers,
            dataFilter: options.dataFilter || new DataFilter()
        }, options);

        return $.ajax(ajaxOptions);
    };

    /**
     * Standard Method to AJAX POST to a url
     *
     * @param      {string}        url                     the url to post to
     * @param      {object}        data                    the json data to post (will be stringified)
     * @param      {object}        options[optional]       options to pass to the ajax method
     */
    this.post = function(url, data, options) {

        options = options || {};

        var headers = options.headers

        var ajaxOptions = $.extend(true, {
            url: url,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            data: JSON.stringify(data),
            dataFilter: options.dataFilter || new DataFilter()
        }, options);

        return $.ajax(ajaxOptions);
    };

    /**
     * Upload Method to AJAX multi-part POST to a url
     *
     * @param      {string}        url                     the url to post to
     * @param      {object}        data                    the upload data to post (needs to be type FormData())
     * @param      {object}        options[optional]       options to pass to the ajax method
     */
    this.multipartPost = function(url, data, options) {

        options = options || {};

        var headers = options.headers
        var ajaxOptions = $.extend(true, {
            url: url,
            type: "POST",
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if (options.onProgress) {
                    xhr.addEventListener('progress', options.onProgress);
                }
                if (options.onLoad) {
                    xhr.addEventListener("load", options.onLoad);
                }
                if (options.onError) {
                    xhr.addEventListener("error", options.onError);
                }
                if (xhr.upload) {
                    if (options.upload) {
                        if (options.upload.onProgress) {
                            xhr.upload.addEventListener('progress', options.upload.onProgress);
                        }
                    }
                }
                return xhr;
            },
            headers: headers,
            data: data,
            mimeType: "multipart/form-data",
            contentType: false,
            processData: false,
            cache: false
        }, options);

        return $.ajax(ajaxOptions);
    };

    /**
     * Standard Method to AJAX PUT to a url
     *
     * @param      {string}        url                     the url to put to
     * @param      {object}        data                    the json data to put (will be stringified)
     * @param      {object}        options[optional]       options to pass to the ajax method
     */
    this.put = function(url, data, options) {

        options = options || {};

        var headers = options.headers

        var ajaxOptions = $.extend(true, {
            url: url,
            method: "PUT",
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            data: JSON.stringify(data),
            dataFilter: options.dataFilter || new DataFilter()
        }, options);

        return $.ajax(ajaxOptions);
    };

    /**
     * Standard Method to AJAX DELETE to a url
     *
     * @param      {string}        url                     the url to delete from
     * @param      {object}        options[optional]       options to pass to the ajax method
     */
    this.delete = function(url, options) {

        options = options || {};

        var headers = options.headers

        var ajaxOptions = $.extend({
            url: url,
            method: "DELETE",
            dataType: "json",
            headers: headers
        }, options);

        return $.ajax(ajaxOptions);
    };

    /**
     * Register a new User Account          [WIKI PAGE LINK]
     *
     * @param   {object}    input           The data to send to service see Service docs for full requirements
     * @param   {object}    [options={}]    (Optional) Options to pass to the $.ajax method
     *
     * @returns {object}    promise/user    The request's promise or the guestUser object in a promise form if it already exists.
     *
     * @example
     *      skynet.member.registerUser({phoneUS" : "7045551234", "password1" : "winning!", "password2" : "winning!", "email1" : "ricky.bobby@gofast.com", "zipCode" : "28078", "firstName" : "Ricky", "lastName" : "Bobby"})
     *          .done(function(response){})
     *          .fail(function(xhr, text){});
     */
    this.member.registerUser = function(input, options){
        var url = constants.SOME_SERVICE_PATH;

        if (typeof input !== "object") {
            return error(new Error("Skynet.member.registerUser(): some input is required to register the user."));
        }

        var ajaxOptions = $.extend({ dataFilter: new DataFilter(setupUser) }, options);

        return instance.post(url, input, ajaxOptions);
    };

    /**
     * Sets debug to true to enable request logs
     */
    this.enableLogs = function(){
        debug = true;
        return "Logs are enabled.";
    };

    /**
     * Sets debug to true to enable request logs
     */
    this.disableLogs = function(){
        debug = false;
        return "Logs are disabled.";
    };

    /**
     * Returns the last error that skynet handled
     *
     * @returns {Error} e The last error that skynet handled
     */
    this.getLastError = function(){
        return e;
    };

    /*-------------------------------------------------------------------------
     Initialize before returning an instance
     -------------------------------------------------------------------------*/
    // Nothing here yet.
    return this;
}

skynet = new Skynet();

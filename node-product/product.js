"use strict";
/**
 * Skynet's Product Module.
 * Exposes a collection of methods that make use of Skynet-Core for initiating Product related http requests to Services API.
 *
 * @param   {object} -  Optional configs to use when initializing an instance
 * @returns {Skynet} - Instance of Skynet with member related methods
 * @constructor
 * @extends Skynet
 */
var Product = require('skynet-core');

Product.prototype = {

    CONSTANTS: {
    },

    /*---------------------------------------------------------
     Public Methods
     ---------------------------------------------------------*/
    /**
     * @type {getById}
     */
    getById: require("./lib/getById")

};

module.exports = Product;

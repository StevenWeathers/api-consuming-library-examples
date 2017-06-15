"use strict";

/**
 *  <ol>
 *     <li>Makes a GET Request to the getById Service [GET PRODUCT BY ID]{@link http://docs.skynet.com/api/product/byid}</li>
 *  </ol>
 * @param {object} params key=value pairs for the service call parameters
 *  <table>
 *      <thead>
 *      <tr>    <th>Name</th>                   <th>Type</th>           <th>Required</th>   </tr>
 *      </thead>
 *      <tr>    <td>id</td>                     <td>integer</td>        <td>yes</td>
 *  </table>
 *  @param   {Function}  cb Callback called when request finishes, returns (error, response)
 *
 *
 *  @example
 *  Product.getById(params, function(err, response){
 *      // Handle response here
 *  });
 */

const Joi = require('joi');

function getById(params, cb) {
    let schema = Joi.object().keys({
        id: Joi.string().required()
    });
    let options = {};

    // Validate the params before trying to get the data
    Joi.validate(params, schema, (error, params) => {
        if (error) {
            cb(error);
        } else {
            let path = `/product/id/${params.id}`;

            this.get(`${path}`, options, function (err, response){
                if (err) {
                    cb(err);
                } else {
                    cb(null, response);
                }
            });
        }
    });
}

module.exports = getById;

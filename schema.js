const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        price: Joi.number().required().min(10),
        image:Joi.string().allow("",null),
        country:Joi.string().required(),
    }).required()
});

module.exports = {listingSchema};
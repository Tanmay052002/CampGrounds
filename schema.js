const withoutsanitizejoi=require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML':'HTML should not be present in {#label}!!'
    },
    rules: {
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean!==value) return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
})

const joi = withoutsanitizejoi.extend(extension); 

module.exports.campSchema=joi.object({
    campground:joi.object({
        title:joi.string().required().escapeHTML(),
        price:joi.number().required().min(0),
        location:joi.string().required().escapeHTML(),
        description:joi.string().required().escapeHTML()
    }).required(),
    deleteImages:joi.array()
})
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        body:joi.string().required().escapeHTML()
    }).required()
})
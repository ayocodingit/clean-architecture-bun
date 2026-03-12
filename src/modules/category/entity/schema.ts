import Joi from 'joi'
import { RequestBody } from './interface'

// define for schema validate
export const Store = Joi.object<RequestBody>({
    title: Joi.string().required(),
    description: Joi.string().required(),
})

export const Update = Store

export const Id = Joi.object({
    id: Joi.number().required(),
})

import Joi from 'joi';
import { constants } from '../core/constants.js';

let { adminRoles, userStatus } = constants;


const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const get = Joi.object({
  page: Joi.number().integer().min(1).allow(null),
  limit: Joi.number().integer().min(1).allow(null)
});

const changeStatus = Joi.string().valid(...Object.values(userStatus));

const update = Joi.object({
  name: Joi.string().allow(null),
  password: Joi.string().allow(null),
  role: Joi.string().valid(...[adminRoles.staff, adminRoles.admin])
});

const create = Joi.object({
  name: Joi.string().allow(null),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...[adminRoles.staff, adminRoles.admin]).allow(null)
});

export {
  changeStatus,
  login,
  update,
  create,
  get
};

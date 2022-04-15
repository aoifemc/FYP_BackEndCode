const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('Authorisation/validate-request');
const authorize = require('Authorisation/authorize')
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.post('/consultation', uploadForm, consultation);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.put('/password/:username', updatePassword, forgotPassword);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        //confirm: Joi.string().min(6).required()
        //admin: Joi.boolean().required()

    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function uploadForm(req, res, next) {
    const schema = Joi.object({
        Name: Joi.string().required(),
        User: Joi.string().required(),
        Feelings: Joi.string().required(),
        Year: Joi.string().required(),
        //confirm: Joi.string().min(6).required()
        //admin: Joi.boolean().required()

    });
    validateRequest(req, next, schema);
}

function consultation(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

// function updateUsername(req, res, next) {
//     id = req.body.id
//     newUsername = req.body.username
//     userService.update(id, newUsername)
//         .then(() => res.json({ message: 'Username Updated' }))
//         .catch(next);
// }

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function forgotPassword(req, res, next) {
    userService.forgotPassword(req.params.username, req.body)
        .then(user => res.json({"message": "Password Changed Successfully"}))
        .catch(next);
}

function updatePassword(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}
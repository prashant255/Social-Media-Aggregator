'use strict';

const jwt = require('jsonwebtoken')
const User = require('../models/users')

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({where: {id: decoded.id}})
        
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Unauthorized Access' })
    }
}

module.exports = authenticateUser
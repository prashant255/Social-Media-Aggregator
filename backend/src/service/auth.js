'use strict';

const bcrypt = require('bcrypt')
const User = require('../models/users')
const Token = require('../models/tokens')
const NodeMailer = require('../authentication/nodemailerConfig')
const jwt = require('jsonwebtoken')
const error = require('../error')

const register = async ({name, email, password}) => {
    try {
        if(name === undefined || email === undefined || password === undefined){
            throw new Error(JSON.stringify(error.BAD_REQUEST))
        }
        if(await User.findOne({where: {email}}) !== null)
            throw new Error(JSON.stringify(error.UNIQUE_EMAIL))
        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10)
        })
        await NodeMailer.sendMail(user.id, user.name, user.email)
    } catch (e) {
        throw new Error(e.message)
    }
}

const login = async ({email, password}) => {
    try{
        if(email === undefined || password === undefined)
            throw new Error(JSON.stringify(error.BAD_REQUEST))
        const user = await User.findOne({where: {email}})
        if(user === null)
            throw new Error(JSON.stringify(error.NO_USER_EXIST))
        if(!user.emailVerificationStatus)
            throw new Error(JSON.stringify(error.EMAIL_VERIFICATION_ERROR))   
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                {
                    id: user.id
                }, 
                process.env.JWT_SECRET, 
                {
                    expiresIn: '7d',
                })
            return({...user, token})
        }
        throw new Error(JSON.stringify(error.INVALID_CREDENTIALS))
    } catch (e) {
        throw new Error(e.message)
    }
}

const confirmEmail = async (req, res) => {
    const { userId } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await User.update(
        { emailVerificationStatus: true },
        { where: { id: userId } }
    )
    // TODO:Change the redirect url when the email is confirmed
    return(res.redirect('http://localhost:3000/login'))
}

const getSocialMediaLinkageStatus = async (userId) => {

    const token = await Token.findOne({where: { userId }});

    if(token){
        return {
            twitter: (token.twitterAccessToken) ? true : false,
            reddit: (token.redditAccessToken) ? true : false,
            facebook: (token.facebookAccessToken) ? true : false
        }
    }else {
        return {
            twitter: false,
            reddit: false,
            facebook: false
        }
    }
}

module.exports = {
    register,
    login,
    confirmEmail,
    getSocialMediaLinkageStatus
}

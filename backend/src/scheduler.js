const cron = require('node-cron')
const axios = require('axios')

const User = require('./models/users')

const getUserList = async () => {
    return await User.findAll({
        attributes: ['id']
    })
}

const updateRedditToken = async () => {
    const userList = await getUserList()
    userList.map(async user => {
        try{
            await axios.post(`http://localhost:8080/api/reddit/refresh/${user.dataValues.id}`)
        } catch(e) {
            console.log("Unable to refresh token")
        }
    })
}

const getNewPost = async () => {
    const userList = await getUserList()
    userList.map(async user => {
        try {
            await axios.post(`http://localhost:8080/api/twitter/allPosts/${user.dataValues.id}`)
            await axios.post(`http://localhost:8080/api/reddit/allPosts/${user.dataValues.id}`)
            await axios.post(`http://localhost:8080/api/facebook/allPosts/${user.dataValues.id}`)
        } catch(e) {
            console.log(e.message)
        }
    })
} 

cron.schedule('0 * * * *', updateRedditToken)
// cron.schedule('*/5 * * * *', getNewPost)
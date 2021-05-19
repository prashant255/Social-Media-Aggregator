const cron = require('node-cron')
const axios = require('axios')

const User = require('./models/users')

const updateRedditToken = async () => {
    const userList = await User.findAll({
        attributes: ['id']
    })
    userList.map(async user => {
        try{
            await axios.post(`http://localhost:8080/api/reddit/refresh/${user.dataValues.id}`)
        } catch(e) {
            console.log("Unable to refresh token")
        }
    })
}

cron.schedule('0 * * * *', updateRedditToken)

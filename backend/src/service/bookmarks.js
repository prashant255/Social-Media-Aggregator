const Posts = require('../models/posts')
const { QueryTypes } = require('sequelize')

const changeBookmark = async (userId, postId) => {
    const currentBookmark = await Posts.findOne({
        where: {
            userId,
            lurkerPostId: postId
        },
        attributes: ['bookmark']
    })
    let bookmark = null
    if (currentBookmark.dataValues.bookmark === null) 
        bookmark = true
    await Posts.update({
        bookmark
    }, {
        where: {
            userId,
            lurkerPostId:postId
        }
    })
}

const getBookmarkedPost = async (userId, offset) => {
    try{
        const limit = 5
        let query = 'select * from posts as p inner join post_details as pd on p."lurkerPostId" = pd.id where p."userId" = :userId and p.bookmark = :bookmark '
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                userId,
                bookmark: true
            },
            type: QueryTypes.SELECT 
        })
        return posts    
    }
    catch(e) {
        throw new Error(e.message)
    }
}

module.exports = {
    changeBookmark,
    getBookmarkedPost
}
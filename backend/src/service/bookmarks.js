const Posts = require('../models/posts')

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

module.exports = {
    changeBookmark
}
const Posts = require('../models/posts')
const common = require('../common')
const { QueryTypes } = require('sequelize')
const categories = require('../service/settings/categories')

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
    return bookmark
}

const getBookmarkedPostByCategory = async (userId, offset, category) => {
    try{
        const limit = 5
        let query = `select array_agg(ARRAY[cast(p."lurkerPostId" as text), pd."postId", pd."handle", cast(p.bookmark as text)]) 
        from posts p 
        inner join groups g on p."groupId" = g.id 
        inner join post_details pd on p."lurkerPostId"=pd.id 
        where p."userId" = :userId and LOWER(g.category) = :category and p.bookmark = :bookmark
        group by g.id order by g.id `
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category,
                userId,
                bookmark: true
            },
            type: QueryTypes.SELECT 
        })
        return common.convertPostFormat(posts)    
    }
    catch(e) {
        throw new Error(e.message)
    }
}

const getAllBookmarkedPost = async (userId, offset) => {
    try{
        const selectedCategories = (await categories.getUserCategories(userId)).selectedCategory

        const limit = 5
        let query = `select array_agg(ARRAY[cast(p."lurkerPostId" as text), pd."postId", pd."handle", cast(p.bookmark as text)]) 
        from posts p 
        inner join groups g on p."groupId" = g.id 
        inner join post_details pd on p."lurkerPostId"=pd.id 
        where p."userId" = :userId and LOWER(g.category) in (:category) and p.bookmark = :bookmark
        group by g.id order by g.id `
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category: selectedCategories.toLocaleString().toLowerCase().split(','),
                userId,
                bookmark: true
            },
            type: QueryTypes.SELECT 
        })
        return common.convertPostFormat(posts)    
    }
    catch(e) {
        throw new Error(e.message)
    }
}

module.exports = {
    changeBookmark,
    getBookmarkedPostByCategory,
    getAllBookmarkedPost
}
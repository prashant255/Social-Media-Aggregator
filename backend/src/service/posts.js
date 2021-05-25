const categories = require('../service/settings/categories')
const { QueryTypes } = require('sequelize')

const getPostForUser = async (userId,offset) => {
    try{
        const selectedCategories = (await categories.getUserCategories(userId)).selectedCategory
        const limit = 5
        // let query = 'select * from posts as p inner join post_details as pd on p."lurkerPostId" = pd.id where p."userId" = :userId and LOWER(pd.category) in (:category)'
        let query = 'select * from posts p inner join groups g on p."groupId" = g.id inner join post_details pd on p."lurkerPostId"=pd.id where p."userId" = :userId and LOWER(g.category) in (:category) '
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category: selectedCategories.toLocaleString().toLowerCase().split(','),
                userId
            },
            type: QueryTypes.SELECT 
        })
        return posts    
    }
    catch(e) {
        throw new Error(e.message)
    }
}

const getPostForUserByCategory = async (userId, offset, category) => {
    try{
        const limit = 5
        // let query = 'select * from posts as p inner join post_details as pd on p."lurkerPostId" = pd.id '
        let query = 'select * from posts p inner join groups g on p."groupId" = g.id inner join post_details pd on p."lurkerPostId"=pd.id where p."userId" = :userId and LOWER(g.category) = :category '
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category,
                userId
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
    getPostForUser,
    getPostForUserByCategory
}
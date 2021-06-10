const categories = require('../service/settings/categories')
const { QueryTypes } = require('sequelize')
const common = require('../common')

const getPostForUser = async (userId,offset) => {
    try{
        const selectedCategories = (await categories.getUserCategories(userId)).selectedCategory
        const limit = 5

        let query = `select array_agg(ARRAY[cast(p."lurkerPostId" as text), pd."postId", pd."handle", cast(p.bookmark as text)]) 
        from posts p 
        inner join groups g on p."groupId" = g.id 
        inner join post_details pd on p."lurkerPostId"=pd.id 
        where p."userId" = :userId and LOWER(g.category) in (:category)
        group by g.id order by g.id desc `
        query += `limit ${limit} offset ${offset}`

        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category: selectedCategories.toLocaleString().toLowerCase().split(','),
                userId
            },
            type: QueryTypes.SELECT 
        })
        return common.convertPostFormat(posts)    
    }
    catch(e) {
        throw new Error(e.message)
    }
}

const getPostForUserByCategory = async (userId, offset, category) => {
    try{
        const limit = 5

        let query = `select array_agg(ARRAY[cast(p."lurkerPostId" as text), pd."postId", pd."handle", cast(p.bookmark as text)]) 
        from posts p 
        inner join groups g on p."groupId" = g.id 
        inner join post_details pd on p."lurkerPostId"=pd.id 
        where p."userId" = :userId and LOWER(g.category) = :category 
        group by g.id order by g.id desc `
        query += `limit ${limit} offset ${offset}`


        const posts = await sequelize.query(query, 
        { 
            replacements: { 
                category,
                userId
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
    getPostForUser,
    getPostForUserByCategory
}
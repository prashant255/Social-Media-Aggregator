const categories = require('../service/settings/categories')
const { QueryTypes } = require('sequelize')

const getPostForUser = async (userId,offset) => {
    try{
        const selectedCategories = (await categories.getUserCategories(userId)).selectedCategory
        const limit = 5
        let query = 'select * from posts as p inner join post_details as pd on p."lurkerPostId" = pd.id where p."userId" = :userId and LOWER(pd.category) in (:category)'
        query += `limit ${limit} offset ${offset}`

        console.log("Offset : ", offset)
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
        console.log(e.message)
        // throw new Error(e.message)
    }
}

module.exports = {
    getPostForUser
}
const categories = require('../service/settings/categories')
const { QueryTypes } = require('sequelize')

const getPostForUser = async (userId) => {
    try{
        const selectedCategories = (await categories.getUserCategories(userId)).selectedCategory
        const posts = await sequelize.query('select * from posts as p inner join post_details as pd on p."lurkerPostId" = pd.id where p."userId" = :userId and LOWER(pd.category) in (:category)', 
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
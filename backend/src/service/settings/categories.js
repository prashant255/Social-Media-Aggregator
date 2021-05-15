const Categories = require('../../models/categories')

const addSelectedCategories = async (selectedCategory, userId) => {
    try{
        await Categories.upsert({
            userId, 
            selectedCategory
        })
    } catch(e) {
        throw new Error(e.message)
    }
}

const getUserCategories = async (userId) => {
    try{
        return await Categories.findOne({where: {userId}})
    } catch(e) {
        throw new Error(e.message)
    }
}

module.exports = {
    addSelectedCategories,
    getUserCategories
}


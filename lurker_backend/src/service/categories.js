'use strict';

const Category = require('../models/categories')

const getCategories = (userId) => {
    return new Promise((resolve, reject) => {
        Category.findOne({where: {userId}}).then(categories => {
            resolve(categories.dataValues.selectedCategory)
        }).catch(e => reject(e))
    })  
    // const user = await User.findOne({where: {id: decoded.id}})
}

const registerCategories = (userId, {categoryList}) => {
    return new Promise((resolve, reject) => {
        Category.upsert({
            userId,
            selectedCategory: categoryList
        }).then(() => resolve())
        .catch(e => reject(e))
    })  
}

module.exports = {
    getCategories,
    registerCategories
}

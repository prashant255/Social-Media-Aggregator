const Posts = require('../../models/posts')
const Tokens = require('../../models/tokens')
const Users = require('../../models/users')
const Categories = require('../../models/categories')

const deleteProfile = async (userId) => {
    const t = await sequelize.transaction();
    try{
        await Posts.destroy({
            where: { userId }
        }, { transaction: t })

        await Categories.destroy({
            where: { userId }
        }, { transaction: t })

        await Tokens.destroy({
            where: { userId }, 
        }, {transaction: t})

        await Users.destroy({
            where: { id: userId }   
        }, {transaction: t})
        
        await t.commit()

    } catch(e) {
        await t.rollback()
        throw new Error(e.message)
    }
}

module.exports = {
    deleteProfile
}
const UserFavorite = require("../models/userFavoriteModel");

class UserFavoriteDAO {
  static async findFavoritesByUser(userId) {
    return await UserFavorite.query()
      .where("user_id", userId)
      .withGraphFetched("discount");
  }

  static async addFavorite(favoriteData) {
    return await UserFavorite.query().insert(favoriteData);
  }

  static async removeFavorite(userId, discountId) {
    return await UserFavorite.query()
      .delete()
      .where("user_id", userId)
      .andWhere("discount_id", discountId);
  }

  static async isFavorite(userId, discountId) {
    const favorite = await UserFavorite.query()
      .where("user_id", userId)
      .andWhere("discount_id", discountId)
      .first();
    return !!favorite;
  }
}

module.exports = UserFavoriteDAO;

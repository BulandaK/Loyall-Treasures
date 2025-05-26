const UserFavoriteDAO = require("../dao/userFavoriteDAO");

class UserFavoriteService {
  static async getFavoritesByUserId(userId) {
    if (isNaN(parseInt(userId, 10))) {
      throw new Error("Invalid User ID");
    }
    return await UserFavoriteDAO.findFavoritesByUser(userId);
  }

  static async addUserFavorite(userId, discountId) {
    if (isNaN(parseInt(userId, 10)) || isNaN(parseInt(discountId, 10))) {
      throw new Error("Invalid User ID or Discount ID");
    }

    const existingFavorite = await UserFavoriteDAO.isFavorite(
      userId,
      discountId
    );
    if (existingFavorite) {
      throw new Error("Discount already in favorites");
    }

    return await UserFavoriteDAO.addFavorite({
      user_id: userId,
      discount_id: discountId,
    });
  }

  static async removeUserFavorite(userId, discountId) {
    if (isNaN(parseInt(userId, 10)) || isNaN(parseInt(discountId, 10))) {
      throw new Error("Invalid User ID or Discount ID");
    }
    const rowsDeleted = await UserFavoriteDAO.removeFavorite(
      userId,
      discountId
    );
    if (rowsDeleted === 0) {
      throw new Error("Favorite not found or already removed");
    }
    return { message: "Favorite removed successfully" };
  }
}

module.exports = UserFavoriteService;

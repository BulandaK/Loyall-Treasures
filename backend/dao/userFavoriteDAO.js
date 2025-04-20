const UserFavorite = require("../models/userFavoriteModel");

class UserFavoriteDAO {
  // Pobierz ulubione zniżki użytkownika
  static async findFavoritesByUser(userId) {
    return await UserFavorite.query()
      .where("user_id", userId)
      .withGraphFetched("discount");
  }

  // Dodaj zniżkę do ulubionych
  static async addFavorite(favoriteData) {
    return await UserFavorite.query().insert(favoriteData);
  }

  // Usuń zniżkę z ulubionych
  static async removeFavorite(userId, discountId) {
    return await UserFavorite.query()
      .delete()
      .where("user_id", userId)
      .andWhere("discount_id", discountId);
  }

  // Sprawdź, czy zniżka jest w ulubionych
  static async isFavorite(userId, discountId) {
    const favorite = await UserFavorite.query()
      .where("user_id", userId)
      .andWhere("discount_id", discountId)
      .first();
    return !!favorite; // Zwraca true, jeśli istnieje, false w przeciwnym razie
  }
}

module.exports = UserFavoriteDAO;

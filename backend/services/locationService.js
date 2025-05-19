const Location = require("../models/locationModel");

class LocationService {
  static async getAllLocations() {
    try {
      return await Location.query().withGraphFetched("city");
    } catch (error) {
      throw new Error("Error fetching locations");
    }
  }

  static async getLocationById(id) {
    try {
      const location = await Location.query()
        .findById(id)
        .withGraphFetched("city");

      if (!location) {
        throw new Error("Location not found");
      }

      return location;
    } catch (error) {
      throw new Error("Error fetching location");
    }
  }

  static async createLocation(locationData) {
    try {
      const { name, address } = locationData;

      // Walidacja wymaganych pól
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new Error("Valid name is required");
      }

      if (
        !address ||
        typeof address !== "string" ||
        address.trim().length === 0
      ) {
        throw new Error("Valid address is required");
      }

      // Sprawdź czy lokalizacja o takiej nazwie już istnieje
      const existingLocation = await Location.query()
        .where("name", name.trim())
        .first();

      if (existingLocation) {
        throw new Error("Location with this name already exists");
      }

      // Przygotuj dane do wstawienia
      const data = {
        name: name.trim(),
        address: address.trim(),
        city_id: locationData.city_id || null,
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
        phone: locationData.phone || null,
        email: locationData.email || null,
        website: locationData.website || null,
        is_active:
          locationData.is_active !== undefined ? locationData.is_active : true,
      };

      return await Location.query().insert(data);
    } catch (error) {
      throw error;
    }
  }

  static async updateLocation(id, locationData) {
    try {
      const updatedLocation = await Location.query().patchAndFetchById(
        id,
        locationData
      );

      if (!updatedLocation) {
        throw new Error("Location not found");
      }

      return updatedLocation;
    } catch (error) {
      throw new Error("Error updating location");
    }
  }

  static async deleteLocation(id) {
    try {
      const rowsDeleted = await Location.query().deleteById(id);

      if (!rowsDeleted) {
        throw new Error("Location not found");
      }

      return true;
    } catch (error) {
      throw new Error("Error deleting location");
    }
  }
}

module.exports = LocationService;

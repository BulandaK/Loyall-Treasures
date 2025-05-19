const Location = require("../models/locationModel");

class LocationController {
  // Pobierz wszystkie lokalizacje
  static async getAllLocations(req, res) {
    try {
      const locations = await Location.query().withGraphFetched("city");
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching locations", error });
    }
  }

  // Pobierz lokalizację po ID
  static async getLocationById(req, res) {
    try {
      const location = await Location.query()
        .findById(req.params.id)
        .withGraphFetched("city");
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ message: "Error fetching location", error });
    }
  }

  // Dodaj nową lokalizację
  static async createLocation(req, res) {
    try {
      const { name, address } = req.body;

      // Walidacja wymaganych pól
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Valid name is required" });
      }

      if (
        !address ||
        typeof address !== "string" ||
        address.trim().length === 0
      ) {
        return res.status(400).json({ message: "Valid address is required" });
      }

      // Sprawdź czy lokalizacja o takiej nazwie już istnieje
      const existingLocation = await Location.query()
        .where("name", name.trim())
        .first();

      if (existingLocation) {
        return res
          .status(409)
          .json({ message: "Location with this name already exists" });
      }

      // Przygotuj dane do wstawienia
      const locationData = {
        name: name.trim(),
        address: address.trim(),
        city_id: req.body.city_id || null,
        latitude: req.body.latitude || null,
        longitude: req.body.longitude || null,
        phone: req.body.phone || null,
        email: req.body.email || null,
        website: req.body.website || null,
        is_active: req.body.is_active !== undefined ? req.body.is_active : true,
      };

      // Utwórz nową lokalizację
      const newLocation = await Location.query().insert(locationData);
      res.status(201).json(newLocation);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({
        message: "Error creating location",
        error: error.message,
      });
    }
  }

  // Zaktualizuj lokalizację
  static async updateLocation(req, res) {
    try {
      const updatedLocation = await Location.query().patchAndFetchById(
        req.params.id,
        req.body
      );
      if (!updatedLocation) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Error updating location", error });
    }
  }

  // Usuń lokalizację
  static async deleteLocation(req, res) {
    try {
      const rowsDeleted = await Location.query().deleteById(req.params.id);
      if (!rowsDeleted) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting location", error });
    }
  }
}

module.exports = LocationController;

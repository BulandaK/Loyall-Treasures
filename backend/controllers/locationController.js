const Location = require("../models/Location");

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
      const newLocation = await Location.query().insert(req.body);
      res.status(201).json(newLocation);
    } catch (error) {
      res.status(500).json({ message: "Error creating location", error });
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

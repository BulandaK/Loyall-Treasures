const LocationService = require("../services/locationService");

class LocationController {
  // Pobierz wszystkie lokalizacje
  static async getAllLocations(req, res) {
    try {
      const locations = await LocationService.getAllLocations();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Pobierz lokalizację po ID
  static async getLocationById(req, res) {
    try {
      const location = await LocationService.getLocationById(req.params.id);
      res.status(200).json(location);
    } catch (error) {
      if (error.message === "Location not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Dodaj nową lokalizację
  static async createLocation(req, res) {
    try {
      const newLocation = await LocationService.createLocation(req.body);
      res.status(201).json(newLocation);
    } catch (error) {
      if (
        error.message === "Valid name is required" ||
        error.message === "Valid address is required"
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Location with this name already exists") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Zaktualizuj lokalizację
  static async updateLocation(req, res) {
    try {
      const updatedLocation = await LocationService.updateLocation(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedLocation);
    } catch (error) {
      if (error.message === "Location not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // Usuń lokalizację
  static async deleteLocation(req, res) {
    try {
      await LocationService.deleteLocation(req.params.id);
      res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      if (error.message === "Location not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = LocationController;

const { Model } = require("objection");

class Location extends Model {
  static get tableName() {
    return "locations";
  }

  static get idColumn() {
    return "location_id";
  }

  static get relationMappings() {
    const City = require("./cityModel");
    const Discount = require("./discountModel");

    return {
      city: {
        relation: Model.BelongsToOneRelation,
        modelClass: City,
        join: {
          from: "locations.city_id",
          to: "cities.city_id",
        },
      },
      discounts: {
        relation: Model.HasManyRelation,
        modelClass: Discount,
        join: {
          from: "locations.location_id",
          to: "discounts.location_id",
        },
      },
    };
  }
}

module.exports = Location;

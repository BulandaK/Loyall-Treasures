const { Model } = require("objection");

class City extends Model {
  static get tableName() {
    return "cities";
  }

  static get idColumn() {
    return "city_id";
  }

  static get relationMappings() {
    const Location = require("./Location");

    return {
      locations: {
        relation: Model.HasManyRelation,
        modelClass: Location,
        join: {
          from: "cities.city_id",
          to: "locations.city_id",
        },
      },
    };
  }
}

module.exports = City;

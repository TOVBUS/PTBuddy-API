const { Model, DataTypes } = require('sequelize');

class Activity extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        activityTitle: DataTypes.STRING,
        proTip: DataTypes.TEXT,
        howTo: DataTypes.TEXT,
        primaryMuscleGroups: DataTypes.STRING,
        muscleImageURL: DataTypes.STRING,
        equipment: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Activity',
        tableName: 'activities',
        timestamps: true,
      }
    );
  }
}

module.exports = Activity;

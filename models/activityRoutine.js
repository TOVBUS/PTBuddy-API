const { Model, DataTypes } = require('sequelize');

class ActivityRoutine extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: DataTypes.STRING,
        week: DataTypes.INTEGER,
        day: DataTypes.STRING,
        exerciseTitle: DataTypes.STRING,
        exerciseName: DataTypes.STRING,
        reps: DataTypes.STRING,
        sets: DataTypes.STRING,
        weight: DataTypes.STRING,
        duration: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'ActivityRoutine',
        tableName: 'activity_routines',
        timestamps: true,
      }
    );
  }
}

module.exports = ActivityRoutine;

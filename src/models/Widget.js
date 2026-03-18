module.exports = (sequelize, DataTypes) => {
  const Widget = sequelize.define('Widget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'lamp', 'socket', 'humidity', 'motion', 
        'power', 'battery', 'lock'
      ),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    default_settings: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
      get() {
        const value = this.getDataValue('default_settings');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('default_settings', JSON.stringify(value));
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'widgets'
  });

  return Widget;
};
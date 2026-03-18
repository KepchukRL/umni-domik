module.exports = (sequelize, DataTypes) => {
  const UserWidget = sequelize.define('UserWidget', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    widget_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'widgets',
        key: 'id'
      }
    },
    custom_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    settings: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
      get() {
        const value = this.getDataValue('settings');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('settings', JSON.stringify(value));
      }
    },
    room: {
      type: DataTypes.STRING(50),
      defaultValue: 'general'
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'user_widgets'
  });

  return UserWidget;
};
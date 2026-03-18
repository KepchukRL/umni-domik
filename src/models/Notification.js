module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'alert'),
      defaultValue: 'info'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('data');
        return value ? JSON.parse(value) : null;
      },
      set(value) {
        this.setDataValue('data', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'notifications'
  });

  return Notification;
};
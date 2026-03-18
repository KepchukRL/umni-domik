module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        is: /^[А-Яа-яA-Za-z]+$/i
      }
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        is: /^[А-Яа-яA-Za-z]+$/i
      }
    },
    middle_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        is: /^[А-Яа-яA-Za-z]*$/i
      }
    },
    phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      validate: {
        is: /^(\+7|8)[0-9]{10}$/
      }
    },
    individual_key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });

  return User;
};
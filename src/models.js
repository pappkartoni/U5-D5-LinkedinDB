import {DataTypes} from "sequelize"
import sequelize from "./db.js"

export const UsersModel = sequelize.define(
    "user", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export const ExperiencesModel = sequelize.define(
    "experience", {
    experience_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export const PostsModel = sequelize.define(
    "post", {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    },
})

UsersModel.hasMany(ExperiencesModel, {foreignKey: {name: "user_id", allowNull: false}, onDelete: "CASCADE"})
ExperiencesModel.belongsTo(UsersModel, {foreignKey: {name: "user_id", allowNull: false}})

UsersModel.hasMany(PostsModel, {foreignKey: {name: "user_id", allowNull: false}, onDelete: "CASCADE"})
PostsModel.belongsTo(UsersModel, {foreignKey: {name: "user_id", allowNull: false}})
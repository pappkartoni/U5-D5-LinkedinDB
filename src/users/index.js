import express from "express"
import createHTTPError from "http-errors"
import {Op} from "sequelize"
import { ExperiencesModel, PostsModel, UsersModel } from "../models.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
    try {
        const {user_id} = await UsersModel.create(req.body)
        res.status(201).send({user_id})
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/", async (req, res, next) => {
    try {
/*         const query = {}

        if (req.query.min && req.query.max) query.price = {[Op.between]: [req.query.min, req.query.max]}
        if (req.query.cat) query.category = {[Op.iLike]: `%${req.query.cat}%`}
        const users = await UsersModel.findAndCountAll({
            where: {
                ...query,
                ...(req.query.search && {[Op.or]: [{name: {[Op.iLike]: `%${req.query.search}%`}}, {description: {[Op.iLike]: `%${req.query.search}%`}}]})
            },
            include: [
                {model: CategoriesModel, attributes: ["name"], through: {attributes: []}},
                {model: ReviewsModel, attributes: ["userId", "content"], 
                    include: {model: UsersModel, attributes: ["firstname", "lastname"]}
                }
            ],
            ...(req.query.limit && {limit: req.query.limit}), // unnecessarily complicated, i don't think limit: null breaks anything
            ...(req.query.offset && {offset: req.query.offset}),
            order: [(req.query.orderby ? [req.query.orderby, (req.query.dir ? req.query.dir.toUpperCase() : "ASC")] : ["userId", (req.query.dir ? req.query.dir.toUpperCase() : "ASC")])]
        }) */
        const users = await UsersModel.findAll({
            attributes: ['name', 'surname']
        })
        res.send(users)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:userId", async (req, res, next) => {
    try {
        const user = await UsersModel.findByPk(req.params.userId, {attributes: {exclude: ["createdAt", "updatedAt"]},
        include: [
            { model: ExperiencesModel, attributes: ["role", "company", "start_date", "end_date"] },
            { model: PostsModel, attributes: ["post_id", "text", "image"] },
        ]})
        if (user) {
            res.send(user)
        } else {
            next(createHTTPError(404, `No user found with ID ${req.params.userId}`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/:userId", async (req, res, next) => {
    try {
        const [num, updated] = await UsersModel.update(req.body, {where: {user_id: req.params.userId}, returning: true})
        if (num === 1) {
            res.send(updated[0])
        } else {
            next(createHTTPError(404, `No user found with ID ${req.params.userId}`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:userId", async (req, res, next) => {
    try {
        const num = await UsersModel.destroy({where: {user_id: req.params.userId}})
        if (num === 1) {
            res.status(204).send()
        } else {
            next(createHTTPError(404, `No user found with ID ${req.params.userId}`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/:userId/experiences", async (req, res, next) => {
    try {
        const {experience_id} = await ExperiencesModel.create({...req.body, user_id: req.params.userId})
        res.status(201).send({experience_id})
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:userId/experiences", async (req, res, next) => {
    try {
        const experiences = await ExperiencesModel.findAll({
            where: {user_id: req.params.userId}
        })
        res.send(experiences)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const exp = await ExperiencesModel.findByPk(req.params.expId, {attributes: {exclude: ["createdAt", "updatedAt"]}})
        if (exp) {
            res.send(exp)
        } else {
            next(createHTTPError(404, `No experience found with ID ${req.params.expId}`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const [num, updated] = await ExperiencesModel.update(req.body, {where: {experience_id: req.params.expId}, returning: true})
        if (num === 1) {
            res.send(updated[0])
        } else {
            next(createHTTPError(404, `No experience found with ID ${req.params.expId}`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:userId/experiences/:expId", async (req, res, next) => {
    try {
        const num = await ExperiencesModel.destroy({where: {experience_id: req.params.expId}})
        if (num === 1) {
            res.status(204).send()
        } else {
            next(createHTTPError(404, `No experience found with ID ${req.params.expId}`))
        }
    } catch (error) {
        next(error)
    }
})

export default usersRouter
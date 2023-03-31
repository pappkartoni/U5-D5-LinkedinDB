import express from "express"
import createHTTPError from "http-errors"
import {Op} from "sequelize"
import { PostsModel, UsersModel } from "../models.js"

const postsRouter = express.Router()

postsRouter.post("/", async (req, res, next) => {
    try {
        const {post_id} = await PostsModel.create(req.body)
        res.status(201).send({post_id})
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/", async (req, res, next) => {
    try {
        const posts = await PostsModel.findAll({
            attributes: ['text', 'image'],
            include: [{ model: UsersModel, attributes: ["name", "surname"] }]
        })
        res.send(posts)
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/by/:postId", async (req, res, next) => {
    try {
        const posts = await PostsModel.findAll({
            attributes: ['text', 'image'],
            where: {posts_id: req.params.postId}
        })
        res.send(posts)
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/:postId", async (req, res, next) => {
    try {
        const post = await PostsModel.findByPk(req.params.postId, {attributes: {exclude: ["createdAt", "updatedAt"]},
        include: [{ model: UsersModel, attributes: ["name", "surname"] }]})
        if (post) {
            res.send(post)
        } else {
            next(createHTTPError(404, `No post found with ID ${req.params.postId}`))
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.put("/:postId", async (req, res, next) => {
    try {
        const [num, updated] = await PostsModel.update(req.body, {where: {post_id: req.params.postId}, returning: true})
        if (num === 1) {
            res.send(updated[0])
        } else {
            next(createHTTPError(404, `No post found with ID ${req.params.postId}`))
        }
    } catch (error) {
        next(error)
    }
})

postsRouter.delete("/:postId", async (req, res, next) => {
    try {
        const num = await PostsModel.destroy({where: {post_id: req.params.postId}})
        if (num === 1) {
            res.status(204).send()
        } else {
            next(createHTTPError(404, `No post found with ID ${req.params.postId}`))
        }
    } catch (error) {
        next(error)
    }
})

export default postsRouter
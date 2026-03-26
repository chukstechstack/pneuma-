import express from "express";
import { getTask, createTask, patchTask, deleteTask } from "../Controllers/taskControllers.js";

const  router = express.Router();

router.get("/", getTask);//get
router.post("/", createTask); //post
router.patch("/:id", patchTask) //patch
router.delete("/:id", deleteTask) //delete

export default  router ;
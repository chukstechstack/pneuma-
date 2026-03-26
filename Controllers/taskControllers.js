import pool from "../config/db.js"

const createTask = (req, res) => {
    
res.send("Create created")
}

const getTask = (req, res) => {
    res.send("get task created")
}

const patchTask = (req, res) => {
     res.send("patch task created")
}

const deleteTask = (req, res) => {
 res.send("get task created")
}

export {createTask, getTask, deleteTask, patchTask }

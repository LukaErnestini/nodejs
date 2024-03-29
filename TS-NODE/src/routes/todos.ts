import { Router } from "express";

import { Todo } from "../models/todo";

type RequestBody = { text: string };

let todos: Todo[] = [];

const router = Router();

router.get("/", (req, res, next) => {
  res.json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);
  return res.json({ message: "Successfully added todo.", todo: newTodo });
});

router.put("/todo/:todoId", (req, res, next) => {
  const body = req.body as RequestBody;
  const tId = req.params.todoId;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tId);
  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: todos[todoIndex].id,
      text: body.text,
    };
    return res.json({ message: "Updated todo" });
  }
  res
    .status(404)
    .json({ message: "Could not find todo.", todo: todos[todoIndex] });
});

router.delete("/todo/:todoId", (req, res, next) => {
  todos = todos.filter((todoItem) => todoItem.id !== req.params.todoId);
  res.json({ message: "Deleted todo." });
});

export default router;

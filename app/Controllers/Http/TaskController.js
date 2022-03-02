"use strict";
const Task = use("App/Models/Task");
const { validateAll } = use("Validator");
class TaskController {
  async index({ view }) {
    const tasks = await Task.all();

    return view.render("tasks", {
      title: "Latest tasks",
      tasks: tasks.toJSON(),
    });
  }

  async store({ request, response, session }) {
    const message = {
      "title.required": "Title is required",
      "title.min": "Title of having at least 5 catacharacters",
      "title.max": "Title of having at maximum 140 catacharacters",
      "body.required": "Body is required",
      "body.min": "Body of having at least 10 catacharacters",
    };
    const validation = await validateAll(
      request.all(),
      {
        title: "required|min:5|max:140",
        body: "required|min:10",
      },
      message
    );

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }

    const task = new Task();

    task.title = request.input("title");
    task.body = request.input("body");

    await task.save();

    session.flash({ notification: `Task ( ${task.title} ) added!` });

    return response.redirect("/tasks");
  }

  async show({ params, view }) {
    const task = await Task.find(params.id);

    return view.render("detail", {
      task: task,
    });
  }

  async edit({ params, view }) {
    const task = await Task.find(params.id);

    return view.render("edit", {
      task: task,
    });
  }

  async update({ params, request, response, session }) {
    const task = await Task.find(params.id);
    const data = request.only(["title", "body"]);

    task.merge(data);
    await task.save();

    return response.redirect("/tasks");
  }

  async destroy({ params, response, session }) {
    const task = await Task.find(params.id);

    await task.delete();

    session.flash({ notification: `Task ( ${task.title} ) deleted! ` });

    return response.redirect("/tasks");
  }
}

module.exports = TaskController;

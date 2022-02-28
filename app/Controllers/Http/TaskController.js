"use strict";

class TaskController {
  tasks = [
    { title: "Task one", body: "This is task one" },
    { title: "Task two", body: "This is task two" },
  ];
  index({ view }) {
    return view.render("task", {
      title: "Your tasks",
      tasks: this.tasks,
    });
  }
}

module.exports = TaskController;

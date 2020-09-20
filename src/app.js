const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { body: { url, title, techs } } = request;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {
    body: { url, title, techs },
    params: { id }
  } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found" });
  }

  const updatedRepo = {
    ...repositories[repositoryIndex],
    url,
    title,
    techs,
  };

  repositories[repositoryIndex] = updatedRepo;

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { params: { id } } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const {
    params: { id }
  } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Repository not found" });
  }

  const updatedRepo = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  };

  repositories[repositoryIndex] = updatedRepo;

  return response.json(updatedRepo);

});

module.exports = app;

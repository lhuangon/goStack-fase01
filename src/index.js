const express = require('express'); 
const cors = require('cors');
const {uuid, isUuid} = require('uuidv4'); //Criando um id temporario 

const app = express();

app.use(cors());
app.use(express.json());

const projects = [];

function logResquest(request, response, next) {
  const {method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();// Próximo middlewares
}

function validateProjectId(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'invalid project ID'});
  }
  
  return next();
}

app.use(logResquest); //Aqui eu uso o logResquest para todo os metódos
app.use('/projects/:id', validateProjectId); //Outro metódo de usar o middleware (usando em todos os camninhos '/projects...)

app.get('/projects', (request, response) => {
 const {title} = request.query;

 //filtra no project o title caso acha a palavra react retorna o 
 //project e armazena em result
 const results = title 
 ? projects.filter(project => project.title.includes(title))
 : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const {title, owner} = request.body;

  const project = { id: uuid(), title, owner};

  projects.push(project);

  return response.json(project)
});

app.put('/projects/:id',  (request, response) => {
  const {id} = request.params;
  const {title, owner} = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found'})
  }

  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project;

  return response.json(project)
})

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3000, () => {
  console.log('Back-end started!');
});

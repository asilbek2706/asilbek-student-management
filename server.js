const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/students', (req, res, next) => {
  if (req.body && (req.body.id === undefined || req.body.id === null || req.body.id === '')) {
    const students = router.db.get('students').value();
    const numericIds = students
      .map((student) => Number(student.id))
      .filter((id) => Number.isFinite(id));
    req.body.id = numericIds.length ? Math.max(...numericIds) + 1 : 1;
  } else if (req.body && typeof req.body.id === 'string' && /^\d+$/.test(req.body.id)) {
    req.body.id = Number(req.body.id);
  }

  next();
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
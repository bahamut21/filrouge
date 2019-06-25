const { Router } = require('express');

const router = Router();

const bodyParser = require('body-parser');
const connection = require('../conf');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));


// GET - Récupération de l'ensemble des données de ta table
// from student table
// Un filtre "supérieur à ..." (ex: date supérieure à 18/10/2010)
router.get('/student', (request, response) => {
  connection.query('SELECT * from student', (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.json(results);
    }
  });
});


// GET (light) - Récupération de quelques champs spécifiques (id, names, dates, etc...)
router.get('/school/infos', (request, response) => {
  connection.query('SELECT id, city from school', (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.json(results);
    }
  });
});

// GET - Récupération d'un ensemble de données en fonction de certains filtres :
// Un filtre "contient ..." (ex: nom contenant la chaîne de caractère 'bor')
// Un filtre "commence par ..." (ex: nom commençant par 'campus')
router.get('/school', (request, response) => {
  if (request.query.city) {
    // filter by city name
    // GET - Récupération de données ordonnées (ascendant, descendant)
    const cityQuery = request.query.city;
    connection.query("SELECT id, city from school WHERE city LIKE '%' ? '%'", cityQuery, (error, results) => {
      if (error) {
        response.sendStatus(500);
      } else {
        response.json(results);
      }
    });
  } else if (request.query.language) {
    // filter by language name
    const languageQuery = request.query.language;
    connection.query("SELECT id, city from school WHERE city LIKE ? '%'", languageQuery, (error, results) => {
      if (error) {
        response.sendStatus(500);
      } else {
        response.json(results);
      }
    });
  } else if (request.query.level) {
    // filter by language name
    const levelQuery = request.query.level;
    connection.query('SELECT id, city, level from school WHERE level < ?', levelQuery, (error, results) => {
      if (error) {
        response.sendStatus(500);
      } else {
        response.json(results);
      }
    });
  } else {
    // All informations from school table
    connection.query('SELECT * from school', (error, results) => {
      if (error) {
        response.sendStatus(500);
      } else {
        response.json(results);
      }
    });
  }
});

// POST - Sauvegarde d'une nouvelle entité
router.post('/student', (request, response) => {
  const formData = request.body;
  connection.query('INSERT INTO student SET ?', formData, (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.sendStatus(201);
    }
  });
});

// PUT - Modification d'une entité
router.put('/student/:id', (request, response) => {
  const formData = request.body;
  const idParam = request.params.id;
  connection.query('UPDATE student SET ? WHERE id=?', [formData, idParam], (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.sendStatus(202);
    }
  });
});

// PUT - Toggle du booléen
router.put('/student/:id/inproject', (request, response) => {
  const idParam = request.params.id;
  connection.query('UPDATE student SET inproject = not inproject WHERE id=?', [idParam], (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.sendStatus(202);
    }
  });
});

// DELETE - Suppression d'une entité
router.delete('/student/:id', (request, response) => {
  const idParam = request.params.id;
  connection.query('DELETE FROM student WHERE id = ?', idParam, (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.sendStatus(202);
    }
  });
});

// DELETE - Suppression de toutes les entités dont le booléen est false
router.delete('/student/inproject', (request, response) => {
  const inprojectQuery = request.query.inproject;
  connection.query('DELETE FROM student WHERE ? = 0', inprojectQuery, (error, results) => {
    if (error) {
      response.sendStatus(500);
    } else {
      response.sendStatus(202);
    }
  });
});

module.exports = router;

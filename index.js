const express                     = require('express')
const app                         = express()
const port                        = 3000
const { body, validationResult }  = require('express-validator');
const mysql                       = require('mysql')
const connection                  = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database  : 'yukija'
})
const bodyParser  = require('body-parser')

app.use(bodyParser.json());

app.post('/api/v1/register', 
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('name').not().isEmpty(),
  body('birth').not().isEmpty(),
  (req, res) => {
    const errors  = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    connection.connect()
    connection.query(`INSERT INTO user (email, password, name, birth) VALUE ('${req.body.email}', '${req.body.password}', '${req.body.name}', '${req.body.birth}')`, function (err, result) {
      if (err) {
        res.status(500).json({
          error : err
        })
      } else {
        res.status(200)
      }
    })
    connection.end();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
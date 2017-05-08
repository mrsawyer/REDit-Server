const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

import { pool } from '../app';

module.exports = function(router) {

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query(`SELECT * FROM users WHERE username='${username}' AND password= crypt('${password}', password);`).then((user) => {
      if(user && user.rows.length) {

        // MAKE A STATELESS SESSION
        const session = {
          user_email: user.rows[0].username
        }

        const JWT = jwt.sign(session, 'fvjiuo4t389vnifd');

        console.log(JWT);


        res.status(200).cookie('redit_session', JWT, {
          secure: false,
          maxAge: 7200000,
          httpOnly: true
        }).send('yayyyy, you are a success!');

      }else {
        res.status(403).send('NOT TODAYYY');
      }
    }).catch((err) => {
      res.status(500).send();
    })
  })

  router.get('/logout', (req, res) => {
    const { username, password } = req.body;
    client.query(`SELECT * FROM users WHERE username='${username}' AND password= crypt('${password}', password);`, (err, user) => {
      if(user.rows.length) return res.status(200).send();
      return res.status(403).send('Invalid');
    });
  });

  return router;
}

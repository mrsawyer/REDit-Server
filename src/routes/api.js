const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

import { pool } from '../app';

module.exports = function(router) {

  router.get('/weeks', (req, res) => {
    if(!req.cookies.redit_session) {
      return res.status(403).send();
    }
    const session = jwt.decode(req.cookies.redit_session);
    console.log(session);

    pool.query(`SELECT * FROM users WHERE username='${session.user_email}';`).then((user) => {
      console.log(user.rows);
      if(user && user.rows.length){
        pool.query('SELECT * FROM weeks', (err, weeks) => {
          if(err) return res.status(500).send();
          pool.query('SELECT * FROM lessons', (err, lessons) => {
            const response = weeks.rows.map(week => {
              return {
                title: week.title,
                lessons: lessons.rows.filter(lesson => lesson.week_id === week.id)
              }
            });
            res.status(200).send(response);
          });
        });
      }else {
        console.log('ohhh noooo')
        return res.status(403).send();
      }
    });
  });

  router.get('/lessons/:lesson_id/posts', (req, res) => {
    pool.query(`SELECT * FROM posts p
                WHERE ${req.params.lesson_id} = p.lesson_id`, (err, posts) => {
      if(err) return res.status(500).send();
      console.log(posts.rows);
      pool.query(`SELECT t.tag, pt.post_id FROM tags t INNER JOIN posttags pt
                  ON t.id = pt.tag_id`, (err, tags) => {
        const response = posts.rows.map(post => {
          console.log(tags.rows)
          return {
            title: post.title,
            votes: post.votes,
            id: post.id,
            description: post.description,
            tags: tags.rows.filter(tag => tag.post_id === post.id)
          }
        });
        res.status(200).send(response);
      });
    })
  })
  return router;
}

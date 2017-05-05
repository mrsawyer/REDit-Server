const path = require('path');
const fs = require('fs');
import { pool } from '../app';

module.exports = function(router) {

  router.get('/weeks', (req, res) => {
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
  })

  router.get('/lessons/:lesson_id/posts', (req, res) => {
    console.log(req.params.lesson_id);
    pool.query(`SELECT * FROM posts p INNER JOIN lessons l
                ON p.lesson_id = l.id
                WHERE ${req.params.lesson_id} = p.lesson_id`, (err, posts) => {
      if(err) return res.status(500).send();
      pool.query(`SELECT * FROM tags t INNER JOIN posttags pt
                  ON pt.tag_id = t.id`, (err, tags) => {
                  console.log(tags);
        const response = posts.rows.map(post => {
          return {
            title: post.title,
            votes: post.votes,
            id: post.id,
            description: post.description,
            tags: tags.rows.filter(tag => tag.id === week.id)
          }
        });
        res.status(200).send(response);
      });


      //return res.status(200).json(posts.rows);
    })
  })

  return router;

}

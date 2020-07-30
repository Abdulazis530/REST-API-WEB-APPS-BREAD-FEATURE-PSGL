var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {
  router.get('/', function (req, res, next) {
    db.query('SELECT*FROM bread', (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rows)
    })

  })

  router.post('/', function (req, res, next) {
    db.query('INSERT INTO bread (string_data,integer_data,float_data,date_data,boolean_data) values ($1,$2,$3,$4,$5)',[req.body.string,Number(req.body.integer),Number(req.body.float),req.body.date,req.body.bool], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })

  router.put('/:id', function (req, res, next) {
    db.query('UPDATE bread SET string_data =$1, integer_data=$2, float_data=$3, date_data=$4, boolean_data=$5 WHERE bread_id =$6',[req.body.string,Number(req.body.integer),Number(req.body.float),req.body.date,req.body.bool,Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })

  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM bread WHERE bread_id =$1',[Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })
  return router;
}
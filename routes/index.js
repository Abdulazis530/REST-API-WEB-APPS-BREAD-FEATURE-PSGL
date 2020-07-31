var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {


  router.get('/', function (req, res, next) {
    let currPage = req.query.page || 1
    const limit = 5
      db.query('SELECT COUNT(*) as total FROM bread', (err, data1) => {
        if (err) return res.status(500).json({ err })
        
        db.query(`SELECT*FROM bread LIMIT ${limit} OFFSET ${(currPage * limit) - limit}`, (err, data2) => {
          if (err) return res.status(500).json({ err })
          const totalData=data1.rows[0].total
          console.log(totalData)
          const totalPage=Math.ceil(totalData/limit)
          let list=data2.rows

          res.json({totalPage,list,currPage})
        
          // res.json(data2,data1)
        })
       
        // console.log(data.rows)
      })
    


  })

  router.post('/', function (req, res, next) {
    db.query('INSERT INTO bread (string_data,integer_data,float_data,date_data,boolean_data) values ($1,$2,$3,$4,$5)', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, req.body.bool], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })

  router.put('/:id', function (req, res, next) {
    db.query('UPDATE bread SET string_data =$1, integer_data=$2, float_data=$3, date_data=$4, boolean_data=$5 WHERE bread_id =$6', [req.body.string, Number(req.body.integer), Number(req.body.float), req.body.date, req.body.bool, Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })

  router.delete('/:id', function (req, res, next) {
    db.query('DELETE FROM bread WHERE bread_id =$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.status(500).json({ err })
      res.json(data.rowCount)
    })

  })
  return router;
}
var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = (db) => {

  let conditionSql = []
  let conditionParam = []
  router.get('/', function (req, res, next) {

    const limit = 5

    if (req.query.fiturBrowser === "yes" || req.query.pageBrowse) {
      let currPageBrowse = req.query.pageBrowse || 1

      let counter = 1

      for (let key in req.query) {
        if (key !== "clicked") {
          if (key === "id") {
            conditionSql.push(`bread_id=$${counter}`)
            conditionParam.push(Number(req.query.id))
            counter++

          }
          if (key === "string") {
            conditionSql.push(`string_data LIKE $${counter}`)
            conditionParam.push(req.query.string)
            counter++

          }
          if (key === "integer") {
            conditionSql.push(`integer_data=$${counter}`)
            conditionParam.push(Number(req.query.integer))
            counter++

          }
          if (key === "float") {
            conditionSql.push(`float_data=$${counter}`)
            conditionParam.push(Number(req.query.float))
            counter++

          }
          if (key === "stardate") {
            conditionSql.push(`(date_data BETWEEN $${counter} AND $${counter + 1})`)
            conditionParam.push(req.query.stardate, req.query.enddate)
            counter += 2

          }
          if (key === "bool") {
            conditionSql.push(`boolean_data=$${counter}`)
            conditionParam.push(req.query.bool)
            counter++

          }

        }
      }

      const sqlQuery = conditionSql.join(" OR ")

      db.query(`SELECT COUNT(*) as total FROM bread WHERE ${sqlQuery};`, conditionParam, (err, data1) => {
        if (err) {
          return res.status(500).json({ err })
        }

        conditionParam.push(limit, (currPageBrowse * limit - limit))

        db.query(`SELECT*FROM bread WHERE ${sqlQuery} ORDER BY bread_id LIMIT $${counter} OFFSET $${counter + 1} `, conditionParam, (err, data2) => {
          conditionParam = []
          conditionSql = []
          if (err) return res.status(500).json({ err })
          const totalData = data1.rows[0].total

          const totalPageBrowse = Math.ceil(totalData / limit)
          let listBrowse = data2.rows
          let fiturBrowser = req.query.fiturBrowser

          res.json({ totalPageBrowse, listBrowse, currPageBrowse, fiturBrowser })


        })

      })

    } else {
      let currPage = req.query.page || 1
      db.query('SELECT COUNT(*) as total FROM bread ', (err, data1) => {
        if (err) return res.status(500).json({ err })

        db.query(`SELECT*FROM bread ORDER BY bread_id LIMIT $1 OFFSET $2 `, [limit, ((currPage * limit) - limit)], (err, data2) => {
          if (err) return res.status(500).json({ err })
          const totalData = data1.rows[0].total

          const totalPage = Math.ceil(totalData / limit)
          let list = data2.rows
          if (currPage > totalPage) {
            res.json({ error: "error" })
          }
          res.json({ totalPage, list, currPage })


        })


      })

    }

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
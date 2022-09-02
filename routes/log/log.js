const express = require("express");
const db = require("../../util/db.config");
const route = express.Router();

route.get("/", async (req, res, next) => {
  await db.query("SELECT * FROM log", function (err, result, fields) {
    if (err) {
      console.log(err);
      res.send({ err: true, status: false, message: err });
    } else {
      const json = {
        err: false,
        status: result.length == 0 ? false : true,
        message: result,
      };
      res.send(json);
    }
  });
});

route.get("/id/:id", async (req, res, next) => {
  const id = req.params.id;
  await db.query(
    `SELECT * FROM log where id = ${id}`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: false,
          status: result.length == 0 ? false : true,
          message: result,
        };
        res.send(json);
      }
    }
  );
});

route.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  await db.query(
    `DELETE FROM log WHERE id = ${id}`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: result.affectedRows != 0 ? false : true,
          status: result.affectedRows != 0 ? true : false,
          message: result.affectedRows != 0 ? "Delete Success" : "Delete Error",
        };

        res.send(json);
      }
    }
  );
});

route.get("/mac/:deviceAddress", async (req, res, next) => {
  const deviceAddress = req.params.deviceAddress;
  await db.query(
    `SELECT * FROM log where deviceAddress = '${deviceAddress}'`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: false,
          status: result.length == 0 ? false : true,
          message: result,
        };
        res.send(json);
      }
    }
  );
});

// now
route.post("/addlogs", async (req, res, next) => {
  const pm1 = req.body.pm1;
  const pm25 = req.body.pm25;
  const pm10 = req.body.pm10;
  const temperature = req.body.temperature;
  const deviceAddress = req.body.deviceAddress;
  const dateAt = req.body.dateAt;
  const timeAt = req.body.timeAt;

  await db.query(
    "INSERT INTO log(pm1, pm25, pm10, temperature, deviceAddress, dateAt) VALUES (?, ?, ?, ?, ?, ?)",
    [pm1, pm25, pm10, temperature, deviceAddress, dateAt, timeAt],
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: result.affectedRows != 0 ? false : true,
          status: result.affectedRows != 0 ? true : false,
          message:
            result.affectedRows != 0
              ? {
                  message: "Insert Success",
                  id: result.insertId,
                }
              : {
                  message: "Insert Error",
                  id: null,
                },
        };
        res.send(json);
      }
    }
  );
});

// retroact
route.post("/addlogsretroact", async (req, res, next) => {
  const pm1 = req.body.pm1;
  const pm25 = req.body.pm25;
  const pm10 = req.body.pm10;
  const temperature = req.body.temperature;
  const deviceAddress = req.body.deviceAddress;
  const dateAt = req.body.dateAt;
  const timeAt = req.body.timeAt;
  await db.query(
    "INSERT INTO log(pm1, pm25, pm10, temperature, deviceAddress, dateAt, timeAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [pm1, pm25, pm10, temperature, deviceAddress, dateAt, timeAt],
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: result.affectedRows != 0 ? false : true,
          status: result.affectedRows != 0 ? true : false,
          message:
            result.affectedRows != 0
              ? {
                  message: "Insert Success",
                  id: result.insertId,
                }
              : {
                  message: "Insert Error",
                  id: null,
                },
        };
        res.send(json);
      }
    }
  );
});

route.get("/datalog/date/:deviceAddress/:dateAt", async (req, res, next) => {
  const deviceAddress = req.params.deviceAddress;
  const dateAt = req.params.dateAt;
  await db.query(
    `SELECT * FROM log WHERE deviceAddress='${deviceAddress}' AND dateAt = '${dateAt}' ORDER BY timeAt ASC`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        var data = [];
        result.map(data => {
          console.log(data.timeAt);
        })
        const json = {
          err: false,
          status: result.length == 0 ? false : true,
          type: "DAY",
          message: result,
        };
        res.send(json);
      }
    }
  );
});

route.get("/datalog/month/:deviceAddress/:year/:month", async (req, res, next) => {
  const deviceAddress = req.params.deviceAddress;
  const year = req.params.year;
  const month = req.params.month;
  await db.query(
    `SELECT *,avg(pm1) as avg_pm1,avg(pm25) as avg_pm25,avg(pm10) as avg_pm10 FROM log WHERE deviceAddress='${deviceAddress}' AND MONTH(dateAt) = '${month}' and YEAR(dateAt) = '${year}' group by dateAt `,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: false,
          status: result.length == 0 ? false : true,
          type: "MONTH",
          message: result,
        };
        res.send(json);
      }
    }
  );
});


route.get("/datalog/rangedate/:deviceAddress/:dateAt1/:dateAt2", async (req, res, next) => {
  const deviceAddress = req.params.deviceAddress;
  const dateAt1 = req.params.dateAt1;
  const dateAt2 = req.params.dateAt2;
  
  await db.query(
    `SELECT *,avg(pm1) as avg_pm1,avg(pm25) as avg_pm25,avg(pm10) as avg_pm10 FROM log WHERE deviceAddress='${deviceAddress}' AND dateAt >= '${dateAt1}' AND dateAt <= '${dateAt2}' group by dateAt`,
    function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send({ err: true, status: false, message: err });
      } else {
        const json = {
          err: false,
          status: result.length == 0 ? false : true,
          type: "RANGE",
          message: result,
        };
        res.send(json);
      }
    }
  );
});

// route.get('/:user_id', async (req, res, next) => {
//     const user_id = req.params.user_id;
//     await db.query("SELECT * FROM config_tb WHERE user_id = ?",
//     [user_id], function (err, result, fields) {
//         if (err) {
//             console.log(err);
//             res.send({ err: true, status: false, message: err });
//         } else {
//             const json = { err: false, status: (result.length == 0 ? false : true), message: result };
//             res.send(json);
//         }
//     });
// });

module.exports = route;

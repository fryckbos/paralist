const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const axios = require('axios');
var dateFormat = require('dateformat');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/site/', (req, res) => {
  const id = req.query.id;
  res.setHeader('Content-Type', 'application/json');
  if (id) {
    const site = axios.get(`https://paragliding.earth/assets/ajax/siteModalJSON.php?id=${id}`);
    const forecast = axios.get(`https://paragliding.earth/assets/ajax/flyable/forecasts/${id}.json`);

    Promise.all([site, forecast])
        .then(values => {
            sr = values[0];
            fr = values[1];

            result = {};
            if (sr.data.result == 1) {
                result["site"] = {
                    "id": sr.data.body.id,
                    "name": sr.data.body.name,
                    "lng": sr.data.body.lng,
                    "lat":sr.data.body.lat,
                    "orientation":`https://paraglidingearth.com/assets/img/windrose/26/${sr.data.body.id}.png`
                };
            }
            
            fc_result = [];

            const today = dateFormat(new Date(), "isoDate");
            let oldData = true;
            let lastDate = null;
            let day = -1;

            Object.keys(fr.data.forecasts).sort().forEach(key => {
                const date = key.substr(0, 10);
                    if (date == today) {
                        oldData = oldData & false;
                    }
                    if (!oldData) {
                        if (date != lastDate) {
                            day += 1;
                            fc_result.push([]);
                        }
                        if (key.includes("T08") || key.includes("T11") || key.includes("T14") || key.includes("T17")) {
                            fc_result[day].push(fr.data.forecasts[key].flyability);
                        }
                    }
                    lastDate = date;
            });

            result["forecast"] = fc_result.slice(0, 5);
            res.json(result);
        })
        .catch(errors => {
            console.log(errors);
            res.json({ success: false, "msg": errors});
        })
  } else {
      res.json({ "success": false, "msg": "No id provided"});
  }
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

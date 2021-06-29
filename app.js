const express = require('express');
const port = process.env.PORT || 8000

var requests = require('requests');
const app = express();

app.use(express.static('./views/files'))

app.set("view engine", "pug");
app.set("views", "./views");

app.get('/', (req, res) => {
    res.render('form')
})

app.get('/update', (req, res) => {
        const city = req.query.city;

        requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7887abbc0243c818fd5a184b1991ffcb`)
            .on('data', function(chunk) {
                const obj = JSON.parse(chunk);
                if (obj.message == "city not found") {
                    res.redirect('/')
                } else {
                    const date = new Date();
                    const head = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
                    const time = (date.getHours() + ":" + date.getMinutes());

                    res.render('first', {
                        head: head,
                        temp: obj.main.temp,
                        time: time,
                        name: obj.name,
                        main: obj.weather[0].main,
                        country: obj.sys.country,
                        max: obj.main.temp_max,
                        min: obj.main.temp_min,





                    })
                }
            })

        .on('end', function(err) {
            if (err) return console.log('connection closed due to errors', err);

            console.log('end');
        });
    }

)

app.listen(port, () => {
    console.log("app is running")
})
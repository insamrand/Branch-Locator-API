const express = require('express');
const jwt = require('jsonwebtoken');
const key = require("./key");

const app = express();

const hard_username = 'a';
const hard_password = 'pass';
const localPort = '3000';


let validateToken = (payload) => {
    return payload === hard_password + hard_username
}

let validateUser = (username, password) => {
    return username === 'a' && password === 'pass';
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json())
app.use((req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, key.tokenKey, (err, payload) => {
            console.log('Payload', payload)
            if (validateToken(payload)) {
                req.isTokenExist = true;
                next();
            } else {
                next()
            }
        })
    } catch (e) {
        next()
    }
})

app.post('/api/auth/signin', function (req, res) {

    let username = req.body.username;
    let password = req.body.password;

    if (validateUser(username, password)) {
        var token = jwt.sign(password + username, key.tokenKey);
        res.status(200).json({
            token: token
        });
    } else {
        res.status(400).json({ message: 'Invalid Password/Username' });
    }

})

app.get('/api/branches', (req, res) => {
    if (!req.isTokenExist) {
        res.status(401).json({ message: 'Unauthorized access' });
    } else {
        res.status(200).json({
            headquarterId: 1,
            branches: [
                {
                    id: 1,
                    name: "Silom",
                    position: {
                        lat: 13.7200452,
                        lng: 100.5135078
                    },
                    chartData: {
                        chartField: ["Month", "Amount"],
                        datas: [
                            { month: "February", amount: 10392 },
                            { month: "March", amount: 18239 },
                            { month: "April", amount: 14290 },
                            { month: "May", amount: 23912 },
                            { month: "June", amount: 26167 },
                            { month: "July", amount: 28199 }
                        ]
                    }
                },
                {
                    id: 2,
                    name: "Cholburi",
                    position: {
                        lat: 13.1247584,
                        lng: 100.9133127
                    },
                    chartData: {
                        chartField: ["Month", "Amount"],
                        datas: [
                            { month: "February", amount: 70032 },
                            { month: "March", amount: 54789 },
                            { month: "April", amount: 62789 },
                            { month: "May", amount: 89272 },
                            { month: "June", amount: 100328 },
                            { month: "July", amount: 128903 }
                        ]
                    }
                }
            ]
        });
    }
})

app.get('/', (req, res) => {
    res.status(200).json({ message: 'ok' });
})

const usingPort = localPort || process.env.PORT;

app.listen(usingPort, () => {
    console.log(`SERVER running at 'http://localhost:${usingPort}'`);
})

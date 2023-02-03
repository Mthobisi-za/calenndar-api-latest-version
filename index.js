const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
// firebase
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { addDoc, collection, getFirestore, getDocs } = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyAAmXX9Z2gRT3pDF5LpV-mDNlOQLeUuGKA",
    authDomain: "grey-1a5e6.firebaseapp.com",
    projectId: "grey-1a5e6",
    storageBucket: "grey-1a5e6.appspot.com",
    messagingSenderId: "913849587315",
    appId: "1:913849587315:web:e51d80891a6ae79878bc06",
    measurementId: "G-5ZY8SB37L3"
};
// Initialize Firebase
const appdb = initializeApp(firebaseConfig);
const db = getFirestore(appdb);
// firebase
app.use(cors({ origin: "*" }));
// app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    (async() => {
        await getDocs(collection(db, "talent")).then(resp => {
            var list = [];
            resp.forEach(doc => {
                list.push(doc.data());
            });

            res.json({ list });
        });
    })();

});
app.get('/:name/:surname', (req, res) => {
    var name = req.params.name;
    var surname = req.params.surname;
    (async() => {
        await getDocs(collection(db, "approved")).then(resp => {
            var list = [];
            resp.forEach(doc => {
                if (doc.data().talent.length == 1) {
                    if (doc.data().talent[0].name == name && doc.data().talent[0].surname) {
                        list.push(doc.data().talent[0]);
                        console.log(doc.data());
                    }
                } else {
                    doc.data().talent.forEach(ele => {
                        console.log(ele);
                        if (ele.name == name && ele.surname) {
                            list.push(ele);
                            console.log(ele);
                        }
                    });

                }



            });

            res.json({ list });
        });
    })();

});

app.get('/update/:name/:surname/:email/:company_name/:e_name_surname/:occupation/:date_booked/:type', (req, res) => {
    let name = req.params.name;
    let surname = req.params.surname;
    let email = req.params.email;
    let company_name = req.params.company_name;
    let e_name_surname = req.params.e_name_surname;
    let occupation = req.params.occupation;
    let date_booked = req.params.date_booked;
    let type = req.params.type;
    var fromd = (date_booked).replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/').replace('-', '/');
    var full = fromd.replace('=', '-');
    let fullData = () => {
        if (type !== 'team') {
            return [{
                name,
                surname,
                occupation,
                email,
                company_name,
                client_name: e_name_surname,
                date_booked: full
            }]

        } else {
            var data = [];
            var firstN = name.split('&')[0]
            var firstSurname = surname.split('&')[0];
            var firstRole = occupation.split('&')[0];
            var obj = {
                name: firstN,
                surname: firstSurname,
                occupation: firstRole,
                email,
                company_name,
                client_name: e_name_surname,
                date_booked: full
            }
            data.push(obj);
            //second user
            var secondN = name.split('&')[1];
            var secondSurname = surname.split('&')[1];
            var secondRole = occupation.split('&')[1];
            var objj = {
                name: secondN,
                surname: secondSurname,
                occupation: secondRole,
                email,
                company_name,
                client_name: e_name_surname,
                date_booked: full
            }
            data.push(objj);
            return data
        }
    };

    (async() => {
        try {
            const docRef = await addDoc(collection(db, "talent"), {
                talent: fullData()
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    })()

    res.json({ status: 200, status_text: 'success' });
});


app.listen(port, () => {
    console.log('server started on>>> ' + port);
})
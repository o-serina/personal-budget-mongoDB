const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const isHexcolor = require('is-hexcolor');
const cors = require('cors');
const app = express();
const port = 3000;

// app.use("/", express.static("public"));

// app.get("/hello", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/budget", (req, res) => {
//   fs.readFile("budget-data.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading JSON file:", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }
//     res.json(JSON.parse(data));
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// Database URL
const url = 'mongodb://localhost:27017/personal_budget';

// Import Mongoose model
const BudgetModel = require('./models/budget_model.js'); // Ensure this model is defined correctly

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static('public')); // Serve static files

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Routes
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
  BudgetModel.find({})
      .then(data => {
          if (!data || data.length === 0) {
              console.log("No data found in database");
              return res.status(404).json({ message: "No data found" });
          }
          res.json(data);
      })
      .catch(err => {
          console.error("Error retrieving data from MongoDB", err);
          res.status(500).send("Internal Server Error");
      });
});


app.post('/putbudget', (req, res) => {
    const { title, budget, backgroundColor } = req.body;

    if (!isHexcolor(backgroundColor)) {
        return res.status(400).send("Invalid color format");
    }

    const newData = new BudgetModel({ title, budget, backgroundColor });

    newData.save()
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            console.error("Error saving data to MongoDB", err);
            res.status(500).send("Internal Server Error");
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
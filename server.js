require('dotenv').config();
const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Railway backend is alive");
});

app.get("/userdata", (req, res) => {
    db.query("SELECT * FROM datas", (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }

        res.json(result);
    });
});

app.get("/userdata/referrals/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT refered_account FROM referrals
        WHERE user_id = ?
    `

    db.query(sql, [id], (err, result) => {
        res.json(result);
    })
});

app.post("/buy", (req, res) => {
    const {username, package: pkg} = req.body;

    const sql = `
        INSERT INTO datas (username, package)
        VALUES (?, ?)
    `;

    db.query(sql, [username, pkg], (err, result) => {

    if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }

    res.json({
        message: "Successfully posted",
        id: result.insertId
    });
});
})

app.post("/buy/referral", (req, res) => {
    const { userID, referrals } = req.body;

    const sql = "INSERT INTO referrals (user_id, refered_account) VALUES ?";
    const referralValues = referrals.map(r => [userID, r]);

    db.query(sql, [referralValues], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Successfully posted referrals" });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}.`)
})
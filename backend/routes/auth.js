const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('Benutzer registriert');
    } catch {
        res.status(500).send('Fehler bei der Registrierung');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Fehlgeschlagen');
    }

    res.send('Login erfolgreich');
});

module.exports = router;

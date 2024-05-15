const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Vendeur = require('../models/vendeur'); // Assurez-vous que le chemin est correct

// Ajouter un nouveau vendeur
router.post('/vendeurs', async (req, res) => {
    try {
        const vendeurData = req.body;
        const salt = await bcrypt.genSalt(10); // Générer un sel
        const hashedPassword = await bcrypt.hash(vendeurData.motDePasse, salt); // Hacher le mot de passe avec le sel généré

        const nouveauVendeur = new Vendeur({
            ...vendeurData,
            motDePasse: hashedPassword, // Utiliser le mot de passe haché
        });

        const vendeurSauvegarde = await nouveauVendeur.save();
        res.status(201).send(vendeurSauvegarde);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;


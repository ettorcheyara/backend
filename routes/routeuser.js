// routes/routeuser.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur');

router.post('/utilisateurs', async (req, res) => {
    try {
        const nouvelUtilisateur = new Utilisateur(req.body);
        const utilisateurSauvegarde = await nouvelUtilisateur.save();
        res.status(201).send(utilisateurSauvegarde);
    } catch (error) {
        res.status(400).send(error);
    }
});
router.get('/utilisateurs/recherche', async (req, res) => {
    try {
        const email = req.query.email;
        const utilisateur = await Utilisateur.findOne({ email: email });

        if (!utilisateur) {
            return res.status(404).send({ message: "Aucun utilisateur trouvé avec cet email" });
        }
        res.status(200).send(utilisateur);
    } catch (error) {
        res.status(500).send({ message: "Erreur serveur", error: error });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        console.log(`Tentative de connexion pour l'email : ${email}`);
        const utilisateur = await Utilisateur.findOne({ email });
        console.log(utilisateur ? 'Utilisateur trouvé' : 'Utilisateur non trouvé'); // Débogage

        if (!utilisateur) {
            return res.status(401).send({ message: "Identifiants incorrects" });
        }
        const match = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        console.log(match ? 'Mot de passe valide' : 'Mot de passe invalide'); // Débogage

        if (match) {

            if (utilisateur.role === 'vendeur') {

                res.send({ message: "Bienvenue sur l'accueil du vendeur" });
            } else if (utilisateur.role === 'client') {

                res.send({ message: "Bienvenue sur l'accueil du client" });
            } else if (utilisateur.role === 'admin') {
                res.send({ message: "bienvenue sur l'accueil d'admin" });
            }

        } else {
            res.status(401).send({ message: "Identifiants incorrects" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;

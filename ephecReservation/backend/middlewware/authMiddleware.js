import db from "../database.js";

const isAuthenticated = async (req, res, next) => {
  const sessionId = req.headers.authorization;
  const upn = req.headers.upn;

  try {
    // Retrieve user from the database
    db.query(`SELECT * FROM teacher WHERE upn='${upn}'`, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Erreur lors de l'authentification");
      }

      const user = results[0];

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Check if session id matches
      if (user.session_id !== sessionId) {
        return res.status(401).json({ message: 'Session invalide' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur lors de l'authentification");
  }
};

export default isAuthenticated;

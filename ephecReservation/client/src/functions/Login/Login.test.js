// Importez la fonction à tester
import { allFieldsChecked } from './Login';

// Testez si tous les champs sont conformes
test('Vérifier si tous les champs sont conformes', () => {
  // Créez un élément de réponse factice
  const responseBox = document.createElement('div');
  responseBox.id = 'callback_message_login';
  document.body.appendChild(responseBox);

  // Vérifiez si tous les champs sont conformes
  expect(allFieldsChecked('johndoe@example.com', 'password123')).toBe(true);

  // Vérifiez si un ou plusieurs champs sont vides
  expect(allFieldsChecked('', 'password123')).toBe(false);
  expect(allFieldsChecked('johndoe@example.com', '')).toBe(false);

  // Vérifiez si un ou plusieurs champs sont manquants
  expect(allFieldsChecked(null, 'password123')).toBe(false);
  expect(allFieldsChecked('johndoe@example.com', null)).toBe(false);

  // Vérifiez si le message d'erreur est affiché
  expect(responseBox.innerHTML).toBe("<p id=\"failed_response\">Problème au niveau du formulaire</p>");

  // Nettoyez l'élément de réponse
  document.body.removeChild(responseBox);
});

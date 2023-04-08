export function allFieldsChecked(upn, password) {
    //cette fonction va regarder si tous les champs sont conformes
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callback_message_login");

    //variable qui va contenir le message d'erreur
    let problem = undefined;
    if(!upn || !password){
        problem = "Problème au niveau du formulaire";
    }
    else if (upn === "" || password === "" ) {
        problem = "Un ou plusieurs champs sont vides";
    }
    else if (hasSqlInjection(upn, password)) {
        problem = "Injection SQL détectée";
    }

    if (problem !== undefined) {
        if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>" + problem + "</p>";
        }
        return false;
    }
    return true;

}

export function hasSqlInjection(upn, password) {
    // Check if the variables contain any SQL keywords or characters
    if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(upn) ||
        /select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(password)) {
      return true; // SQL injection found
    }
    return false; // No SQL injection found
  }
  
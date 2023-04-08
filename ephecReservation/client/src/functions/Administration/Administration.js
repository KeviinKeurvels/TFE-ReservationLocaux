export function allFieldsChecked(form, selectedImplantation, selectedRoom) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_unavailable");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (selectedImplantation === "" || selectedRoom === "" || form.hourBegin.value === "" || form.hourEnd.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.reason_unavailability.value.length < 2 || form.reason_unavailability.value.length > 40) {
                            problem = "L'intitulé n'est pas de taille acceptable (entre 2-40 caractères)";
              }
              else if (form.hourBegin.value > "18:00" || form.hourBegin.value < "08:00") {
                            problem = "L'heure de début n'est pas comprise dans les heures d'ouverture du local";
              }
              else if (form.hourEnd.value > "18:00" || form.hourEnd.value < "08:00") {
                            problem = "L'heure de fin n'est pas comprise dans les heures d'ouverture du local";
              }
              else if (form.hourBegin.value > form.hourEnd.value) {
                            problem = "L'heure de fin ne peut pas être avant l'heure de début";
              }
              else if (form.hourBegin.value === form.hourEnd.value) {
                            problem = "L'heure de début ne peut pas être égale à l'heure de fin";
              }
              else if (hasSqlInjection(selectedImplantation, selectedRoom, form)) {
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

export function hasSqlInjection(selectedImplantation, selectedRoom, form) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedImplantation) ||
                            /select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedRoom)) {
                            return true; // SQL injection found
              }

              // Loop through each field in the form
              for (let i = 0; i < form.elements.length; i++) {
                            const element = form.elements[i];
                            // Check if the field is an input, textarea or select element
                            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                                          // Check if the field value contains any SQL keywords or characters
                                          if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(element.value)) {
                                                        return true; // SQL injection found
                                          }
                            }
              }

              return false; // No SQL injection found
}


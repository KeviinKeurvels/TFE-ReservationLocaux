export function allFieldsCheckedAddRoom(form, selectedImplantation) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_room");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedImplantation || !form.name.value || !form.description.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedImplantation === ""|| form.name.value === ""|| form.description.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.name.value.length < 2 || form.name.value.length > 40) {
                            problem = "Le nom du local n'est pas de taille acceptable (entre 2-40 caractères)";
              }
              else if (form.description.value.length < 5 || form.name.value.length > 100) {
                            problem = "La description du local n'est pas de taille acceptable (entre 5-100 caractères)";
              }
              else if (hasSqlInjectionAddRoom(selectedImplantation, form)) {
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

export function allFieldsCheckedDeleteRoom(selectedRoom) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_delete_room");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedRoom) {
                            problem = "Le champ sélectionnant le local n'est pas présent";
              }
              else if (selectedRoom === "") {
                            problem = "Le champ sélectionnant le local est vide";
              }
              else if (hasSqlInjectionDeleteRoom(selectedRoom)) {
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


export function allFieldsCheckedUnavailable(form, selectedImplantation, selectedRoom) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_unavailable");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedImplantation || !selectedRoom || !form.hourBegin.value || !form.hourEnd.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedImplantation === "" || selectedRoom === "" || form.hourBegin.value === "" || form.hourEnd.value === "") {
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
              else if (hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form)) {
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



export function hasSqlInjectionAddRoom(selectedImplantation, form) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedImplantation)){
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


export function hasSqlInjectionDeleteRoom(selectedRoom) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedRoom)) {
                            return true; // SQL injection found
              }

              return false; // No SQL injection found
}

export function hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form) {
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



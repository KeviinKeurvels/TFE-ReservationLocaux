export function allFieldsChecked(form, idReservation, dayReservation, Reservations) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callbackMessageModify");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (dayReservation === "" || form.hourBegin.value === "" || form.hourEnd.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.nameReservation.value.length < 2 || form.nameReservation.value.length > 40) {
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
              //si déjà une réservation à ce moment-là
              else if (checkIfThereIsAlreadyAReservation(form.hourBegin.value, form.hourEnd.value, dayReservation, idReservation, Reservations)) {
                            problem = "Il y a déjà une réservation à ce moment-là.";
              }

              if (problem !== undefined) {
                            if (responseBox !== undefined && responseBox !== null) {
                                          responseBox.innerHTML = "<p id='failed_response'>" + problem + "</p>";
                            }
                            return false;
              }
              return true;

}

export function checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, dateChosen, idReservation, Reservations) {
              //cette fonction va regarder s'il y a déjà une réservation à ce moment-là
              let alreadyReserved = false;
              Reservations.forEach((reservation) => {
                            if (reservation.idRe != idReservation) {
                                          // les heures de la réservation existante 
                                          //on ajout et enleve 60000 afin de pouvoir réserver à la minute où l'autre a fini (et vice versa)
                                          var x = new Date(dateChosen + " " + reservation["hourBegin"]).getTime() + 60000;
                                          var y = new Date(dateChosen + " " + reservation["hourEnd"]).getTime() - 60000;

                                          // les heures de la nouvelle réservation
                                          var a = new Date(dateChosen + " " + hourBegin).getTime();
                                          var b = new Date(dateChosen + " " + hourEnd).getTime();

                                          if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
                                                        //si il y a déjà une réservation à ce moment-là
                                                        alreadyReserved = true;
                                          }
                            }
              })
              return alreadyReserved;

}

export function convertDate(dateString) {
              //converti la date en format EU 
              let date = new Date(dateString);
              return date.getDate()+"/"+(date.getMonth() + 1)+"/"+date.getFullYear();
          }
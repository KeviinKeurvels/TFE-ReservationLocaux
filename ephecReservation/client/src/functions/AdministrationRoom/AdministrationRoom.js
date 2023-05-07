//////////////////////////////////////FORMS
export function allFieldsCheckedAddRoom(form, selectedImplantation) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_room");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedImplantation || !form.name.value || !form.description.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedImplantation === "" || form.name.value === "" || form.description.value === "") {
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


export function allFieldsCheckedModifyRoom(form, selectedRoom) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_modify_room");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedRoom || !form.name.value || !form.description.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedRoom === "" || form.name.value === "" || form.description.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.name.value.length < 2 || form.name.value.length > 40) {
                            problem = "Le nom n'est pas de taille acceptable (entre 2-40 caractères)";
              }
              else if (form.description.value.length < 5 || form.description.value.length > 100) {
                            problem = "La description n'est pas de taille acceptable (entre 5-100 caractères)";
              }
              //on peut utiliser cette fonction là car elle permet de tester une injection
              // SQL dans une variable et dans le form
              else if (hasSqlInjectionAddRoom(selectedRoom, form)) {
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
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedImplantation)) {
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


//////////////////////////////////////CALL DB
//POUR RENDRE UN LOCAL INDISPONIBLE
export function handleSubmitUnavailable(event, selectedImplantation, selectedRoom, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_unavailable");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_unavailable");
              //pour la box qui où il y a le formulaire de réservation
              let formUnavailable = document.getElementById("form_unavailable");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedUnavailable(event.target, selectedImplantation, selectedRoom)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations qui sont pendant la période de temps
                            fetch(config.API_URL + "/admin/suspendAllReservationsForAPeriod", {
                                          method: 'PUT',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      day: event.target.day.value,
                                                                      hourBegin: event.target.hourBegin.value,
                                                                      hourEnd: event.target.hourEnd.value,
                                                                      idRo: selectedRoom
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (res.status === 200) {
                                                        //on met la réservation d'indisponibilité
                                                        fetch(config.API_URL + "/reservations", {
                                                                      method: 'POST',
                                                                      headers: {
                                                                                    'Content-type': 'application/json',
                                                                                    'Authorization': `${localStorage.getItem('token')}`,
                                                                                    'upn': `${localStorage.getItem('upn')}`
                                                                      },
                                                                      body: (
                                                                                    JSON.stringify({
                                                                                                  title: "UNAVAILABLE:" + event.target.reason_unavailability.value,
                                                                                                  day: event.target.day.value,
                                                                                                  hourBegin: event.target.hourBegin.value,
                                                                                                  hourEnd: event.target.hourEnd.value,
                                                                                                  upn: localStorage.getItem('upn'),
                                                                                                  idRo: selectedRoom,
                                                                                    }
                                                                                    )
                                                                      ),
                                                        }).then(function (res) {
                                                                      if (responseBox !== undefined && responseBox !== null) {
                                                                                    if (res.status === 200) {
                                                                                                  if (formUnavailable !== undefined && formUnavailable !== null) {
                                                                                                                formUnavailable.innerHTML = "";
                                                                                                  }

                                                                                                  responseBox.innerHTML = "<p id='success_response'>L'indisponibilité a bien été enregistré.</p>";

                                                                                    }
                                                                                    else {

                                                                                                  responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

                                                                                    }

                                                                      }
                                                        })
                                                                      .catch(function (res) {
                                                                                    if (responseBox !== undefined && responseBox !== null) {
                                                                                                  responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                                                    }
                                                                      })
                                          }
                                          else {
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          }
                            })
                                          .catch(function (res) {
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          })
              }
              else {
                            if (submitButton !== undefined && submitButton !== null) {
                                          submitButton.style.display = "block";
                            }
              }
}

//POUR AJOUTER UN LOCAL
export function handleSubmitAddRoom(event, selectedImplantation, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_add_room");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_room");
              //pour la box qui où il y a le formulaire d'ajout
              let formAddRoom = document.getElementById("form_add_room");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedAddRoom(event.target, selectedImplantation)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on ajoute le local
                            fetch(config.API_URL + "/admin/room", {
                                          method: 'POST',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      name: event.target.name.value,
                                                                      description: event.target.description.value,
                                                                      idIm: selectedImplantation,
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (responseBox !== undefined && responseBox !== null) {
                                                        if (res.status === 200) {
                                                                      if (formAddRoom !== undefined && formAddRoom !== null) {
                                                                                    formAddRoom.innerHTML = "";
                                                                      }

                                                                      responseBox.innerHTML = "<p id='success_response'>Le local a bien été enregistré.</p>";

                                                        }
                                                        else {

                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

                                                        }

                                          }
                            })
                                          .catch(function (res) {
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          })
              }
              else {
                            if (submitButton !== undefined && submitButton !== null) {
                                          submitButton.style.display = "block";

                            }
              }

}

//POUR SUPPRIMER UN LOCAL
export function handleSubmitDeleteRoom(event, selectedRoom, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_delete_room");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_delete_room");
              //pour la box qui où il y a le formulaire d'ajout
              let formDeleteRoom = document.getElementById("form_delete_room");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedDeleteRoom(selectedRoom)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations du local supprimé
                            fetch(config.API_URL + "/admin/deleteAllReservationsForARoom", {
                                          method: 'DELETE',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      idRo: selectedRoom
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (responseBox !== undefined && responseBox !== null) {
                                                        if (res.status === 200) {
                                                                      //on supprime le local
                                                                      fetch(config.API_URL + "/admin/room", {
                                                                                    method: 'DELETE',
                                                                                    headers: {
                                                                                                  'Content-type': 'application/json',
                                                                                                  'Authorization': `${localStorage.getItem('token')}`,
                                                                                                  'upn': `${localStorage.getItem('upn')}`
                                                                                    },
                                                                                    body: (
                                                                                                  JSON.stringify({
                                                                                                                idRo: selectedRoom
                                                                                                  }
                                                                                                  )
                                                                                    ),
                                                                      }).then(function (res) {
                                                                                    if (res.status === 200) {
                                                                                                  //si la première requête se passe bien
                                                                                                  if (responseBox !== undefined && responseBox !== null) {
                                                                                                                //si la deuxième requête se passe bien
                                                                                                                responseBox.innerHTML = "<p id='success_response'>Les réservations ont bien été supprimées ainsi que le local.</p>";
                                                                                                  }
                                                                                    }
                                                                                    else {
                                                                                                  //si la deuxième requête se passe pas bien
                                                                                                  if (responseBox !== undefined && responseBox !== null) {
                                                                                                                responseBox.innerHTML = "<p id='failed_response'>Les réservations ont bien été supprimées mais pas le local (cause interne).</p>";
                                                                                                  }
                                                                                    }

                                                                      }).catch(function (res) {
                                                                                    //si la deuxième requête se passe pas bien
                                                                                    if (responseBox !== undefined && responseBox !== null) {
                                                                                                  responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                                                    }
                                                                      })

                                                                      if (formDeleteRoom !== undefined && formDeleteRoom !== null) {
                                                                                    formDeleteRoom.innerHTML = "";
                                                                      }
                                                        }
                                                        else {
                                                                      //si la première requête se passe pas bien
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";

                                                        }

                                          }
                            })
                                          .catch(function (res) {
                                                        //si la première requête se passe pas bien
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          })
              }
              else {
                            if (submitButton !== undefined && submitButton !== null) {
                                          submitButton.style.display = "block";

                            }
              }

}

//POUR MODIFIER UN LOCAL
export function handleSubmitModifyRoom(event, selectedRoom, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_modify_room");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_modify_room");
              //pour la box qui où il y a le formulaire de réservation
              let formUnavailable = document.getElementById("form_modify_room");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedModifyRoom(event.target, selectedRoom)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations qui sont pendant la période de temps
                            fetch(config.API_URL + "/admin/room", {
                                          method: 'PUT',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      idRo: selectedRoom,
                                                                      name: event.target.name.value,
                                                                      description: event.target.description.value
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (res.status === 200) {

                                                        if (formUnavailable !== undefined && formUnavailable !== null) {
                                                                      formUnavailable.innerHTML = "";
                                                        }
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='success_response'>Le local a bien été modifié.</p>";
                                                        }
                                          }

                                          else {
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          }
                            })
                                          .catch(function (res) {
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                        }
                                          })
              }
              else {
                            if (submitButton !== undefined && submitButton !== null) {
                                          submitButton.style.display = "block";
                            }
              }
}

//////////////////////////////////////POUR LE GRAPHIQUE
export function hasSqlInjectionStatistics(idRoom, dateForGraph) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(idRoom)) {
                            return true; // SQL injection found
              }
              else if(/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(dateForGraph)) {
                            return true; // SQL injection found
              }

              return false; // No SQL injection found
}

export function loadDataGraph(idRoom, setIsLoading, config, setDataGraph, setSelectedRoomForGraph, dateForGraph) {
              /*
              *   Récupère les informations pour le graphique
              */
              if (!hasSqlInjectionStatistics(idRoom, dateForGraph)) {
                            setSelectedRoomForGraph(idRoom);
                            let callback = document.getElementById("callback_message_graph");
                            if (callback !== null && callback !== undefined) {
                                          callback.innerHTML = ""
                            }
                            const controller = new AbortController();
                            const signal = controller.signal;
                            setIsLoading(true);
                            fetch(config.API_URL + "/admin/getCountReservation?idRo=" + idRoom + "&date='" + dateForGraph + "'", {
                                          signal,
                                          headers: {
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          }
                            })
                                          .then((res) => res.json())
                                          .then((res) => {
                                                        setDataGraph(res);
                                                        setIsLoading(false);
                                          })
                                          .catch((err) => {
                                                        if (err.name !== "AbortError") {
                                                                      console.log(err)
                                                        }
                                          });

                            return () => controller.abort();
              }
              else {
                            let callback = document.getElementById("callback_message_graph");
                            if (callback !== null && callback !== undefined) {
                                          callback.innerHTML = "<p id='failed_response'>Injection SQL détectée</p>"
                            }
              }


};

export async function subtractDays(dateForGraph, setDateForGraph) {
              //enleve 7 jours à la date choisie pour le graphique
              const newDate = new Date(dateForGraph);
              newDate.setDate(dateForGraph.getDate() - 7);
              setDateForGraph(newDate);
}
export async function addDays(dateForGraph, setDateForGraph) {
              //rajoute 7 jours à la date choisie pour le graphique
              const newDate = new Date(dateForGraph);
              newDate.setDate(dateForGraph.getDate() + 7);
              setDateForGraph(newDate);
}

//////////////////////////////////////SELECTION DANS UN FORM
export const handleChangeImplantationToGetRooms = (event, setSelectedImplantation, setRooms, setIsLoading, config) => {
              const selectedImplantation = event.target.value;
              setSelectedImplantation(selectedImplantation);
              const controller = new AbortController();
              const signal = controller.signal;
              setIsLoading(true);
              const headers = {
                            'Authorization': `${localStorage.getItem('token')}`,
                            'upn': `${localStorage.getItem('upn')}`
              };
              fetch(`${config.API_URL}/rooms/byImplantation?implantation='${selectedImplantation}'`, { headers, signal })
                            .then((res) => res.json())
                            .then((res) => {
                                          
                                          setRooms(res);
                                          setIsLoading(false);
                            })
                            .catch((err) => {
                                          if (err.name !== "AbortError") {
                                                        console.log(err)
                                          }
                            });

              return () => controller.abort();

};

export const handleChangeRoom = (event, setSelectedRoom, rooms, setIsLoading) => {
              const selectedRoom = event.target.value;
              setSelectedRoom(selectedRoom);
              setIsLoading(true);
              let formModify = document.getElementById("form_modify_room");
              rooms.map((room) => {
                            if (room["idRo"] === selectedRoom) {
                                          if (formModify !== null && formModify !== undefined) {
                                                        const nameInput = formModify.elements.namedItem("name");
                                                        if (nameInput !== null) {
                                                                      nameInput.value = room["name"];
                                                        }
                                                        const descriptionInput = formModify.elements.namedItem("description");
                                                        if (descriptionInput !== null) {
                                                                      descriptionInput.value = room["description"];
                                                        }
                                          }
                            }
              });



              setIsLoading(false);
};






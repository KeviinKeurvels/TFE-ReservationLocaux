//////////////////////////////////////FORMS
export function allFieldsCheckedAddImplantation(form) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_implantation");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!form.name.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (form.name.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.name.value.length < 2 || form.name.value.length > 40) {
                            problem = "Le nom d' l'implantation n'est pas de taille acceptable (entre 2-40 caractères)";
              }
              else if (hasSqlInjectionAddImplantation(form)) {
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

export function allFieldsCheckedModifyImplantation(form, selectedImplantation) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_modify_implantation");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedImplantation || !form.name.value) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedImplantation === "" || form.name.value === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (form.name.value.length < 2 || form.name.value.length > 40) {
                            problem = "Le nom n'est pas de taille acceptable (entre 2-40 caractères)";
              }
              //on peut utiliser cette fonction là car elle permet de tester une injection
              // SQL dans une variable et dans le form
              else if (hasSqlInjectionModifyImplantation(selectedImplantation, form)) {
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

export function allFieldsCheckedDeleteImplantation(selectedImplantation, roomsIds) {
              //cette fonction va regarder si tous les champs sont conformes
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_delete_implantation");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedImplantation) {
                            problem = "Le champ sélectionnant le local n'est pas présent";
              }
              else if (selectedImplantation === "") {
                            problem = "Le champ sélectionnant le local est vide";
              }
              else if (hasSqlInjectionDeleteImplantation(selectedImplantation, roomsIds)) {
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




export function hasSqlInjectionAddImplantation(form) {
              // Check if the variables contain any SQL keywords or characters
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

export function hasSqlInjectionModifyImplantation(selectedImplantation, form) {
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

export function hasSqlInjectionDeleteImplantation(selectedImplantation, roomsIds) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedImplantation)) {
                            return true; // SQL injection found
              }
              else {
                            for (let i in roomsIds) {
                                          if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(roomsIds[i])) {
                                                        return true; // SQL injection found
                                          }
                            }
              }

              return false; // No SQL injection found
}



//////////////////////////////////////CALL DB
//POUR AJOUTER UNE IMPLANTATION
export function handleSubmitAddImplantation(event, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_add_implantation");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_implantation");
              //pour la box qui où il y a le formulaire d'ajout
              let formAddImplantation = document.getElementById("form_add_implantation");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedAddImplantation(event.target)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on ajoute l'implantation
                            fetch(config.API_URL + "/admin/implantation", {
                                          method: 'POST',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      name: event.target.name.value,
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (responseBox !== undefined && responseBox !== null) {
                                                        if (res.status === 200) {
                                                                      if (formAddImplantation !== undefined && formAddImplantation !== null) {
                                                                                    formAddImplantation.innerHTML = "";
                                                                      }

                                                                      responseBox.innerHTML = "<p id='success_response'>L'implantation a bien été enregistré.</p>";

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

//POUR MODIFIER UNE IMPLANTATION
export function handleSubmitModifyImplantation(event, selectedImplantation, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_modify_implantation");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_modify_implantation");
              //pour la box qui où il y a le formulaire de réservation
              let formModifyImplantation = document.getElementById("form_modify_implantation");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedModifyImplantation(event.target, selectedImplantation)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations qui sont pendant la période de temps
                            fetch(config.API_URL + "/admin/implantation", {
                                          method: 'PUT',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      idIm: selectedImplantation,
                                                                      name: event.target.name.value,
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (res.status === 200) {

                                                        if (formModifyImplantation !== undefined && formModifyImplantation !== null) {
                                                                      formModifyImplantation.innerHTML = "";
                                                        }
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='success_response'>L'implantation a bien été modifié.</p>";
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

//POUR SUPPRIMER UNE IMPLANTATION
export async function handleSubmitDeleteImplantation(event, roomsIds, selectedImplantation, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_delete_implantation");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_delete_implantation");
              //pour la box qui où il y a le formulaire d'ajout
              let formDeleteImplantation = document.getElementById("form_delete_implantation");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }
              //pour voir si toutes les réservations et les locaux d'une implantation sont bien supprimés
              let allReservationsAndRoomsDeleted = true;


              if (allFieldsCheckedDeleteImplantation(selectedImplantation, roomsIds)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations de chaque local pour l'implantation séléctionné
                            
                            for (const idRoom of roomsIds) {
                                          try {
                                              const response = await fetch(config.API_URL + "/admin/deleteAllReservationsForARoom", {
                                                  method: 'DELETE',
                                                  headers: {
                                                      'Content-type': 'application/json',
                                                      'Authorization': `${localStorage.getItem('token')}`,
                                                      'upn': `${localStorage.getItem('upn')}`
                                                  },
                                                  body: JSON.stringify({
                                                      idRo: idRoom
                                                  })
                                              });
                                              if (responseBox !== undefined && responseBox !== null) {
                                                  if (response.status === 200) {
                                                      //si la première requête se passe bien
                                                      //on supprime le local
                                                      const response2 = await fetch(config.API_URL + "/admin/room", {
                                                          method: 'DELETE',
                                                          headers: {
                                                              'Content-type': 'application/json',
                                                              'Authorization': `${localStorage.getItem('token')}`,
                                                              'upn': `${localStorage.getItem('upn')}`
                                                          },
                                                          body: JSON.stringify({
                                                              idRo: idRoom
                                                          })
                                                      });
                                                      if (response2.status === 200) {
                                                          //si la deuxième requête se passe bien
                                                          if (responseBox !== undefined && responseBox !== null) {
                                                              responseBox.innerHTML += "<p id='success_response'>Les réservations ont bien été supprimées ainsi que le local avec l'id " + idRoom + ".</p>";
                                                          }
                                                      } else {
                                                          //si la deuxième requête se passe pas bien
                                                          if (responseBox !== undefined && responseBox !== null) {
                                                              responseBox.innerHTML += "<p id='failed_response'>Les réservations ont bien été supprimées mais pas le local " + idRoom + " (cause interne).</p>";
                                                              allReservationsAndRoomsDeleted = false;
                                                          }
                                                      }
                                                      if (formDeleteImplantation !== undefined && formDeleteImplantation !== null) {
                                                          formDeleteImplantation.innerHTML = "";
                                                      }
                                                  } else {
                                                      //si la première requête se passe pas bien
                                                      responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                      allReservationsAndRoomsDeleted = false;
                                                  }
                                              }
                                          } catch (error) {
                                              //si la première requête se passe pas bien
                                              if (responseBox !== undefined && responseBox !== null) {
                                                  responseBox.innerHTML = "<p id='failed_response'>Un problème est survenu.<br/>Veuillez réessayez plus tard.</p>";
                                                  allReservationsAndRoomsDeleted = false;
                                              }
                                          }
                                      }
                            if(allReservationsAndRoomsDeleted){
                                          const response3 = await fetch(config.API_URL + "/admin/implantation", {
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Content-type': 'application/json',
                                                            'Authorization': `${localStorage.getItem('token')}`,
                                                            'upn': `${localStorage.getItem('upn')}`
                                                        },
                                                        body: JSON.stringify({
                                                                      idIm: selectedImplantation
                                                        })
                                                    });
                                                    if (response3.status === 200) {
                                                        //si la troisième requête se passe bien
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='success_response'>L'implantation est bien supprimée.</p>";
                                                        }
                                                    } else {
                                                        //si la troisième requête se passe pas bien
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML += "<p id='failed_response'>Un problème est survenu.<br/>L'implantation n'a apas été supprimée.</p>";
                                                        }
                                                    }
                                          
                            }


              }
              else {
                            if (submitButton !== undefined && submitButton !== null) {
                                          submitButton.style.display = "block";

                            }
              }

}




//////////////////////////////////////SELECTION DANS UN FORM
export const handleChangeImplantation = (event, setSelectedImplantation, implantations, setIsLoading) => {
              const selectedImplantation = event.target.value;
              setSelectedImplantation(selectedImplantation);
              setIsLoading(true);
              let formModify = document.getElementById("form_modify_implantation");
              implantations.map((implantation) => {
                            if (implantation["idIm"] === event.target.value) {
                                          if (formModify !== null && formModify !== undefined) {
                                                        const nameInput = formModify.elements.namedItem("name");
                                                        if (nameInput !== null) {
                                                                      nameInput.value = implantation["name"];
                                                        }
                                          }
                            }
              });



              setIsLoading(false);


};


export const loadImplantations = (setImplantations, setIsLoading, config) => {
              const controller = new AbortController();
              const signal = controller.signal;
              setIsLoading(true);
              fetch(config.API_URL + "/implantations", {
                            signal,
                            headers: {
                                          'Authorization': `${localStorage.getItem('token')}`,
                                          'upn': `${localStorage.getItem('upn')}`
                            }
              })
                            .then((res) => res.json())
                            .then((res) => {
                                          setImplantations(res);
                                          setIsLoading(false);
                            })
                            .catch((err) => {
                                          if (err.name !== "AbortError") {
                                                        console.log(err)
                                          }
                            });

              return () => controller.abort();
}
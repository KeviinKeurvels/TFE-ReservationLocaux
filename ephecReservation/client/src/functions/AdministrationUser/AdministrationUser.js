//////////////////////////////////////FORMS
export function allFieldsCheckedAddAdmin(selectedUser) {
              //cette fonction va regarder si le champs est conforme
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_add_admin");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedUser) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedUser === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (hasSqlInjectionAdmin(selectedUser)) {
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

export function allFieldsCheckedDeleteAdmin(selectedUser) {
              //cette fonction va regarder si le champs est conforme
              //pour la box qui va afficher les messages lors de l'ajout
              let responseBox = document.getElementById("callback_message_delete_admin");

              //variable qui va contenir le message d'erreur
              let problem = undefined;
              if (!selectedUser) {
                            problem = "Un ou plusieurs champs ne sont pas présent(s)";
              }
              else if (selectedUser === "") {
                            problem = "Un ou plusieurs champs sont vides";
              }
              else if (hasSqlInjectionAdmin(selectedUser)) {
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


export function hasSqlInjectionAdmin(selectedUser) {
              // Check if the variables contain any SQL keywords or characters
              if (/select|insert|update|delete|drop|union|truncate|(\-\-)/i.test(selectedUser)) {
                            return true; // SQL injection found
              }

              return false; // No SQL injection found
}


//////////////////////////////////////CALL DB
//POUR RENDRE UN UTILISATEUR ADMINISTRATEUR
export function handleSubmitAddAdmin(event, selectedUser, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_add_admin");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_add_admin");
              //pour la box qui où il y a le formulaire de réservation
              let formUnavailable = document.getElementById("form_add_admin");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedAddAdmin(event.target, selectedUser)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations qui sont pendant la période de temps
                            fetch(config.API_URL + "/admin/changeIsAdminForAUser", {
                                          method: 'PUT',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      idTe: selectedUser,
                                                                      isAdmin: 1
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (res.status === 200) {

                                                        if (formUnavailable !== undefined && formUnavailable !== null) {
                                                                      formUnavailable.innerHTML = "";
                                                        }
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='success_response'>L'utilisateur est bien devenu un administrateur.</p>";
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
//POUR RENDRE UN UTILISATEUR NON-ADMINISTRATEUR
export function handleSubmitDeleteAdmin(event, selectedUser, config) {
              //cache le bouton
              let submitButton = document.getElementById("submit_button_delete_admin");
              if (submitButton !== undefined && submitButton !== null) {
                            submitButton.style.display = "none";
              }
              //ne recharge pas la page
              event.preventDefault();
              //pour la box qui va afficher les messages lors de la réservation
              let responseBox = document.getElementById("callback_message_delete_admin");
              //pour la box qui où il y a le formulaire de réservation
              let formUnavailable = document.getElementById("form_delete_admin");

              //pour afficher un message en attendant
              if (responseBox !== undefined && responseBox !== null) {
                            responseBox.innerHTML = "<p id='waiting_response'>Veuillez patienter, nous traitons votre requête.</p>";
              }


              if (allFieldsCheckedAddAdmin(event.target, selectedUser)) {
                            //si tous les champs respectent bien ce qu'il faut
                            //on supprime les réservations qui sont pendant la période de temps
                            fetch(config.API_URL + "/admin/changeIsAdminForAUser", {
                                          method: 'PUT',
                                          headers: {
                                                        'Content-type': 'application/json',
                                                        'Authorization': `${localStorage.getItem('token')}`,
                                                        'upn': `${localStorage.getItem('upn')}`
                                          },
                                          body: (
                                                        JSON.stringify({
                                                                      idTe: selectedUser,
                                                                      isAdmin: 0
                                                        }
                                                        )
                                          ),
                            }).then(function (res) {
                                          if (res.status === 200) {

                                                        if (formUnavailable !== undefined && formUnavailable !== null) {
                                                                      formUnavailable.innerHTML = "";
                                                        }
                                                        if (responseBox !== undefined && responseBox !== null) {
                                                                      responseBox.innerHTML = "<p id='success_response'>L'utilisateur n'est plus un administrateur.</p>";
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

//////////////////////////////////////SELECTION DANS UN FORM
export const getUsersThatAreNotAdmin = (setUsers, setIsLoading, config) => {
              const controller = new AbortController();
              const signal = controller.signal;
              setIsLoading(true);
              const headers = {
                            'Authorization': `${localStorage.getItem('token')}`,
                            'upn': `${localStorage.getItem('upn')}`
              };
              fetch(`${config.API_URL}/admin/getAllUsersThatAreNotAdmin`, { headers, signal })
                            .then((res) => res.json())
                            .then((res) => {
                                          setUsers(res);
                                          setIsLoading(false);
                            })
                            .catch((err) => {
                                          if (err.name !== "AbortError") {
                                                        console.log(err)
                                          }
                            });

              return () => controller.abort();

};

export const getUsersThatAreAdmin = (setUsers, setIsLoading, config) => {
              const controller = new AbortController();
              const signal = controller.signal;
              setIsLoading(true);
              const headers = {
                            'Authorization': `${localStorage.getItem('token')}`,
                            'upn': `${localStorage.getItem('upn')}`
              };
              fetch(`${config.API_URL}/admin/getAllUsersThatAreAdmin`, { headers, signal })
                            .then((res) => res.json())
                            .then((res) => {
                                          
                                          setUsers(res);
                                          setIsLoading(false);
                            })
                            .catch((err) => {
                                          if (err.name !== "AbortError") {
                                                        console.log(err)
                                          }
                            });

              return () => controller.abort();

};






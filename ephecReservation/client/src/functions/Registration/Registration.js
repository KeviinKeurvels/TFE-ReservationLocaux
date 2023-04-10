import config from "../../config.json"
import {hasSqlInjection} from '../Form/Form.js'

export async function allFieldsChecked(form) {
    //cette fonction va regarder si tous les champs sont conformes
    //pour la box qui va afficher les messages lors de la réservation
    let responseBox = document.getElementById("callback_message_registration");

    //variable qui va contenir le message d'erreur
    let problem = undefined;
    if (!form.name.value || !form.upn.value || !form.password1.value || !form.password2.value) {
        problem = "Problème au niveau du formulaire";
    }
    else if (form.name.value === "" || form.upn.value === "" || form.password1.value === "" || form.password2.value === "") {
        problem = "Un ou plusieurs champs sont vides";
    }
    else if (form.name.value.length < 2 || form.name.value.length > 100) {
        problem = "Le nom d'utilisateur n'est pas de taille acceptable (entre 2-100 caractères)";
    }
    else if (form.upn.value.length < 6 || form.upn.value.length > 100) {
        problem = "L'email n'est pas de taille acceptable (entre 6-100 caractères)";
    }
    else if (form.password1.value !== form.password2.value) {
        problem = "Les deux mots de passes ne sont pas identiques";
    }
    else if (form.password1.value.length < 8 || form.password1.value.length > 20) {
        problem = "Le mot de passe n'est pas de taille acceptable (entre 8-20 caractères)";
    }
    else if (!isStrongPassword(form.password1.value)) {
        problem = "Le mot de passe entré ne respecte pas nos politiques de mots de passe";
    }
    //si déjà une réservation à ce moment-là
    else if (!isValidEmail(form.upn.value)) {
        problem = "L'adresse mail rentré n'est pas une adresse mail valide.";
    }
    //si l'email existe déjà
    else if (await checkIfThereIsAlreadyThisUpn(form.upn.value)) {
        problem = "Cette adresse mail est déjà utilisée.";
    }
    else if (hasSqlInjection(form)) {
        problem = "Injection SQL détectée.";
    }

    if (problem !== undefined) {
        if (responseBox !== undefined && responseBox !== null) {
            responseBox.innerHTML = "<p id='failed_response'>" + problem + "</p>";
        }
        return false;
    }
    return true;

}


export async function checkIfThereIsAlreadyThisUpn(upn) {
    //cette fonction va regarder s'il l'email est déjà enregistrée
    return fetch(config.API_URL + "/auth/checkUpn?upn='" + upn + "'")
        .then((res) => res.json())
        .then((res) => {
            return res.length > 0;
        })
        .catch((err) => console.log(err));
}

export function isValidEmail(email) {
    //va regarder si l'email est du bon format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isStrongPassword(password) {
    //va voir si le mot de passe est bien un mot de passe sûr
    const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"
    );
    return strongRegex.test(password);
}


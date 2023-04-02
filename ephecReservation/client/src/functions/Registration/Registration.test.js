import {allFieldsChecked, isValidEmail, isStrongPassword} from './Registration'

describe("allFieldsChecked", () => {
  it("returns true if all fields are valid", async () => {
    const form = {
      name: { value: "John" },
      upn: { value: "john@example.com" },
      password1: { value: "MyPassword123!" },
      password2: { value: "MyPassword123!" }
    };
    expect(await allFieldsChecked(form)).toBe(true);
  });

  it("returns false and displays error message if form fields are empty", async () => {
    const form = {
      name: { value: "" },
      upn: { value: "" },
      password1: { value: "" },
      password2: { value: "" }
    };
    expect(await allFieldsChecked(form)).toBe(false);
  });

  it("returns false and displays error message if name is not of acceptable length", async () => {
    const form = {
      name: { value: "J" },
      upn: { value: "john@example.com" },
      password1: { value: "MyPassword123!" },
      password2: { value: "MyPassword123!" }
    };
    expect(await allFieldsChecked(form)).toBe(false);
  });

  it("returns false and displays error message if email is not of acceptable length", async () => {
    const form = {
      name: { value: "John" },
      upn: { value: "j@e.b" },
      password1: { value: "MyPassword123!" },
      password2: { value: "MyPassword123!" }
    };
    expect(await allFieldsChecked(form)).toBe(false);
  });

  it("returns false and displays error message if passwords do not match", async () => {
    const form = {
      name: { value: "John" },
      upn: { value: "john@example.com" },
      password1: { value: "MyPassword123!" },
      password2: { value: "weakPassword123" }
    };
    expect(await allFieldsChecked(form)).toBe(false);
  });

  it("returns false and displays error message if password is not of acceptable length", async () => {
    const form = {
      name: { value: "John" },
      upn: { value: "john@example.com" },
      password1: { value: "My123" },
      password2: { value: "My123" }
    };
    expect(await allFieldsChecked(form)).toBe(false);
  });

  it("returns false and displays error message if password is weak", async () => {
    const form = {
      name: { value: "John" },
      upn: { value: "john@example.com" },
      password1: { value: "password123" },
      password2: { value: "password123" }
    };
    const responseBox = document.createElement("div");
    responseBox.id = "callback_message_registration";
    document.body.appendChild(responseBox);
  
    const result = await allFieldsChecked(form);
  
    expect(result).toBe(false);
    expect(responseBox.innerHTML).toContain("Le mot de passe entré ne respecte pas nos politiques de mots de passe");
  
    document.body.removeChild(responseBox);
  });
  
});

describe("isValidEmail", () => {
  it("returns true if email is valid", () => {
    const validEmail = "johndoe@example.com";
    const result = isValidEmail(validEmail);
    expect(result).toBe(true);
  });

  it("returns false if email is invalid", () => {
    const invalidEmail = "johndoeexample.com";
    const result = isValidEmail(invalidEmail);
    expect(result).toBe(false);
  });
});

describe("isStrongPassword", () => {
  it("returns true for a strong password", () => {
    const password = "MyPassword123!";    
    const result = isStrongPassword(password);    
    expect(result).toBe(true);
  });

  it("returns false for a weak password", () => {
    const password = "mypassword";    
    const result = isStrongPassword(password);    
    expect(result).toBe(false);
  });
});



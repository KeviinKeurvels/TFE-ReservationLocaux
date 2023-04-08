export function hasSqlInjection(form) {
  let elements = form.elements || Object.values(form);
  // Loop through each field in the form
  for (const element of elements) {
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

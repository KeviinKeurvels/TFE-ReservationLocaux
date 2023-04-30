import {
allFieldsCheckedDeleteImplantation, hasSqlInjectionAddImplantation,
 hasSqlInjectionModifyImplantation, hasSqlInjectionDeleteImplantation
} from './AdministrationImplantation'


describe('hasSqlInjectionAddImplantation', () => {
              test('returns false when no SQL injection found', () => {
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'some value';
                            form.appendChild(input);
                            expect(hasSqlInjectionAddImplantation(form)).toBe(false);
              });

              test('returns true when SQL injection found', () => {
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'select * from users';
                            form.appendChild(input);
                            expect(hasSqlInjectionAddImplantation(form)).toBe(true);
              });
});

describe('hasSqlInjectionModifyImplantation', () => {
              test('returns false when no SQL injection is found', () => {
                            const selectedImplantation = 'validImplantationName';
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'validInputValue';
                            form.appendChild(input);

                            const result = hasSqlInjectionModifyImplantation(selectedImplantation, form);
                            expect(result).toBe(false);
              });

              test('returns true when SQL injection is found in selectedImplantation', () => {
                            const selectedImplantation = 'invalidImplantationName; DROP TABLE users;';
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'validInputValue';
                            form.appendChild(input);

                            const result = hasSqlInjectionModifyImplantation(selectedImplantation, form);
                            expect(result).toBe(true);
              });

              test('returns true when SQL injection is found in form elements', () => {
                            const selectedImplantation = 'validImplantationName';
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'invalidInputValue; DROP TABLE users;';
                            form.appendChild(input);

                            const result = hasSqlInjectionModifyImplantation(selectedImplantation, form);
                            expect(result).toBe(true);
              });

              test('returns true when SQL injection is found in both selectedImplantation and form elements', () => {
                            const selectedImplantation = 'invalidImplantationName; DROP TABLE users;';
                            const form = document.createElement('form');
                            const input = document.createElement('input');
                            input.value = 'invalidInputValue; DROP TABLE users;';
                            form.appendChild(input);

                            const result = hasSqlInjectionModifyImplantation(selectedImplantation, form);
                            expect(result).toBe(true);
              });
});

describe('hasSqlInjectionDeleteImplantation', () => {
              test('should return true when SQL injection is found in selectedImplantation', () => {
                            const selectedImplantation = "'; DROP TABLE implantations; --";
                            const roomsIds = [1, 2, 3];
                            expect(hasSqlInjectionDeleteImplantation(selectedImplantation, roomsIds)).toBe(true);
              });

              test('should return true when SQL injection is found in any room id', () => {
                            const selectedImplantation = "validInput";
                            const roomsIds = ["'; DROP TABLE rooms; --", 4, 5];
                            expect(hasSqlInjectionDeleteImplantation(selectedImplantation, roomsIds)).toBe(true);
              });

              test('should return false when no SQL injection is found', () => {
                            const selectedImplantation = "validInput";
                            const roomsIds = [1, 2, 3];
                            expect(hasSqlInjectionDeleteImplantation(selectedImplantation, roomsIds)).toBe(false);
              });
});



describe('allFieldsCheckedDeleteImplantation', () => {
              test('returns false if selectedImplantation is not present', () => {
                            const result = allFieldsCheckedDeleteImplantation(null, [1, 2, 3]);
                            expect(result).toBe(false);
              });

              test('returns false if selectedImplantation is empty', () => {
                            const result = allFieldsCheckedDeleteImplantation('', [1, 2, 3]);
                            expect(result).toBe(false);
              });

              test('returns false if SQL injection is detected', () => {
                            const result = allFieldsCheckedDeleteImplantation('SELECT * FROM table;', [1, 2, 3]);
                            expect(result).toBe(false);
              });

              test('returns true if all fields are checked', () => {
                            const result = allFieldsCheckedDeleteImplantation('valid input', [1, 2, 3]);
                            expect(result).toBe(true);
              });
});

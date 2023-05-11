import { hasSqlInjectionAdmin, allFieldsCheckedDeleteAdmin, allFieldsCheckedAddAdmin } from './AdministrationUser';


describe('hasSqlInjectionAdmin', () => {
              // Test for SQL injection
              it('returns true for a string containing SQL injection keywords', () => {
                            const selectedUser = "'; DROP TABLE users; --";
                            const result = hasSqlInjectionAdmin(selectedUser);
                            expect(result).toBe(true);
              });

              // Test for no SQL injection
              it('returns false for a string not containing SQL injection keywords', () => {
                            const selectedUser = "John Doe";
                            const result = hasSqlInjectionAdmin(selectedUser);
                            expect(result).toBe(false);
              });
});

describe('allFieldsCheckedAddAdmin', () => {
              // Test for missing fields
              it('returns false and sets error message for missing fields', () => {
                            const selectedUser = null;
                            const result = allFieldsCheckedAddAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for empty fields
              it('returns false and sets error message for empty fields', () => {
                            const selectedUser = '';
                            const result = allFieldsCheckedAddAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for SQL injection
              it('returns false and sets error message for SQL injection', () => {
                            const selectedUser = "'; DROP TABLE users; --";
                            const result = allFieldsCheckedAddAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for no errors
              it('returns true for valid fields with no errors', () => {
                            const selectedUser = "John Doe";
                            const result = allFieldsCheckedAddAdmin(selectedUser);
                            expect(result).toBe(true);
              });
});

describe('allFieldsCheckedDeleteAdmin', () => {
              // Test for missing fields
              it('returns false and sets error message for missing fields', () => {
                            const selectedUser = null;
                            const result = allFieldsCheckedDeleteAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for empty fields
              it('returns false and sets error message for empty fields', () => {
                            const selectedUser = '';
                            const result = allFieldsCheckedDeleteAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for SQL injection
              it('returns false and sets error message for SQL injection', () => {
                            const selectedUser = "'; DROP TABLE users; --";
                            const result = allFieldsCheckedDeleteAdmin(selectedUser);
                            expect(result).toBe(false);
              });

              // Test for no errors
              it('returns true for valid fields with no errors', () => {
                            const selectedUser = "John Doe";
                            const result = allFieldsCheckedDeleteAdmin(selectedUser);
                            expect(result).toBe(true);
              });
});

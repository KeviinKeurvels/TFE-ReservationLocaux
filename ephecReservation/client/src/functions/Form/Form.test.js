// Import the function to be tested
import { hasSqlInjection } from './Form';

describe('hasSqlInjection', () => {
              it('returns false when no SQL injection is found', () => {
                const form = document.createElement('form');
            
                form.innerHTML = `
                  <input type="text" name="input1" value="test">
                  <input type="text" name="input2" value="test">
                  <textarea name="textarea" rows="4" cols="50">test</textarea>
                  <select name="select">
                    <option value="test">Test</option>
                  </select>
                `;
            
                expect(hasSqlInjection(form)).toBe(false);
              });
            
              it('returns true when a field value contains a SELECT statement', () => {
                const form = document.createElement('form');
            
                form.innerHTML = `
                  <input type="text" name="input1" value="test">
                  <input type="text" name="input2" value="test">
                  <textarea name="textarea" rows="4" cols="50">SELECT * FROM users</textarea>
                  <select name="select">
                    <option value="test">Test</option>
                  </select>
                `;
            
                expect(hasSqlInjection(form)).toBe(true);
              });
            
              it('returns true when a field value contains an INSERT statement', () => {
                const form = document.createElement('form');
            
                form.innerHTML = `
                  <input type="text" name="input1" value="test">
                  <input type="text" name="input2" value="test">
                  <textarea name="textarea" rows="4" cols="50">INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')</textarea>
                  <select name="select">
                    <option value="test">Test</option>
                  </select>
                `;
            
                expect(hasSqlInjection(form)).toBe(true);
              });
            
              it('returns true when a field value contains an UPDATE statement', () => {
                const form = document.createElement('form');
            
                form.innerHTML = `
                  <input type="text" name="input1" value="test">
                  <input type="text" name="input2" value="test">
                  <textarea name="textarea" rows="4" cols="50">UPDATE users SET name = 'Jane Doe' WHERE id = 1</textarea>
                  <select name="select">
                    <option value="test">Test</option>
                  </select>
                `;
            
                expect(hasSqlInjection(form)).toBe(true);
              });
            
              it('returns true when a field value contains a DELETE statement', () => {
                const form = document.createElement('form');
            
                form.innerHTML = `
                  <input type="text" name="input1" value="test">
                  <input type="text" name="input2" value="test">
                  <textarea name="textarea" rows="4" cols="50">DELETE FROM users WHERE id = 1</textarea>
                  <select name="select">
                    <option value="test">Test</option>
                  </select>
                `;
            
                expect(hasSqlInjection(form)).toBe(true);
              });
            });

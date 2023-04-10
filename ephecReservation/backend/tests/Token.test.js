import {generatePassword, hashPassword} from '../functions/Token'

describe('generatePassword', () => {
              it('should generate a password of the specified length', () => {
                const length = 10;
                const password = generatePassword(length);
                expect(password).toHaveLength(length);
              });
            
              it('should generate a different password each time', () => {
                const length = 10;
                const password1 = generatePassword(length);
                const password2 = generatePassword(length);
                expect(password1).not.toEqual(password2);
              });
            
              it('should generate a password containing only valid characters', () => {
                const length = 10;
                const password = generatePassword(length);
                const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
                const regex = new RegExp(`^[${charset}]+$`);
                expect(password).toMatch(regex);
              });
            });
            
            
            
            
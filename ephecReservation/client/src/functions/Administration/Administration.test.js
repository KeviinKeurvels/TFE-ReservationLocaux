import {allFieldsCheckedDeleteRoom, hasSqlInjectionUnavailable, hasSqlInjectionAddRoom, hasSqlInjectionDeleteRoom} from './Administration';



describe('allFieldsCheckedDeleteRoom function', () => {
  test('should detect missing selectedRoom parameter', () => {
    const result = allFieldsCheckedDeleteRoom(null);
    expect(result).toBe(false);
  });

  test('should detect empty selectedRoom parameter', () => {
    const result = allFieldsCheckedDeleteRoom('');
    expect(result).toBe(false);
  });

  test('should detect SQL injection in selectedRoom parameter', () => {
    const result = allFieldsCheckedDeleteRoom('DROP TABLE users;');
    expect(result).toBe(false);
  });

  test('should pass all checks', () => {
    const result = allFieldsCheckedDeleteRoom('validRoom');
    expect(result).toBe(true);
  });
});



describe('hasSqlInjectionAddRoom function', () => {
  it('should detect SQL injection in selectedImplantation parameter', () => {
    const selectedImplantation = 'select * from users;';
    const form = document.createElement('form');
    expect(hasSqlInjectionAddRoom(selectedImplantation, form)).toBe(true);
  });

  it('should detect SQL injection in form field values', () => {
    const selectedImplantation = 'validImplantation';
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.value = 'SELECT * FROM users;';
    form.appendChild(input);
    expect(hasSqlInjectionAddRoom(selectedImplantation, form)).toBe(true);
  });

  it('should not detect SQL injection if none exists', () => {
    const selectedImplantation = 'validImplantation';
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.value = 'valid value';
    form.appendChild(input);
    expect(hasSqlInjectionAddRoom(selectedImplantation, form)).toBe(false);
  });
});

describe('hasSqlInjectionDeleteRoom function', () => {
  it('should detect SQL injection in selectedRoom parameter', () => {
    const selectedRoom = 'DROP TABLE users;';
    expect(hasSqlInjectionDeleteRoom(selectedRoom)).toBe(true);
  });

  it('should not detect SQL injection if none exists', () => {
    const selectedRoom = 'validRoom';
    expect(hasSqlInjectionDeleteRoom(selectedRoom)).toBe(false);
  });
});



describe('hasSqlInjectionUnavailable', () => {
  it('returns false when no SQL injection is found', () => {
    const selectedImplantation = 'test';
    const selectedRoom = 'test';
    const form = document.createElement('form');

    form.innerHTML = `
      <input type="text" name="input1" value="test">
      <input type="text" name="input2" value="test">
      <textarea name="textarea" rows="4" cols="50">test</textarea>
      <select name="select">
        <option value="test">Test</option>
      </select>
    `;

    expect(hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form)).toBe(false);
  });

  it('returns true when SQL injection is found in selectedImplantation', () => {
    const selectedImplantation = 'select * from users';
    const selectedRoom = 'test';
    const form = document.createElement('form');

    form.innerHTML = `
      <input type="text" name="input1" value="test">
      <input type="text" name="input2" value="test">
      <textarea name="textarea" rows="4" cols="50">test</textarea>
      <select name="select">
        <option value="test">Test</option>
      </select>
    `;

    expect(hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form)).toBe(true);
  });

  it('returns true when SQL injection is found in selectedRoom', () => {
    const selectedImplantation = 'test';
    const selectedRoom = 'drop table users';
    const form = document.createElement('form');

    form.innerHTML = `
      <input type="text" name="input1" value="test">
      <input type="text" name="input2" value="test">
      <textarea name="textarea" rows="4" cols="50">test</textarea>
      <select name="select">
        <option value="test">Test</option>
      </select>
    `;

    expect(hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form)).toBe(true);
  });

  it('returns true when SQL injection is found in a form field', () => {
    const selectedImplantation = 'test';
    const selectedRoom = 'test';
    const form = document.createElement('form');

    form.innerHTML = `
      <input type="text" name="input1" value="test">
      <input type="text" name="input2" value="select * from users">
      <textarea name="textarea" rows="4" cols="50">test</textarea>
      <select name="select">
        <option value="test">Test</option>
      </select>
    `;

    expect(hasSqlInjectionUnavailable(selectedImplantation, selectedRoom, form)).toBe(true);
  });
});


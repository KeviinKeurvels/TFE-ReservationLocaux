import {hasSqlInjection} from './Administration';



describe('hasSqlInjection', () => {
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

    expect(hasSqlInjection(selectedImplantation, selectedRoom, form)).toBe(false);
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

    expect(hasSqlInjection(selectedImplantation, selectedRoom, form)).toBe(true);
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

    expect(hasSqlInjection(selectedImplantation, selectedRoom, form)).toBe(true);
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

    expect(hasSqlInjection(selectedImplantation, selectedRoom, form)).toBe(true);
  });
});


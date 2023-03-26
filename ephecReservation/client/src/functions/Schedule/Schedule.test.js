import { formatDate, getInformationFromADate, checkIfThereIsAlreadyAReservation, allFieldsChecked } from './Schedule';

describe('formatDate', () => {
  it('should format the date in the correct format', () => {
    const date = new Date('2023-04-01');
    const result = formatDate(date);
    expect(result).toEqual('2023-04-01');
  });
});

describe('getInformationFromADate', () => {
  it('should set the chosen date when the date is valid', () => {
    const setDateChosen = jest.fn();
    const currentYear = 2023;
    const date = new Date('2023-04-01');

    getInformationFromADate(date, setDateChosen, currentYear);

    expect(setDateChosen).toHaveBeenCalledWith(date);
  });

  it('should return -1 when the date is invalid', () => {
    const setDateChosen = jest.fn();
    const currentYear = 2023;
    const date = new Date('2022-04-01');

    const result = getInformationFromADate(date, setDateChosen, currentYear);

    expect(result).toEqual(-1);
    expect(setDateChosen).not.toHaveBeenCalled();
  });
});

describe('checkIfThereIsAlreadyAReservation', () => {
  const reservations = [
    { hourBegin: '10:00', hourEnd: '11:00' },
    { hourBegin: '14:00', hourEnd: '15:00' },
  ];

  it('should return true when there is already a reservation at this time', () => {
    const dateChosen = '2023-04-01';
    const hourBegin = '10:30';
    const hourEnd = '11:30';

    const result = checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, reservations, dateChosen);

    expect(result).toEqual(true);
  });

  it('should return false when there is no reservation at this time', () => {
    const dateChosen = '2023-04-01';
    const hourBegin = '12:00';
    const hourEnd = '13:00';

    const result = checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, reservations, dateChosen);

    expect(result).toEqual(false);
  });
});


describe('allFieldsChecked', () => {
  it('should return true when all fields are valid', () => {
    const form = {
      day: { value: "2023-03-28" },
      hourBegin: { value: "09:00" },
      hourEnd: { value: "11:00" },
      nameReservation: { value: "Réunion d'équipe" }
    };

    const reservations = [];
    const currentYear = 2023;



    const result = allFieldsChecked(form, reservations, currentYear);

    expect(result).toBe(true);
  });

  it('should return false when hourEnd field is empty', () => {
    const form = {
      day: { value: "2023-03-28" },
      hourBegin: { value: "09:00" },
      hourEnd: { value: "" },
      nameReservation: { value: "Réunion d'équipe" }
    };

    const reservations = [];
    const currentYear = 2023;

    const result = allFieldsChecked(form, reservations, currentYear);

    expect(result).toBe(false);
  });

  it('should return false when hourBegin field is empty', () => {
    const form = {
      day: { value: "2023-03-28" },
      hourBegin: { value: "" },
      hourEnd: { value: "11:00" },
      nameReservation: { value: "Réunion d'équipe" }
    };

    const reservations = [];
    const currentYear = 2023;

    const result = allFieldsChecked(form, reservations, currentYear);

    expect(result).toBe(false);
  });

  it('should return false when nameReservation field is empty', () => {
    const form = {
      day: { value: "2023-03-28" },
      hourBegin: { value: "09:00" },
      hourEnd: { value: "11:00" },
      nameReservation: { value: "" }
    };

    const reservations = [];
    const currentYear = 2023;

    const result = allFieldsChecked(form, reservations, currentYear);

    expect(result).toBe(false);
  });

  it('should return false when day field is empty', () => {
    const form = {
      day: { value: "" },
      hourBegin: { value: "09:00" },
      hourEnd: { value: "11:00" },
      nameReservation: { value: "Réunion d'équipe" }
    };

    const reservations = [];
    const currentYear = 2023;

    const result = allFieldsChecked(form, reservations, currentYear);

    expect(result).toBe(false);
  });

});
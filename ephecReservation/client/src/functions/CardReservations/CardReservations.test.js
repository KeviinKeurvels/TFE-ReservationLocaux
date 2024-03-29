import { allFieldsChecked, checkIfThereIsAlreadyAReservation, convertDate  } from "./CardReservations";

describe('allFieldsChecked', () => {
              it('should return true when all fields are valid', () => {
                            const form = {
                                          hourBegin: { value: '09:00' },
                                          hourEnd: { value: '11:00' },
                                          nameReservation: { value: 'My reservation' },
                            };
                            const idReservation = 'reservationId';
                            const dayReservation = '2023-04-01';
                            const reservations = [];

                            const result = allFieldsChecked(form, idReservation, dayReservation, reservations);

                            expect(result).toBe(true);
              });

              it('Returns false and displays error message when form fields are empty', () => {
                const form = {
                  hourBegin: { value: '' },
                  hourEnd: { value: '' },
                  nameReservation: { value: '' },
                };
                const idReservation = '123';
                const dayReservation = '2023-04-02';
                const Reservations = [
                  { id: 'abc', day: '2023-04-02', hourBegin: '10:00', hourEnd: '11:00' },
                  { id: 'def', day: '2023-04-02', hourBegin: '14:00', hourEnd: '15:00' },
                ];

                const result = allFieldsChecked(form, idReservation, dayReservation, Reservations);
              
                expect(result).toBe(false);
              });
              

              it('should return false when hourEnd field is empty', () => {
                            const form = {
                                          hourBegin: { value: '09:00' },
                                          hourEnd: { value: '' },
                                          nameReservation: { value: 'My reservation' },
                            };
                            const idReservation = 'reservationId';
                            const dayReservation = '2023-04-01';
                            const reservations = [];

                            const result = allFieldsChecked(form, idReservation, dayReservation, reservations);

                            expect(result).toBe(false);
              });

              it('should return false when hourBegin field is empty', () => {
                            const form = {
                                          hourBegin: { value: '' },
                                          hourEnd: { value: '09:00' },
                                          nameReservation: { value: 'My reservation' },
                            };
                            const idReservation = 'reservationId';
                            const dayReservation = '2023-04-01';
                            const reservations = [];

                            const result = allFieldsChecked(form, idReservation, dayReservation, reservations);

                            expect(result).toBe(false);
              });

              it('should return false when nameReservation field is empty', () => {
                            const form = {
                                          hourBegin: { value: '09:00' },
                                          hourEnd: { value: '10:00' },
                                          nameReservation: { value: '' },
                            };
                            const idReservation = 'reservationId';
                            const dayReservation = '2023-04-01';
                            const reservations = [];

                            const result = allFieldsChecked(form, idReservation, dayReservation, reservations);

                            expect(result).toBe(false);
              });

              it('should return false when dayReservation field is empty', () => {
                            const form = {
                                          hourBegin: { value: '09:00' },
                                          hourEnd: { value: '10:00' },
                                          nameReservation: { value: 'My reservation' },
                            };
                            const idReservation = 'reservationId';
                            const dayReservation = '';
                            const reservations = [];

                            const result = allFieldsChecked(form, idReservation, dayReservation, reservations);

                            expect(result).toBe(false);
              });

});




describe('checkIfThereIsAlreadyAReservation', () => {
  const Reservations = [
    { idRe: 1, hourBegin: '09:00', hourEnd: '10:00' },
    { idRe: 2, hourBegin: '11:00', hourEnd: '12:00' },
  ];

  it('should return false if there are no existing reservations at the given time', () => {
    const hourBegin = '10:00';
    const hourEnd = '11:00';
    const dateChosen = '2023-01-01';
    const idReservation = 3;
    const alreadyReserved = checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, dateChosen, idReservation, Reservations);

    expect(alreadyReserved).toBe(false);
  });

  it('should return true if there is an existing reservation at the given time', () => {
    const hourBegin = '09:30';
    const hourEnd = '10:30';
    const dateChosen = '2023-01-01';
    const idReservation = 3;
    const alreadyReserved = checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, dateChosen, idReservation, Reservations);

    expect(alreadyReserved).toBe(true);
  });

  it('should not consider the current reservation when checking for existing reservations', () => {
    const hourBegin = '11:00';
    const hourEnd = '12:00';
    const dateChosen = '2023-01-01';
    const idReservation = 2;
    const alreadyReserved = checkIfThereIsAlreadyAReservation(hourBegin, hourEnd, dateChosen, idReservation, Reservations);

    expect(alreadyReserved).toBe(false);
  });
});


test('convertDate should return a formatted date string', () => {
              const date = new Date('2023-04-03'); // une date au format ISO
              const expected = '3/4/2023'; // le résultat attendu au format EU
              
              expect(convertDate(date)).toEqual(expected);
            });


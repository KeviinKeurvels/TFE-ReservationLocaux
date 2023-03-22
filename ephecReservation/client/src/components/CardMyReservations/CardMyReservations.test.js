import { render } from '@testing-library/react';
import CardMyReservations from './CardMyReservations';
let propsWithInfo = [{

              "idRe": 1,
              "teacherName":"",
              "hourBegin": "",
              "hourEnd": "",
              "title": "",
}
              ,
];

let propsWithoutInfo=[];

describe('CardMyReservations', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardMyReservations Reservations={propsWithInfo} />
                            )
              })
})

describe('CardMyReservations', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardMyReservations Reservations={propsWithoutInfo} />
                            )
              })
})
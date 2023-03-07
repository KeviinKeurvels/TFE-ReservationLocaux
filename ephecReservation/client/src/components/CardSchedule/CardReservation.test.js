import { render } from '@testing-library/react';
import CardReservation from './CardReservation';
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

describe('CardReservation', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardReservation Reservations={propsWithInfo} />
                            )
              })
})

describe('CardReservation', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardReservation Reservations={propsWithoutInfo} />
                            )
              })
})
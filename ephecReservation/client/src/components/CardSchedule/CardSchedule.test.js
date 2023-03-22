import { render } from '@testing-library/react';
import CardSchedule from './CardSchedule';
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

describe('CardSchedule', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardSchedule Reservations={propsWithInfo} />
                            )
              })
})

describe('CardSchedule', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardSchedule Reservations={propsWithoutInfo} />
                            )
              })
})
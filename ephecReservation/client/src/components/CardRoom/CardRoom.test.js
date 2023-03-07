import { render } from '@testing-library/react';
import CardRoom from './CardRoom';
let props = [{

              "idRo": 1,
              "name": "",
              "description": "",
}
              ,
];

describe('CardRoom', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardRoom Rooms={props} />
                            )
              })
})
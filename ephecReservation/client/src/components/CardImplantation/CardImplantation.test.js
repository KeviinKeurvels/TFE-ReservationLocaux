import { render } from '@testing-library/react';
import CardImplantation from './CardImplantation';
let props = [{

              "idIm": 1,
              "name": "",
              "description": "",
}
              ,
];

describe('CardImplantation', () => {
              it('Should render without crash', async () => {
                            render(
                                          <CardImplantation Implantations={props} />
                            )
              })
})
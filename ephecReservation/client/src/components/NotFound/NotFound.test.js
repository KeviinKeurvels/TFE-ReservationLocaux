import { render } from '@testing-library/react';
import NotFound from './NotFound';

describe('CardRoom', () => {
              it('Should render without crash', async () => {
                            render(
                                          <NotFound />
                            )
              })
})
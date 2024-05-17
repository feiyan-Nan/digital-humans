import { render } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from '../src/pages/index';

describe('<App />', () => {
  it('should render the App', () => {
    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>,
    );

    expect(container).toBeInTheDocument();
  });
});

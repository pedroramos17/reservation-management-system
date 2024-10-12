
import {render, fireEvent, screen} from '@testing-library/react'
import { useRouter } from 'next/navigation';
import App from "@/app/page";
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]))
  })
)

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: jest.fn(),
        push: jest.fn(),
        events: {
          on: jest.fn(),
          off: jest.fn(),
          emit: jest.fn(),
        },
        isFallback: false,
    }),
}));

describe('App Component', () => {
  it('should push to /propriedades on render', () => {
    const replaceMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });

    

    expect(replaceMock).toHaveBeenCalledWith('/propriedades');
  });
});
import React, { useRef } from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { Provider } from "react-redux";
import { AppStore, makeStore } from '@/lib/store';

const AllTheProviders = ({children}: Readonly<{children: React.ReactNode}>) => {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
  return (
    <Provider store={storeRef.current}>
        {children}
    </Provider>
  )
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, {wrapper: AllTheProviders, ...options})

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render}
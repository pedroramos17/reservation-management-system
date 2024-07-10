import React, { useMemo } from 'react';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import {HandleTabsProps} from '@/lib/interfaces/tab.interface';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const Tab = styled(BaseTab)`
  font-family: 'Roboto', sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: ${blue[200]};
  width: 100%;
  line-height: 1.5;
  padding: 8px 12px;
  margin: 6px;
  border: none;
  border-radius: 20px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[700]};
  }

  &.${tabClasses.selected} {
    background-color: ${blue[500]};
    color: #fff;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 400px;
  border-width: 4px;
  border-color: ${blue[400]};
  border-style: solid;
  border-radius: 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.4)' : 'rgba(0,0,0, 0.2)'
  };
  `,
);

export default function RoundedTabs(props: Readonly<HandleTabsProps>) {
  const { handleParkedTab } = props;
  const handleParkedTabChange = useMemo(
    () =>
      (
        event: React.SyntheticEvent<Element, Event> | null,
        value: number | string | null,
      ) => {
        handleParkedTab(event, value);
      },
    [handleParkedTab],
  );

  return (
    <div>
      <Tabs onChange={handleParkedTabChange} defaultValue={0}>
        <TabsList>
          <Tab value={0}>Entrada</Tab>
          <Tab value={1}>Saída</Tab>
        </TabsList>
      </Tabs>
    </div>
  );
}

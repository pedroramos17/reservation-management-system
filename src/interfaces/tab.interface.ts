import React from 'react';

export interface HandleTabsProps {
  handleParkedTab: (
    event: React.SyntheticEvent<Element, Event> | null,
    value: number | string | null,
  ) => void;
}

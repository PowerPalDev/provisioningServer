import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../../pages/HomePage';

export default {
  title: 'Pages/HomePage',
  component: HomePage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof HomePage>;

const Template: StoryFn<typeof HomePage> = () => <HomePage />;

export const Default = Template.bind({});
Default.args = {
  devices: [
    { id: 1, name: 'Device 1', mac_address: '00:1A:79:XX:XX:XX', notes: 'Notes 1', user_name: 'User1' },
    { id: 2, name: 'Device 2', mac_address: '00:1B:80:XX:XX:XX', notes: 'Notes 2', user_name: 'User2' },
  ],
  loading: false,
  onAddDevice: () => alert('Add Device Clicked'),
  onDeleteDevice: (id: number) => alert(`Delete Device ${id}`),
  onFilterChange: (userId: string) => alert(`Filter Changed to ${userId}`),
};

import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../../pages/HomePage';
import { render, screen, fireEvent, within } from '@testing-library/react';

// Directly mock the module for Storybook
jest.mock('../hooks/useDevice', () => ({
  useDevice: () => ({
    devices: [
      { id: 1, name: 'Device 1', mac_address: '00:11:22:33:44:55', user_name: 'User1' },
      { id: 2, name: 'Device 2', mac_address: '66:77:88:99:AA:BB', user_name: 'User2' },
      { id: 3, name: 'Device 3', mac_address: 'CC:DD:EE:FF:00:11', user_name: 'User1' },
    ],
    loading: false,
    fetchDevices: jest.fn(),
    deleteDevice: jest.fn(),
  }),
}));

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
Default.args = {};

Default.play = async ({ canvasElement }) => {
  let canvas = within(canvasElement);

  const deviceButton = await canvas.findByRole('button', {
    name: /Add Device/i
  });
  const deviceListLabel = await canvas.findByRole('heading', {
    name: /Device List/i
  });

  // Select the user filter dropdown
  const userFilterSelect = screen.getByRole('combobox', { name: /Filter by User/i });

  // Verify that the initial value is "All Users"
  expect(userFilterSelect).toHaveValue('');

  // Simulate selecting a user from the dropdown
  fireEvent.change(userFilterSelect, { target: { value: 'User1' } });

  // Verify that the value of the combobox changes to "User1"
  await expect(userFilterSelect).toHaveValue('User1');

  // Verify that the filtered devices are displayed (at least one row for User1)
  const rows = await screen.findAllByRole('row');
  expect(rows.length).toBeGreaterThan(1); // Should display devices with User1
};

import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; // To simulate routing
import Navbar from '../components/NavBar';

// Mock for navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock for AddUserDialog component
jest.mock('./Dialogs/AddUserDialog', () => ({
  AddUserDialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
    <div>
      {open ? (
        <div style={{ border: '1px solid black', padding: '1rem', backgroundColor: 'white' }}>
          <p>Mocked AddUserDialog</p>
          <button onClick={handleClose}>Close</button>
        </div>
      ) : null}
    </div>
  ),
}));

// Meta configuration
export default {
  title: 'Components/Navbar',
  component: Navbar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof Navbar>;

// Base template
const Template: StoryFn<{}> = () => <Navbar />;

// Default story
export const Default = Template.bind({});

// Another story where the AddUserDialog is open
export const WithDialogOpen = Template.bind({});
WithDialogOpen.args = {
  openUserDialog: true,
};

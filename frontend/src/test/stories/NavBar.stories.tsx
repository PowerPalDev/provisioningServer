import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { useState } from 'react';
import { AddUserDialog } from '../../components/Dialogs/AddUserDialog';

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

const Template: StoryFn<{ openUserDialog?: boolean }> = ({ openUserDialog = false }) => {
  // Usa il prop per simulare l'apertura del dialog
  const [openDialog, setOpenDialog] = useState(openUserDialog);

  return (
    <>
      <Navbar />
      {openDialog && <AddUserDialog open={openDialog} handleClose={() => setOpenDialog(false)} />}
    </>
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  openUserDialog: false, // Dialog inizialmente chiuso
};

// Story per aprire il dialog
export const WithDialogOpen = Template.bind({});
WithDialogOpen.args = {
  openUserDialog: true, // Dialog inizialmente aperto
};

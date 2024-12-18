import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../../components/NavBar';
import { AddUserDialog } from '../../../components/dialogs/AddUserDialog';

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

const Template: StoryFn = (args) => {
  const [openDialog, setOpenDialog] = useState(args.openUserDialog || false);

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <>
      <Navbar {...args} />
      {openDialog && <AddUserDialog open={openDialog} handleClose={handleDialogClose} />}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  openUserDialog: false,
};

export const WithDialogOpen = Template.bind({});
WithDialogOpen.args = {
  openUserDialog: true,
};

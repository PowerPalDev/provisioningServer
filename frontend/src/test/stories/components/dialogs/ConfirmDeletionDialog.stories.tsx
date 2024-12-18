import { Meta, StoryFn } from "@storybook/react";
import { DeleteConfirmationDialog } from "../../../../components/dialogs/ConfirmDelete";
import { action } from '@storybook/addon-actions';

interface DeleteProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  title?: string;
  message?: string;
}

export default {
  title: 'Dialogs/Errors/ConfirmDeletion',
  component: DeleteConfirmationDialog,
  argTypes: {
    open: { control: 'boolean' },
    errorText: { control: 'text' },
  },
} as Meta<typeof DeleteConfirmationDialog>;

const Template: StoryFn<DeleteProps> = (args: DeleteProps) => {
  const handleClose = () => {
    console.log("Dialog closed");
    action('closeDialog')("Dialog closed");
  };

  const handleDelete = () => {
    action('deviceDeleted')("Device deleted");
  };

  return <DeleteConfirmationDialog {...args} handleClose={handleClose} handleDelete={handleDelete} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  handleClose: action('closeDialog'),
  handleDelete: action('deviceDeleted'),
  title: "Default dialog",
  message: "This is a test"
};

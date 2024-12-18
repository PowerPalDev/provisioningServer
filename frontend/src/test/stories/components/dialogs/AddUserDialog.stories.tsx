import { Meta, StoryFn } from "@storybook/react";
import { AddUserDialog } from "../../../../components/dialogs/AddUserDialog";

type AddUserDialogProps = {
    open: boolean;
    handleClose: () => void;
}

export default{
    title: 'Components/Dialogs/Errors/AddUserDialog',
    component: AddUserDialog,
    argTypes: {
        open: {control: 'boolean'},
    },
} as Meta<typeof AddUserDialog>;

const Template: StoryFn<AddUserDialogProps> = (args: AddUserDialogProps) => {
    return <AddUserDialog {...args}/>;
}

export const Default = Template.bind({});
Default.args = {
    open: true
}
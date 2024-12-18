import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { AddDeviceDialog } from '../../../../components/dialogs/AddDeviceDialog';

type AddDeviceProps = {
    open: boolean;
    handleClose: () => void;
};

export default {
    title: 'Dialogs/AddDeviceDialog',
    component: AddDeviceDialog,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof AddDeviceDialog>;

const Template: StoryFn<AddDeviceProps> = (args) => {
    return <AddDeviceDialog {...args} />;
};

export const Default = Template.bind({});
Default.args = {
    open: true,
    handleClose: () => console.log("Dialog closed"),
};
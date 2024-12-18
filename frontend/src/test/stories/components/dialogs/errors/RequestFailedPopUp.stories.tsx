import { Meta, StoryFn } from '@storybook/react';
import RequestFailedPopUp from '../../../../../components/dialogs/errors/RequestFailedPopUp';

type RequestFailedProps = {
  open: boolean;
  onClose: () => void;
  errorText: string;
}

export default {
  title: 'Components/Dialogs/Errors/RequestFailedPopUp',
  component: RequestFailedPopUp,
  argTypes: {
    open: { control: 'boolean' },
    errorText: { control: 'text' },
  },
} as Meta<typeof RequestFailedPopUp>;

const Template: StoryFn<RequestFailedProps> = (args: RequestFailedProps) => {

  return <RequestFailedPopUp {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  errorText: 'Something went wrong! Please try again later.',
};

export const Closed = Template.bind({});
Closed.args = {
  open: false,
  errorText: 'Error occurred.',
};
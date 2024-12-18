import NotFoundPage from '../../../../../components/dialogs/errors/PageNotFound';
import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Dialogs/Errors/PageNotFound',  
  component: NotFoundPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof NotFoundPage>;

const Template: StoryFn = () => <NotFoundPage />;

export const Default = Template.bind({});

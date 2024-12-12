import NotFoundPage from '../../../components/Dialogs/errors/PageNotFound';
import { Meta, StoryFn } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; // Per simulare il routing

export default {
  title: 'Errors/PageNotFound',  // Il titolo che verrà visualizzato nella navigazione di Storybook
  component: NotFoundPage,      // Il componente che stai testando
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

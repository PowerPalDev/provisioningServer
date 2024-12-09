import { Meta, StoryFn } from '@storybook/react';
import PageNotFound from '../../components/Dialogs/errors/PageNotFound'; // Update with the correct path

// Default export with metadata
export default {
  title: 'Components/PageNotFound',  // The name in the Storybook sidebar
  component: PageNotFound,           // The component you're documenting
} as Meta<typeof PageNotFound>;

// Story template
const Template: StoryFn = () => <PageNotFound />;

// Default story
export const Default = Template.bind({});

import { Preview } from '@storybook/react';
import '../src/styles.css';  // Import global styles if needed

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
    // docs: { theme: theme },
  },
};

export default preview;

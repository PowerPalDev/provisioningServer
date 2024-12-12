module.exports = {
  stories: [
    '../src/stories/**/*.mdx',  // Storie in formato MDX
    '../src/stories/**/*.stories.@(ts|tsx|js|jsx)',  // Storie con estensione TS/JS
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin',  // Usa il plugin per la documentazione
  },
};

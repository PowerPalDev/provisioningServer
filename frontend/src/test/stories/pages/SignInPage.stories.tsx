import { Meta, StoryFn } from "@storybook/react";
import SignIn from "../../../pages/SignInPage";
import { MemoryRouter } from "react-router-dom";

export default {
    title: 'Pages/SignInPage',
    component: SignIn,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        )
    ]
  } as Meta<typeof SignIn>;

const Template: StoryFn = () => <SignIn />

export const Default = Template.bind({});
Default.args = {};
import Box from '@/components/modules/auth/Box';
import FlashMessageRender from '@/components/FlashMessageRender';
import { faDiscord, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useStoreState } from '@/state/hooks';

export default () => {
    const modules = useStoreState(state => state.everest.data!.auth.modules);
    /**
     * Everest - Authentication Extensions
     *
     * name (string, required): The name for this extension. This MUST match the other files for this extension.
     * icon (IconDefinition, optional): The icon for this extension. This can be left blank.
     * title (string, required): The user-friendly name for this extension.
     * description (string, required): A short description on what this extension has to offer.
     *
     */
    return (
        <>
            <FlashMessageRender byKey={'auth:modules'} />
            <Box
                name={'discord'}
                icon={faDiscord}
                title={'Discord SSO'}
                disabled={modules.discord.enabled}
                description={'This module allows users to sign up and login via the Discord Authentication API.'}
            />
            <Box
                name={'google'}
                icon={faGoogle}
                title={'Google SSO'}
                description={'This module allows your users to sign in via the Google Logins API.'}
            />
            <Box
                name={'github'}
                icon={faGithub}
                title={'GitHub SSO'}
                description={'This module allows your users to sign in via the Github Auth API.'}
            />
        </>
    );
};
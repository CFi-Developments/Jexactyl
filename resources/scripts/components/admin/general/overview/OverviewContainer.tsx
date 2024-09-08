import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import type { VersionData } from '@/api/admin/getVersion';
import getVersion from '@/api/admin/getVersion';
import AdminContentBlock from '@elements/AdminContentBlock';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import AdminBox from '@elements/AdminBox';
import Spinner from '@elements/Spinner';
import CopyOnClick from '@elements/CopyOnClick';

const Code = ({ children }: { children: ReactNode }) => {
    return (
        <code css={tw`text-sm font-mono bg-neutral-900 rounded`} style={{ padding: '2px 6px' }}>
            {children}
        </code>
    );
};

export default () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [versionData, setVersionData] = useState<VersionData | undefined>(undefined);

    useEffect(() => {
        clearFlashes('overview');

        getVersion()
            .then(versionData => setVersionData(versionData))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'overview', error });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <AdminContentBlock title={'Overview'}>
            <div css={tw`w-full flex flex-row items-center mb-8`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>Overview</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                        A quick glance at your system.
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'overview'} css={tw`mb-4`} />

            <AdminBox title={'Version Information'} icon={faDesktop}>
                {loading ? (
                    <Spinner size={'large'} centered />
                ) : (
                    <>
                        <div className={'text-gray-200 mb-2'}>
                            You are currently running version&nbsp;
                            <CopyOnClick text={versionData?.panel.current}>
                                <Code>{versionData?.panel.current}</Code>
                            </CopyOnClick>
                            , with the latest release being &nbsp;
                            <CopyOnClick text={versionData?.panel.latest}>
                                <Code>{versionData?.panel.latest}</Code>
                            </CopyOnClick>
                            .
                        </div>
                    </>
                )}
            </AdminBox>
        </AdminContentBlock>
    );
};

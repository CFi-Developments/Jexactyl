import Pill from '@elements/Pill';
import Spinner from '@elements/Spinner';
import useFlash from '@/plugins/useFlash';
import { useEffect, useState } from 'react';
import { useStoreState } from '@/state/hooks';
import { Link, useParams } from 'react-router-dom';
import SpinnerOverlay from '@elements/SpinnerOverlay';
import { Button } from '@/components/elements/button';
import PageContentBlock from '@elements/PageContentBlock';
import ContentBox from '@/components/elements/ContentBox';
import getServer, { Server } from '@/api/server/getServer';
import StatBlock from '@/components/server/console/StatBlock';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import { format, type } from '@/components/billing/plans/PlansContainer';
import { BillingPlan, getBillingPlan } from '@/api/billing/getBillingPlans';
import CancelPlanButton from '@/components/billing/plans/forms/CancelPlanButton';
import { faHdd, faIdBadge, faMemory, faMicrochip, faNewspaper, faServer } from '@fortawesome/free-solid-svg-icons';

export default () => {
    const params = useParams<'id'>();
    const [server, setServer] = useState<Server>();
    const [plan, setPlan] = useState<BillingPlan>();
    const { colors } = useStoreState(s => s.theme.data!);
    const [loading, setLoading] = useState<boolean>(false);

    const { clearFlashes, clearAndAddHttpError } = useFlash();

    useEffect(() => {
        clearFlashes();
        setLoading(true);

        getBillingPlan(Number(params.id))
            .then(data => {
                setPlan(data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                clearAndAddHttpError({ key: 'billing:plans:view', error });
            });
    }, []);

    useEffect(() => {
        if (!plan || server) return;

        getServer(plan.serverId)
            .then(data => setServer(data[0]))
            .catch(error => console.error(error));
    }, [plan]);

    if (!plan) return <Spinner centered />;

    return (
        <PageContentBlock>
            <div className={'text-3xl lg:text-5xl font-bold mt-8 mb-12'}>
                {plan.name}
                <p className={'text-gray-400 font-normal text-sm mt-1'}>
                    This plan is marked as
                    <Pill type={type(plan.state)} small>
                        {plan.state}
                    </Pill>
                    and is billed on the {format(plan.billDate)} of every month.
                </p>
                <FlashMessageRender byKey={'billing:plans:view'} className={'mt-4'} />
            </div>
            <SpinnerOverlay visible={loading} />
            <div className={'grid lg:grid-cols-2 gap-4'}>
                <div>
                    <TitledGreyBox title={'General Information'} icon={faIdBadge}>
                        <div className={'p-1 lg:p-3'}>
                            <p
                                style={{ color: colors.primary }}
                                className={'text-2xl lg:text-5xl font-semibold brightness-150 mt-2'}
                            >
                                <span className={'text-lg lg:text-2xl text-gray-400'}>$</span>
                                {plan.price}
                                <span className={'text-lg lg:text-xl text-gray-400'}>/month</span>
                            </p>
                            <div className={'h-px bg-gray-900 rounded-full my-4'} />
                            <div className={'grid lg:grid-cols-3 gap-4'}>
                                <div>
                                    <p className={'font-semibold mb-1'}>Description</p>
                                    <p className={'text-sm text-gray-400 line-clamp-1'}>{plan.description}</p>
                                </div>
                                <div>
                                    <p className={'font-semibold mb-1'}>Billing Information</p>
                                    <p className={'text-sm text-gray-400'}>
                                        ${plan.price} ({format(plan.billDate)} of month)
                                    </p>
                                </div>
                                <div>
                                    <p className={'font-semibold mb-1'}>Support ID</p>
                                    <p className={'text-sm text-gray-400 line-clamp-1'}>{plan.uuid}</p>
                                </div>
                            </div>
                        </div>
                    </TitledGreyBox>
                    <TitledGreyBox title={'Specifications'} className={'mt-3'} icon={faMicrochip}>
                        <div className={'grid lg:grid-cols-3 gap-4'}>
                            <StatBlock title={'CPU Limit'} icon={faMicrochip} dark>
                                {plan.limits.cpu}%
                            </StatBlock>
                            <StatBlock title={'Memory Limit'} icon={faMemory} dark>
                                {(plan.limits.memory / 1024).toFixed(1)} GiB
                            </StatBlock>
                            <StatBlock title={'Disk Limit'} icon={faHdd} dark>
                                {(plan.limits.disk / 1024).toFixed(1)} GiB
                            </StatBlock>
                        </div>
                        <div className={'grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-center'}>
                            <StatBlock title={'Backups'} dark>
                                {plan.limits.backup}
                            </StatBlock>
                            <StatBlock title={'Databases'} dark>
                                {plan.limits.database}
                            </StatBlock>
                            <StatBlock title={'Ports'} dark>
                                {plan.limits.allocation}
                            </StatBlock>
                            <StatBlock title={'Subusers'} dark>
                                N/A
                            </StatBlock>
                        </div>
                    </TitledGreyBox>
                </div>
                <div>
                    <TitledGreyBox title={'Linked Server'} icon={faServer}>
                        {server ? (
                            <Link to={`/server/${server.id}`}>
                                <div className={'rounded bg-black/25 w-full p-4 hover:brightness-150 duration-300'}>
                                    <p className={'font-semibold'}>
                                        <span style={{ color: colors.primary }}>{server.name}</span>
                                        <span className={'text-sm font-mono text-gray-400 font-normal ml-2'}>
                                            {server.uuid}
                                        </span>
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className={'text-sm text-gray-400 p-2'}>
                                <Spinner className={'inline-flex'} size={'small'} />
                                <span className={'ml-2'}>attempting to retrieve associated server...</span>
                            </div>
                        )}
                    </TitledGreyBox>
                    <TitledGreyBox title={'Bill Details'} icon={faNewspaper} className={'mt-6'}>
                        <p className={'text-gray-400 p-2 text-sm'}>
                            You can go to <span className={'text-blue-400'}>Stripe</span> to view additional details
                            about your billing plan.
                        </p>
                    </TitledGreyBox>
                    <ContentBox className={'mt-6 text-right'}>
                        <CancelPlanButton identifier={plan.uuid} />
                        <Button className={'mx-2'}>Renew Plan</Button>
                        <Button.Info>Edit Plan</Button.Info>
                    </ContentBox>
                </div>
            </div>
        </PageContentBlock>
    );
};

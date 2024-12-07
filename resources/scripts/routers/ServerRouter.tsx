import TransferListener from '@/components/server/TransferListener';
import { Fragment, useEffect, useState } from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import Spinner from '@elements/Spinner';
import { NotFound, ServerError, Suspended } from '@elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@elements/ErrorBoundary';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import MobileSidebar from '@/components/elements/MobileSidebar';
import PermissionRoute from '@elements/PermissionRoute';
import routes from '@/routers/routes';
import Sidebar from '@/components/elements/Sidebar';
import { usePersistedState } from '@/plugins/usePersistedState';
import CollapsedIcon from '@/assets/images/logo.png';
import Avatar from '@/components/Avatar';
import {
    ArchiveIcon,
    ClockIcon,
    CogIcon,
    CurrencyDollarIcon,
    DatabaseIcon,
    DesktopComputerIcon,
    DocumentIcon,
    FolderIcon,
    PlayIcon,
    ReplyIcon,
    TerminalIcon,
    UsersIcon,
    WifiIcon,
} from '@heroicons/react/outline';
import {
    faArchive,
    faClock,
    faCog,
    faDatabase,
    faDollar,
    faEthernet,
    faEye,
    faFolder,
    faPlay,
    faTerminal,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';

function ServerRouter() {
    const params = useParams<'id'>();
    const location = useLocation();

    const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
    const [error, setError] = useState('');

    const user = useStoreState(state => state.user.data!);
    const theme = useStoreState(state => state.theme.data!);
    const name = useStoreState(state => state.settings.data!.name);
    const id = ServerContext.useStoreState(state => state.server.data?.id);
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid);
    const inConflictState = ServerContext.useStoreState(state => state.server.inConflictState);
    const status = ServerContext.useStoreState(state => state.server.data?.status);
    const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions(actions => actions.clearServerState);
    const [collapsed, setCollapsed] = usePersistedState<boolean>(`sidebar_user_${user.uuid}`, false);
    const serverId = ServerContext.useStoreState(state => state.server.data?.internalId);
    const billable = ServerContext.useStoreState(state => state.server.data?.orderId);
    const daysUntilRenewal = ServerContext.useStoreState(state => state.server.data?.daysUntilRenewal);

    useEffect(() => {
        clearServerState();
    }, []);

    useEffect(() => {
        setError('');

        if (params.id === undefined) {
            return;
        }

        getServer(params.id).catch(error => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [params.id]);

    if (status === 'suspended' && billable) return <Suspended days={daysUntilRenewal ?? 0} />;

    return (
        <Fragment key={'server-router'}>
            <div className={'h-screen flex'}>
                <MobileSidebar>
                    <MobileSidebar.Home />
                    <MobileSidebar.Link icon={faTerminal} text={'Console'} linkTo={`/server/${id}`} end />
                    {billable && (
                        <MobileSidebar.Link icon={faDollar} text={'Billing'} linkTo={`/server/${id}/billing`} />
                    )}
                    <MobileSidebar.Link icon={faEye} text={'Activity'} linkTo={`/server/${id}/activity`} />
                    <MobileSidebar.Link icon={faFolder} text={'Files'} linkTo={`/server/${id}/files`} />
                    <MobileSidebar.Link icon={faDatabase} text={'Databases'} linkTo={`/server/${id}/databases`} />
                    <MobileSidebar.Link icon={faArchive} text={'Backups'} linkTo={`/server/${id}/backups`} />
                    <MobileSidebar.Link icon={faClock} text={'Tasks'} linkTo={`/server/${id}/schedules`} />
                    <MobileSidebar.Link icon={faUsers} text={'Subusers'} linkTo={`/server/${id}/users`} />
                    <MobileSidebar.Link icon={faEthernet} text={'Network'} linkTo={`/server/${id}/network`} />
                    <MobileSidebar.Link icon={faPlay} text={'Startup'} linkTo={`/server/${id}/startup`} />
                    <MobileSidebar.Link icon={faCog} text={'Settings'} linkTo={`/server/${id}/settings`} />
                </MobileSidebar>
                <Sidebar className={'flex-none'} $collapsed={collapsed} theme={theme}>
                    <div
                        className={
                            'h-16 w-full flex flex-col items-center justify-center mt-1 mb-3 select-none cursor-pointer'
                        }
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {!collapsed ? (
                            <h1 className={'text-2xl text-neutral-50 whitespace-nowrap font-medium'}>{name}</h1>
                        ) : (
                            <img src={CollapsedIcon} className={'mt-4 w-12'} alt={'Everest Icon'} />
                        )}
                    </div>
                    <Sidebar.Wrapper theme={theme}>
                        <NavLink to={'/'} end className={'mb-[18px]'}>
                            <DesktopComputerIcon />
                            <span>Dashboard</span>
                        </NavLink>
                        <Sidebar.Section>General</Sidebar.Section>
                        <NavLink to={`/server/${id}`} end>
                            <TerminalIcon />
                            <span>Console</span>
                        </NavLink>
                        {billable && (
                            <NavLink to={`/server/${id}/billing`}>
                                <CurrencyDollarIcon />
                                <span>Billing</span>
                            </NavLink>
                        )}
                        <NavLink to={`/server/${id}/activity`}>
                            <DocumentIcon />
                            <span>Activity</span>
                        </NavLink>
                        <Sidebar.Section>Data Management</Sidebar.Section>
                        <NavLink to={`/server/${id}/files`}>
                            <FolderIcon />
                            <span>Files</span>
                        </NavLink>
                        <NavLink to={`/server/${id}/databases`}>
                            <DatabaseIcon />
                            <span>Databases</span>
                        </NavLink>
                        <NavLink to={`/server/${id}/backups`}>
                            <ArchiveIcon />
                            <span>Backups</span>
                        </NavLink>
                        <Sidebar.Section>Server Controls</Sidebar.Section>
                        <NavLink to={`/server/${id}/schedules`}>
                            <ClockIcon />
                            <span>Tasks</span>
                        </NavLink>
                        <NavLink to={`/server/${id}/users`}>
                            <UsersIcon />
                            <span>Subusers</span>
                        </NavLink>
                        <NavLink to={`/server/${id}/network`}>
                            <WifiIcon />
                            <span>Network</span>
                        </NavLink>
                        <Sidebar.Section>Server Management</Sidebar.Section>
                        <NavLink to={`/server/${id}/startup`}>
                            <PlayIcon />
                            <span>Startup</span>
                        </NavLink>
                        <NavLink to={`/server/${id}/settings`}>
                            <CogIcon />
                            <span>Controls</span>
                        </NavLink>
                        {user.rootAdmin && (
                            <NavLink to={`/admin/servers/${serverId}`}>
                                <ReplyIcon />
                                <span>View as Admin</span>
                            </NavLink>
                        )}
                    </Sidebar.Wrapper>
                    <span className={'mt-auto mb-3 mr-auto'}>
                        {user.rootAdmin && (
                            <NavLink to={'/admin'}>
                                <CogIcon />
                                <span className={collapsed ? 'hidden' : ''}>Settings</span>
                            </NavLink>
                        )}
                    </span>
                    <Sidebar.User>
                        <span className="flex items-center">
                            <Avatar.User />
                        </span>
                        <div className={'flex flex-col ml-3'}>
                            <span
                                className={
                                    'font-sans font-normal text-xs text-gray-300 whitespace-nowrap leading-tight select-none'
                                }
                            >
                                <div className={'text-gray-400 text-sm'}>Welcome back,</div>
                                {user.email}
                            </span>
                        </div>
                    </Sidebar.User>
                </Sidebar>
                {!uuid || !id ? (
                    error ? (
                        <ServerError message={error} />
                    ) : (
                        <Spinner size="large" centered />
                    )
                ) : (
                    <div className={'flex-1 overflow-x-hidden p-4 lg:p-8'}>
                        <InstallListener />
                        <TransferListener />
                        <WebsocketHandler />
                        {inConflictState &&
                        (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                            <ConflictStateRenderer />
                        ) : (
                            <ErrorBoundary>
                                <Routes location={location}>
                                    {routes.server.map(({ route, permission, component: Component }) => (
                                        <Route
                                            key={route}
                                            path={route}
                                            element={
                                                <PermissionRoute permission={permission}>
                                                    <Spinner.Suspense>
                                                        <Component />
                                                    </Spinner.Suspense>
                                                </PermissionRoute>
                                            }
                                        />
                                    ))}

                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </ErrorBoundary>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default ServerRouter;

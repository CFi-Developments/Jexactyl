import {
    CashIcon,
    CodeIcon,
    CogIcon,
    DatabaseIcon,
    FolderIcon,
    GlobeIcon,
    KeyIcon,
    OfficeBuildingIcon,
    PencilIcon,
    ReplyIcon,
    ServerIcon,
    ShieldExclamationIcon,
    SparklesIcon,
    TerminalIcon,
    TicketIcon,
    UsersIcon,
    ViewGridIcon,
} from '@heroicons/react/outline';
import { useStoreState } from 'easy-peasy';
import { NavLink, Route, Routes } from 'react-router-dom';
import tw from 'twin.macro';
import Avatar from '@/components/Avatar';
import CollapsedIcon from '@/assets/images/logo.png';
import OverviewContainer from '@admin/general/overview/OverviewContainer';
import SettingsContainer from '@admin/general/settings/SettingsRouter';
import DatabasesContainer from '@admin/management/databases/DatabasesContainer';
import NewDatabaseContainer from '@admin/management/databases/NewDatabaseContainer';
import DatabaseEditContainer from '@admin/management/databases/DatabaseEditContainer';
import NodesContainer from '@admin/management/nodes/NodesContainer';
import NewNodeContainer from '@admin/management/nodes/NewNodeContainer';
import NodeRouter from '@admin/management/nodes/NodeRouter';
import LocationsContainer from '@admin/management/locations/LocationsContainer';
import LocationEditContainer from '@admin/management/locations/LocationEditContainer';
import ServersContainer from '@admin/management/servers/ServersContainer';
import NewServerContainer from '@admin/management/servers/NewServerContainer';
import ServerRouter from '@admin/management/servers/ServerRouter';
import NewUserContainer from '@admin/management/users/NewUserContainer';
import UserRouter from '@admin/management/users/UserRouter';
import NestsContainer from '@admin/service/nests/NestsContainer';
import NestEditContainer from '@admin/service/nests/NestEditContainer';
import NewEggContainer from '@admin/service/nests/NewEggContainer';
import EggRouter from '@admin/service/nests/eggs/EggRouter';
import MountsContainer from '@admin/service/mounts/MountsContainer';
import NewMountContainer from '@admin/service/mounts/NewMountContainer';
import MountEditContainer from '@admin/service/mounts/MountEditContainer';
import { NotFound } from '@elements/ScreenBlock';
import type { ApplicationStore } from '@/state';
import Sidebar from '@elements/Sidebar';
import UsersContainer from '@admin/management/users/UsersContainer';
import ApiContainer from '@admin/general/api/ApiContainer';
import NewApiKeyContainer from '@admin/general/api/NewApiKeyContainer';
import AuthContainer from '@admin/modules/auth/AuthContainer';
import TicketRouter from '@admin/modules/tickets/TicketRouter';
import ThemeContainer from '@admin/modules/theme/ThemeContainer';
import BillingRouter from '@admin/modules/billing/BillingRouter';
import AdminIndicators from '@/components/admin/AdminIndicators';
import AlertRouter from '@/components/admin/modules/alert/AlertRouter';
import { usePersistedState } from '@/plugins/usePersistedState';
import AIRouter from '@/components/admin/modules/ai/AIRouter';

function AdminRouter() {
    const theme = useStoreState(state => state.theme.data!);
    const mode = useStoreState(state => state.settings.data!.mode);
    const user = useStoreState((state: ApplicationStore) => state.user.data!);
    const settings = useStoreState((state: ApplicationStore) => state.settings.data!);

    const [collapsed, setCollapsed] = usePersistedState<boolean>(`sidebar_${user.uuid}`, false);

    return (
        <div css={tw`h-screen flex`}>
            {settings.indicators && <AdminIndicators />}
            <Sidebar css={tw`flex-none`} $collapsed={collapsed} theme={theme}>
                <div
                    css={tw`h-16 w-full flex flex-col items-center justify-center mt-1 mb-3 select-none cursor-pointer`}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {!collapsed ? (
                        <h1 css={tw`text-2xl text-neutral-50 whitespace-nowrap font-medium`}>{settings.name}</h1>
                    ) : (
                        <img src={CollapsedIcon} css={tw`mt-4 w-12`} alt={'Everest Icon'} />
                    )}
                </div>
                <Sidebar.Wrapper theme={theme}>
                    <Sidebar.Section>General</Sidebar.Section>
                    <NavLink to="/admin" end>
                        <OfficeBuildingIcon />
                        <span>Overview</span>
                    </NavLink>
                    <NavLink to="/admin/settings">
                        <CogIcon />
                        <span>Settings</span>
                    </NavLink>
                    {mode === 'standard' && (
                        <NavLink to="/admin/api">
                            <CodeIcon />
                            <span>API</span>
                        </NavLink>
                    )}
                    <Sidebar.Section>Modules</Sidebar.Section>
                    {mode === 'standard' && (
                        <>
                            <NavLink to="/admin/auth">
                                <KeyIcon />
                                <span>Auth</span>
                            </NavLink>
                            <NavLink to="/admin/billing">
                                <CashIcon />
                                <span>Billing</span>
                            </NavLink>
                            <NavLink to="/admin/tickets">
                                <TicketIcon />
                                <span>Tickets</span>
                            </NavLink>
                            <NavLink to="/admin/ai">
                                <SparklesIcon />
                                <span>AI</span>
                            </NavLink>
                        </>
                    )}

                    <NavLink to="/admin/alerts">
                        <ShieldExclamationIcon />
                        <span>Alerts</span>
                    </NavLink>
                    <NavLink to="/admin/theme">
                        <PencilIcon />
                        <span>Theme</span>
                    </NavLink>
                    <Sidebar.Section>Management</Sidebar.Section>
                    {mode === 'standard' && (
                        <NavLink to="/admin/databases">
                            <DatabaseIcon />
                            <span>Databases</span>
                        </NavLink>
                    )}
                    <NavLink to="/admin/locations">
                        <GlobeIcon />
                        <span>Locations</span>
                    </NavLink>
                    <NavLink to="/admin/nodes">
                        <ServerIcon />
                        <span>Nodes</span>
                    </NavLink>
                    <NavLink to="/admin/servers">
                        <TerminalIcon />
                        <span>Servers</span>
                    </NavLink>
                    <NavLink to="/admin/users">
                        <UsersIcon />
                        <span>Users</span>
                    </NavLink>
                    <Sidebar.Section>Services</Sidebar.Section>
                    <NavLink to="/admin/nests">
                        <ViewGridIcon />
                        <span>Nests</span>
                    </NavLink>
                    {mode === 'standard' && (
                        <NavLink to="/admin/mounts">
                            <FolderIcon />
                            <span>Mounts</span>
                        </NavLink>
                    )}
                </Sidebar.Wrapper>
                <NavLink to="/" css={tw`mt-auto mb-3`}>
                    <ReplyIcon />
                    <span>Return</span>
                </NavLink>
                <Sidebar.User>
                    <span className="flex items-center">
                        <Avatar.User />
                    </span>
                    <div css={tw`flex flex-col ml-3`}>
                        <span
                            css={tw`font-sans font-normal text-sm text-neutral-50 whitespace-nowrap leading-tight select-none`}
                        >
                            {user.email}
                        </span>
                    </div>
                </Sidebar.User>
            </Sidebar>

            <div css={tw`flex-1 overflow-x-hidden px-6 pt-6 lg:px-10 lg:pt-8 xl:px-16 xl:pt-12`}>
                <div css={tw`w-full flex flex-col mx-auto`} style={{ maxWidth: '86rem' }}>
                    <Routes>
                        <Route path="" element={<OverviewContainer />} />
                        <Route path="settings/*" element={<SettingsContainer />} />
                        <Route path="api" element={<ApiContainer />} />
                        <Route path="api/new" element={<NewApiKeyContainer />} />
                        <Route path="auth" element={<AuthContainer />} />
                        <Route path="billing/*" element={<BillingRouter />} />
                        <Route path="tickets/*" element={<TicketRouter />} />
                        <Route path="ai/*" element={<AIRouter />} />
                        <Route path="theme" element={<ThemeContainer />} />
                        <Route path="alerts/*" element={<AlertRouter />} />
                        <Route path="databases" element={<DatabasesContainer />} />
                        <Route path="databases/new" element={<NewDatabaseContainer />} />
                        <Route path="databases/:id" element={<DatabaseEditContainer />} />
                        <Route path="locations" element={<LocationsContainer />} />
                        <Route path="locations/:id" element={<LocationEditContainer />} />
                        <Route path="nodes" element={<NodesContainer />} />
                        <Route path="nodes/new" element={<NewNodeContainer />} />
                        <Route path="nodes/:id/*" element={<NodeRouter />} />
                        <Route path="servers" element={<ServersContainer />} />
                        <Route path="servers/new" element={<NewServerContainer />} />
                        <Route path="servers/:id/*" element={<ServerRouter />} />
                        <Route path="users" element={<UsersContainer />} />
                        <Route path="users/new" element={<NewUserContainer />} />
                        <Route path="users/:id/*" element={<UserRouter />} />
                        <Route path="nests" element={<NestsContainer />} />
                        <Route path="nests/:nestId" element={<NestEditContainer />} />
                        <Route path="nests/:nestId/new" element={<NewEggContainer />} />
                        <Route path="nests/:nestId/eggs/:id/*" element={<EggRouter />} />
                        <Route path="mounts" element={<MountsContainer />} />
                        <Route path="mounts/new" element={<NewMountContainer />} />
                        <Route path="mounts/:id" element={<MountEditContainer />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AdminRouter;

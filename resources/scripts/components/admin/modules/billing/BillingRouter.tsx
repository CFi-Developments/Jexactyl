import { useStoreState } from '@/state/hooks';
import { Route, Routes } from 'react-router-dom';
import { NotFound } from '@elements/ScreenBlock';
import AdminContentBlock from '@elements/AdminContentBlock';
import EnableBilling from '@admin/modules/billing/EnableBilling';
import FlashMessageRender from '@/components/FlashMessageRender';
import ProductForm from '@admin/modules/billing/products/ProductForm';
import CategoryForm from '@admin/modules/billing/products/CategoryForm';
import { SubNavigation, SubNavigationLink } from '@admin/SubNavigation';
import OverviewContainer from '@admin/modules/billing/OverviewContainer';
import CategoryTable from '@admin/modules/billing/products/CategoryTable';
import ProductContainer from '@admin/modules/billing/products/ProductContainer';
import CategoryContainer from '@admin/modules/billing/products/CategoryContainer';
import { DesktopComputerIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/outline';
import BillingAccountsContainer from '@admin/modules/billing/accounts/BillingAccountsContainer';

export default () => {
    const theme = useStoreState(state => state.theme.data!);
    const enabled = useStoreState(state => state.everest.data!.billing.enabled);

    if (!enabled) return <EnableBilling />;

    return (
        <AdminContentBlock title={'Billing'}>
            <div className={'w-full flex flex-row items-center mb-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>Billing</h2>
                    <p className={'text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'}>
                        Configure the billing settings for this panel.
                    </p>
                </div>
            </div>

            <FlashMessageRender byKey={'admin:billing'} className={'mb-4'} />

            <SubNavigation theme={theme}>
                <SubNavigationLink to={'/admin/billing'} name={'Overview'} base>
                    <DesktopComputerIcon />
                </SubNavigationLink>
                <SubNavigationLink to={'/admin/billing/categories'} name={'Products'}>
                    <ShoppingBagIcon />
                </SubNavigationLink>
                <SubNavigationLink to={'/admin/billing/accounts'} name={'Accounts'}>
                    <UsersIcon />
                </SubNavigationLink>
            </SubNavigation>
            <Routes>
                <Route path={'/'} element={<OverviewContainer />} />

                <Route path={'/categories'} element={<CategoryTable />} />
                <Route path={'/categories/new'} element={<CategoryForm />} />
                <Route path={'/categories/:id'} element={<CategoryContainer />} />

                <Route path={'/categories/:id/products/new'} element={<ProductForm />} />
                <Route path={'/categories/:id/products/:productId'} element={<ProductContainer />} />

                <Route path={'/accounts'} element={<BillingAccountsContainer />} />

                <Route path={'/*'} element={<NotFound />} />
            </Routes>
        </AdminContentBlock>
    );
};

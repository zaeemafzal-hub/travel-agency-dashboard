import { Outlet, useNavigate } from 'react-router';
import { MobileSidebar, NavItems } from 'components';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { redirect } from 'react-router';
import { account } from '~/appwrite/client';
import { getExistingUser, logoutUser, storeUserData } from '~/appwrite/auth';

export async function clientLoader() {
  try {
    const user = await account.get();
    // const navigate = useNavigate();
    // const handleLogout = async () => {
    //   await logoutUser();
    //   navigate('/sign-in');
    // };
    if (!user.$id) return redirect('/sign-in');
    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === 'user') {
      return redirect('/');
    }
    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (e) {
    console.log('error in client loader', e);
    return redirect('/sign-in');
  }
}
const AdminLayout = () => {
  return (
    <div className='admin-layout'>
      <MobileSidebar />
      <aside className='w-full max-w-[270px] hidden lg:block'>
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems handleClick={() => {}} />
        </SidebarComponent>
      </aside>
      <aside className='children'>
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;

import { SideNavbar } from './side-navbar';
import { TopNavbar } from './top-navbar';

export function Navigation() {
  return (
    <>
      <div className="hidden xl:block">
        <TopNavbar />
      </div>
      
      <div className="xl:hidden">
        <SideNavbar />;
      </div>
    </>
  );
}

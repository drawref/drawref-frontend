import logo from '../logo-light.svg';
import Icon from '@mdi/react';
import { mdiLoginVariant } from '@mdi/js';

function TheHeader() {
  return (
    <>
      <header className="sticky top-0 bg-primary-600 flex justify-between items-center px-2 py-1">
        <a href="/login" className="px-2 py-2 text-white invisible sm:hidden">
          <Icon path={mdiLoginVariant}
            title="Login"
            size={1.1}
            className="text-white"
          />
        </a>
        <a href="/" className="block px-3 py-1.5"><img src={logo} alt="DrawRef logo" /></a>
        <div className="flex">
          <a href="/login" className="mx-5 my-2 text-white text-lg hidden sm:block">Login</a>
          <a href="/login" className="px-2 py-2 text-white sm:hidden">
            <Icon path={mdiLoginVariant}
              title="Login"
              size={1.1}
              className="text-white"
            />
          </a>
        </div>
      </header>
    </>
  );
}

export default TheHeader;

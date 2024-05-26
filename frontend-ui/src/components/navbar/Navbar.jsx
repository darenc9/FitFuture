// src/components/navbar/Navbar.jsx

"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon, WrenchScrewdriverIcon, MagnifyingGlassIcon, ChartBarIcon, HomeIcon } from '@heroicons/react/24/solid';


const Navbar = () => {

  const pathName = usePathname();

  return (
    <div className="flex justify-between container mx-auto p-4">
      <div>
        <Link href={'/home'} key={'/home'} className={`flex flex-col items-center ${pathName == '/home' ? 'text-blue-500' : 'text-auto'}`}>
          <HomeIcon className="size-6 "/>
          <span>Home</span>
        </Link>
      </div>
      <div>
        <div className="flex space-x-2">
          <div>
            <Link href={'/profile'} key={'/profile'} className={`flex flex-col items-center ${pathName == '/profile' ? 'text-blue-500' : 'text-auto'}`}>
              <UserIcon className="size-6 "/>
              <span>Profile</span>
            </Link>
          </div>
          <div>
            <Link href={'/browse'} key={'/browse'} className={`flex flex-col items-center ${pathName == '/browse' ? 'text-blue-500' : 'text-auto'}`}>
              <MagnifyingGlassIcon className="size-6 "/>
              <span>Browse</span>
            </Link>
          </div>
          <div>
            <Link href={'/build'} key={'/build'} className={`flex flex-col items-center ${pathName == '/build' ? 'text-blue-500' : 'text-auto'}`}>
              <WrenchScrewdriverIcon className="size-6 "/>
              <span>Build</span>
            </Link>
          </div>
          <div>
            <Link href={'/progress'} key={'/progress'} className={`flex flex-col items-center ${pathName == '/progress' ? 'text-blue-500' : 'text-auto'}`}>
              <ChartBarIcon className="size-6 "/>
              <span>Progress</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

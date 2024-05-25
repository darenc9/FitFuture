// src/components/navbar/Navbar.jsx

"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";


const Navbar = () => {
  
  const links = [
    { title: "Home", path: "/home" },
    { title: "Profile", path: "/profile" },
    { title: "Browse", path: "/browse" },
    { title: "Build", path: "/build" },
    { title: "Progress", path: "/progress" }
  ];
  const pathName = usePathname();

  return (
    <div className="flex justify-between container mx-auto p-4">
      <div className="font-bold text-lg content-center">FitFuture</div>
      <div>
        <div className="flex space-x-4">
          {links.map(link => (
            <Link href={link.path} key={link.path} className={`rounded p-1 ${pathName == link.path ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>{link.title}</Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

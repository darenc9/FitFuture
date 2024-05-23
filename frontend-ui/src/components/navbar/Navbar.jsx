// src/components/navbar/Navbar.jsx

import Links from "./links/Links";

const Navbar = () => {
  return (
    <div className="flex justify-between container mx-auto p-4">
      <div className="font-bold text-lg content-center">FitFuture</div>
      <div>
        <Links />
      </div>
    </div>
  );
};

export default Navbar;

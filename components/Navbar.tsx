'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  
  // Don't show the Goal Planner button on admin pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login-admin')) {
    return null;
  }

  return (
    <div className="fixed top-8 left-8 z-[100] pointer-events-auto">
      <Link 
        href="/planner" 
        className="text-charcoal/40 hover:text-charcoal font-semibold tracking-tighter transition-all duration-300 flex items-center gap-2 group"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-150 transition-transform duration-300" />
        Goal Planner
      </Link>
    </div>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { MenuIcon, LogoutIcon, SettingsIcon } from '../icons/Icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-20 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 -mb-px">
                    {/* Header: Left side */}
                    <div className="flex">
                        {/* Hamburger button */}
                        <button
                            className="text-muted-foreground hover:text-foreground md:hidden"
                            aria-controls="sidebar"
                            onClick={onToggleSidebar}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Header: Right side */}
                    <div className="flex items-center space-x-3">
                        <div className="relative inline-block text-left">
                            <div>
                                <button
                                    type="button"
                                    className="flex items-center space-x-2"
                                    onClick={() => setMenuOpen(!isMenuOpen)}
                                >
                                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div className="hidden md:block text-left">
                                        <p className="font-semibold text-foreground text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </button>
                            </div>

                            {isMenuOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-2xl shadow-lg bg-popover text-popover-foreground ring-1 ring-black ring-opacity-5 dark:ring-border focus:outline-none"
                                    onMouseLeave={() => setMenuOpen(false)}
                                >
                                    <div className="py-2">
                                        <div className="px-4 py-3 border-b border-border">
                                           <p className="font-semibold text-foreground text-sm truncate">{user.name}</p>
                                           <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <Link 
                                            to="/settings" 
                                            onClick={() => setMenuOpen(false)}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <SettingsIcon className="w-5 h-5 mr-2" />
                                            Account Settings
                                        </Link>
                                        <button 
                                            onClick={() => { onLogout(); setMenuOpen(false); }}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                                        >
                                            <LogoutIcon className="w-5 h-5 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
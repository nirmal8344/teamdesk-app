import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DashboardIcon, DealsIcon, LeadsIcon, ContactsIcon, TasksIcon, SettingsIcon,
  ActivityIcon, UsersIcon, ProductsIcon, ReportsIcon, BookmarksIcon, CustomizationIcon, CalendarIcon
} from '../icons/Icons';
import Modal from '../common/Modal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const mainNavItems = [
    { to: '/', icon: DashboardIcon, label: 'Dashboard' },
    { to: '/leads', icon: LeadsIcon, label: 'Leads' },
    { to: '/deals', icon: DealsIcon, label: 'Deals' },
    { to: '/contacts', icon: ContactsIcon, label: 'Contacts' },
    { to: '/tasks', icon: TasksIcon, label: 'Tasks' },
  ];
    
  const reportsGroup = [
    { to: '/activity', icon: ActivityIcon, label: 'Realtime' },
    { to: '/team', icon: UsersIcon, label: 'Users' },
    { to: '/products', icon: ProductsIcon, label: 'Products' },
    { to: '/reports', icon: ReportsIcon, label: 'Reports' },
  ];
    
  const generalGroup = [
      { to: '/customization', icon: CustomizationIcon, label: 'Customization' },
      { to: '/bookmarks', icon: BookmarksIcon, label: 'Bookmarks' },
      { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];


  const activeLinkStyle = 'bg-primary text-primary-foreground';
  const inactiveLinkStyle = 'text-muted-foreground hover:bg-accent hover:text-accent-foreground';
  const linkBaseStyle = 'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200';

  const currentDate = new Date();
  const calendarDate = currentDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  });

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`w-64 bg-card text-card-foreground flex flex-col h-screen fixed z-40 border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center space-x-3 flex-shrink-0">
           <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#paint0_linear_1_2)"/>
            <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7B4EFF"/>
            <stop offset="1" stopColor="#5EDFFF"/>
            </linearGradient>
            </defs>
            </svg>
          <span className="font-semibold font-display text-xl text-foreground">TeamDesk</span>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="flex-1 px-4 py-2 space-y-1">
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</div>
            {mainNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
             <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reports</div>
             {reportsGroup.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">General</div>
             {generalGroup.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `${linkBaseStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
            
          <div className="p-4">
            <div className="p-4 bg-muted rounded-2xl text-center">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
                     <CalendarIcon className="w-6 h-6"/>
                 </div>
                 <h4 className="font-semibold text-foreground mt-3">My Calendar</h4>
                 <p className="text-xs text-muted-foreground mt-1">{calendarDate}</p>
                 <button onClick={() => setInviteModalOpen(true)} className="text-sm font-semibold text-primary mt-3 hover:underline">
                    + Invite Others
                 </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isInviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Others to Calendar">
        <form onSubmit={(e) => { e.preventDefault(); alert('Invite sent!'); setInviteModalOpen(false); }}>
            <p className="text-muted-foreground mb-4">Enter the email of the person you want to invite.</p>
            <input type="email" placeholder="colleague@example.com" required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="flex justify-end pt-4">
                 <button type="button" onClick={() => setInviteModalOpen(false)} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Send Invite</button>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default Sidebar;
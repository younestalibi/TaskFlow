import {
    IconChecklist,
    IconLayoutDashboard,
    IconUserCircle,
} from '@tabler/icons-react';
import classes from './PortalNavbar.module.css';
import { NavLink } from '@remix-run/react';

const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { path: '/dashboard/profile', label: 'Profile', icon: IconUserCircle },
    { path: '/dashboard/shared-tasklists', label: 'Task Manager', icon: IconChecklist },
] as const;

export function PortalNavbar() {
    const items = menuItems.map((item) => {
        return (
            <div key={item.path}>
                <NavLink
                    to={item.path}
                    end={true}
                    className={({ isActive, isPending }) =>
                        `${classes.link} ${isActive && classes.active} ${isPending && classes.pending}`
                    }
                >
                    <item.icon className={classes.linkIcon} stroke={1.5} />
                    <span>{item.label}</span>
                </NavLink>
            </div>
        );
    });

    return <div className={classes.navbarMain}>{items}</div>;
}
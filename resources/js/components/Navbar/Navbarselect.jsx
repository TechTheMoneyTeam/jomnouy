import React, { useEffect, useState } from 'react';
import styles from './Nav.module.css'; // Ensure the file is named correctly
import { IoSearchOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { Eye } from "lucide-react";
import DropdownMenu from './Projectdropdown';

const Navbar4 = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsername(user.username || 'Guest'); // Default to 'Guest' if no username found
        }
    }, []);

    return (
        <div className={styles.navbarWrapper}>
            <nav className={styles.navbar}>
                <div className={styles.navbarContainer}>
                    <a href="/projectlist1" className={styles.navbarLogo}>
                        <h1 className={styles.logo}>
                            jom-<span className={styles.logoHighlight}>nouy</span>
                        </h1>
                    </a>
                    
                    <div className={styles.navUserSection}>
                    <div className="profile flex items-center gap-4 cursor-pointer">
                            <DropdownMenu />
                        </div>
                    </div>
                </div>
            </nav>
            <div className={styles.navDivider}></div>
        </div>
    );
};

export default Navbar4;

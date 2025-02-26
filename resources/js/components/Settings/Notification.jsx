import { useState } from "react";
import Navbar2 from "../Navbar/Navbarforsubmit";
import { Link } from "react-router-dom";
import Styles from "./SettingsCSS/Notification.module.css"; 

const Notification = () => {
    const [notifications] = useState([
        "New follower: GechLeang123",
        "Your project received 5 likes",
        "Visal mentioned you in a comment",
    ]);
    const [notifEnabled, setNotifEnabled] = useState(true);

    return (
        <>
            <Navbar2 />
            <div className={Styles.container}>
                <h1 className={Styles.title}>Settings</h1>

                <div className={Styles.tabContainer}>
                    <Link to="/settings" className={Styles.tabButton}>Account</Link>
                    <Link to="/profile/edit" className={Styles.tabButton}>Edit Profile</Link>
                    <Link to="/followings" className={Styles.tabButton}>Following</Link>
                    <button className={`${Styles.tabButton} ${Styles.activeTab}`}>Notifications</button>
                </div>

                <h1 className={Styles.title}>Notifications</h1>

                <div className={Styles.toggleWrapper}>
                    <span className={Styles.toggleLabel}>
                        {notifEnabled ? "Notifications are ON" : "Notifications are OFF"}
                    </span>
                    <label className={Styles.toggleButton}>
                        <input 
                            type="checkbox" 
                            checked={notifEnabled} 
                            onChange={() => setNotifEnabled(!notifEnabled)} 
                        />
                        <span className={Styles.toggleSlider}></span>
                    </label>
                </div>

                <div className={Styles.list}>
                    {notifEnabled ? (
                        notifications.map((notif, index) => (
                            <div key={index} className={Styles.notificationCard}>{notif}</div>
                        ))
                    ) : (
                        <p className={Styles.disabledMessage}>Notifications are turned off.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notification;

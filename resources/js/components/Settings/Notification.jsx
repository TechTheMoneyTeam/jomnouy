import { useState, useEffect } from "react";
import Navbar2 from "../Navbar/Navbarforsubmit";
import { Link } from "react-router-dom";
import { Bell, Mail, User } from "lucide-react";
import Styles from "./SettingsCSS/Notification.module.css"; 

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [notifEnabled, setNotifEnabled] = useState(true);

    // Load notifications from localStorage on component mount
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        setNotifications(storedNotifications);
    }, []);

    // Mark notification as read
    const markAsRead = (index) => {
        const updatedNotifications = [...notifications];
        updatedNotifications[index].read = true;
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render notification based on type
    const renderNotification = (notification, index) => {
        switch(notification.type) {
            case "contact_request":
                return (
                    <div 
                        key={index} 
                        className={`${Styles.notificationCard} ${notification.read ? Styles.read : Styles.unread}`}
                        onClick={() => markAsRead(index)}
                    >
                        <div className={Styles.notificationIcon}>
                            <Mail size={24} />
                        </div>
                        <div className={Styles.notificationContent}>
                            <p className={Styles.notificationText}>
                                You contacted <strong>{notification.founder}</strong> regarding <strong>{notification.project}</strong>
                            </p>
                            <p className={Styles.notificationTime}>{formatDate(notification.date)}</p>
                        </div>
                        {!notification.read && <div className={Styles.unreadDot}></div>}
                    </div>
                );
            default:
                return (
                    <div 
                        key={index} 
                        className={`${Styles.notificationCard} ${notification.read ? Styles.read : Styles.unread}`}
                        onClick={() => markAsRead(index)}
                    >
                        <div className={Styles.notificationIcon}>
                            <Bell size={24} />
                        </div>
                        <div className={Styles.notificationContent}>
                            <p className={Styles.notificationText}>{notification.message || "New notification"}</p>
                            <p className={Styles.notificationTime}>{formatDate(notification.date)}</p>
                        </div>
                        {!notification.read && <div className={Styles.unreadDot}></div>}
                    </div>
                );
        }
    };

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
                        notifications.length > 0 ? (
                            notifications.map((notification, index) => renderNotification(notification, index))
                        ) : (
                            <p className={Styles.emptyMessage}>No notifications yet.</p>
                        )
                    ) : (
                        <p className={Styles.disabledMessage}>Notifications are turned off.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Notification;
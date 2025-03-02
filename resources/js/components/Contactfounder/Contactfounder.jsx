import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X } from "lucide-react";
import styles from "./Contactfounder.module.css";

const ContactFounder = ({ project, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: "",
        message: "",
        contactMethod: "email",
        contactInfo: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    
    // Let's debug the incoming project prop
    useEffect(() => {
        console.log("Project prop received:", project);
    }, [project]);
    
    // Check if project exists to prevent white screen
    if (!project) {
        console.error("Project is undefined in ContactFounder");
        return (
            <div className={styles.contactFounderModal}>
                <div className={styles.contactFounderContent}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                    <h2 className={styles.modalTitle}>Error</h2>
                    <p>Project data not available. Please try again later.</p>
                    <button 
                        className={styles.submitButton}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }
    
    // Fetch user data from localStorage on component mount
    useEffect(() => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    console.log("User data from localStorage:", user);
                    setUsername(user.username || '');
                    setUserId(user.user_id);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setError("Invalid user data in local storage");
                }
            }
        } catch (e) {
            console.error("Error accessing localStorage:", e);
            setError("Error accessing user data");
        }
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // In a real application, you would make an API call here
            // await axios.post("/api/contact-founder", { 
            //     projectId: project.id,
            //     founderName: project.user?.name || "Project Founder",
            //     senderId: userId,
            //     senderName: username,
            //     ...formData 
            // });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Add the notification to local storage (for demo purposes)
            const newNotification = {
                type: "contact_request",
                project: project.title || "Unknown Project",
                founder: project.user?.name || "Project Founder",
                sender: username || "Anonymous User",
                sender_id: userId,
                date: new Date().toISOString(),
                read: false
            };
            
            const existingNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
            localStorage.setItem("notifications", JSON.stringify([
                newNotification,
                ...existingNotifications
            ]));
            
            // Navigate to the notifications page
            navigate("/notifications");
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Get project details with fallbacks to prevent errors
    const projectTitle = project.title || "Unknown Project";
    const founderName = project.user?.name || "Project Founder";
    
    return (
        <div className={styles.contactFounderModal}>
            <div className={styles.contactFounderContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                
                <h2 className={styles.modalTitle}>Contact {founderName}</h2>
                <p className={styles.projectReference}>RE: {projectTitle}</p>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="sender">From</label>
                        <input
                            type="text"
                            id="sender"
                            name="sender"
                            value={username || "Guest User"}
                            disabled
                            className={styles.disabledInput}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter subject"
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message here..."
                            rows="5"
                            required
                        ></textarea>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Preferred Contact Method</label>
                        <div className={styles.contactMethodOptions}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="contactMethod"
                                    value="email"
                                    checked={formData.contactMethod === "email"}
                                    onChange={handleChange}
                                />
                                Email
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="contactMethod"
                                    value="phone"
                                    checked={formData.contactMethod === "phone"}
                                    onChange={handleChange}
                                />
                                Phone
                            </label>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contactInfo">
                            {formData.contactMethod === "email" ? "Your Email" : "Your Phone Number"}
                        </label>
                        <input
                            type={formData.contactMethod === "email" ? "email" : "tel"}
                            id="contactInfo"
                            name="contactInfo"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            placeholder={formData.contactMethod === "email" ? "Enter your email" : "Enter your phone number"}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        {!isSubmitting && <Send size={18} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactFounder;
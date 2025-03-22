import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile/1');
                setProfile(response.data.user);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <div className="space-y-4">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Contact Info:</strong> {profile.profile?.contact_info}</p>
                <p><strong>Phone:</strong> {profile.profile?.phone}</p>
                <p><strong>Bio:</strong> {profile.profile?.bio}</p>
            </div>
        </div>
    );
};

export default ProfileForm;
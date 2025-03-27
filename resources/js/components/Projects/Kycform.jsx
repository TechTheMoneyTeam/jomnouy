import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './KYCForm.module.css';

const KYCForm = ({ onComplete, onCancel }) => {
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        governmentId: '',
        idNumber: '',
        addressProof: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        taxIdNumber: ''
    });
    const [errors, setErrors] = useState({});

    // Get user ID from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.user_id); // Assuming the user object has an id field
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!formData.governmentId) newErrors.governmentId = "Government ID type is required";
        if (!formData.idNumber) newErrors.idNumber = "ID number is required";
        if (!formData.addressProof) newErrors.addressProof = "Proof of address type is required";
        if (!formData.addressLine1) newErrors.addressLine1 = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.country) newErrors.country = "Country is required";
        if (!formData.taxIdNumber) newErrors.taxIdNumber = "Tax ID number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (!userId) {
                    console.error('User ID not found in localStorage');
                    return;
                }
                
                // Prepare data for submission with user_id
                const kycData = {
                    user_id: userId,
                    full_name: formData.fullName,
                    government_id: formData.governmentId,
                    id_number: formData.idNumber,
                    address_proof: formData.addressProof,
                    address_line1: formData.addressLine1,
                    address_line2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.postalCode,
                    country: formData.country,
                    tax_id_number: formData.taxIdNumber
                };
                
                // Submit to API
                const response = await axios.post('/api/kyc-verifications', kycData);
                
                if (response.data.success) {
                    onComplete({...formData, userId});
                }
            } catch (error) {
                console.error('Error submitting KYC data:', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    // Map backend errors to form errors
                    const backendErrors = {};
                    Object.entries(error.response.data.errors).forEach(([key, value]) => {
                        // Convert snake_case to camelCase
                        const formKey = key.replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
                        backendErrors[formKey] = value[0]; // Take first error message
                    });
                    setErrors({...errors, ...backendErrors});
                }
            }
        }
    };

    return (
        <div className={styles['kyc-form-container']}>
            <h2 className={styles['kyc-title']}>Identity Verification</h2>
            <p className={styles['kyc-subtitle']}>Please provide the following information to verify your identity as required by financial regulations.</p>
            
            <form onSubmit={handleSubmit} className={styles['kyc-form']}>
                <div className={styles['form-section']}>
                    <h3>Personal Information</h3>
                    <div className={styles['form-field']}>
                        <label htmlFor="fullName">Full Legal Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={errors.fullName ? styles.error : ''}
                        />
                        {errors.fullName && <span className={styles['error-message']}>{errors.fullName}</span>}
                    </div>
                </div>

                <div className={styles['form-section']}>
                    <h3>Government Identification</h3>
                    <div className={styles['form-field']}>
                        <label htmlFor="governmentId">ID Type</label>
                        <select
                            id="governmentId"
                            name="governmentId"
                            value={formData.governmentId}
                            onChange={handleChange}
                            className={errors.governmentId ? styles.error : ''}
                        >
                            <option value="">Select ID Type</option>
                            <option value="passport">Passport</option>
                            <option value="driverLicense">Driver's License</option>
                            <option value="nationalId">National ID Card</option>
                        </select>
                        {errors.governmentId && <span className={styles['error-message']}>{errors.governmentId}</span>}
                    </div>
                    
                    <div className={styles['form-field']}>
                        <label htmlFor="idNumber">ID Number</label>
                        <input
                            type="text"
                            id="idNumber"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleChange}
                            className={errors.idNumber ? styles.error : ''}
                        />
                        {errors.idNumber && <span className={styles['error-message']}>{errors.idNumber}</span>}
                    </div>
                </div>

                <div className={styles['form-section']}>
                    <h3>Proof of Address</h3>
                    <div className={styles['form-field']}>
                        <label htmlFor="addressProof">Proof Type</label>
                        <select
                            id="addressProof"
                            name="addressProof"
                            value={formData.addressProof}
                            onChange={handleChange}
                            className={errors.addressProof ? styles.error : ''}
                        >
                            <option value="">Select Proof Type</option>
                            <option value="utilityBill">Utility Bill (not older than 3 months)</option>
                            <option value="bankStatement">Bank Statement (not older than 3 months)</option>
                            <option value="governmentLetter">Government-issued Letter</option>
                        </select>
                        {errors.addressProof && <span className={styles['error-message']}>{errors.addressProof}</span>}
                    </div>
                    
                    <div className={styles['form-field']}>
                        <label htmlFor="addressLine1">Address Line 1</label>
                        <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className={errors.addressLine1 ? styles.error : ''}
                        />
                        {errors.addressLine1 && <span className={styles['error-message']}>{errors.addressLine1}</span>}
                    </div>
                    
                    <div className={styles['form-field']}>
                        <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
                        <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={errors.city ? styles.error : ''}
                            />
                            {errors.city && <span className={styles['error-message']}>{errors.city}</span>}
                        </div>
                        
                        <div className={styles['form-field']}>
                            <label htmlFor="state">State/Province</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label htmlFor="postalCode">Postal/ZIP Code</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className={styles['form-field']}>
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className={errors.country ? styles.error : ''}
                            />
                            {errors.country && <span className={styles['error-message']}>{errors.country}</span>}
                        </div>
                    </div>
                </div>

                <div className={styles['form-section']}>
                    <h3>Tax Information</h3>
                    <div className={styles['form-field']}>
                        <label htmlFor="taxIdNumber">Tax ID Number</label>
                        <input
                            type="text"
                            id="taxIdNumber"
                            name="taxIdNumber"
                            value={formData.taxIdNumber}
                            onChange={handleChange}
                            className={errors.taxIdNumber ? styles.error : ''}
                        />
                        {errors.taxIdNumber && <span className={styles['error-message']}>{errors.taxIdNumber}</span>}
                    </div>
                </div>

                <div className={styles['kyc-form-buttons']}>
                    <button type="submit" className={styles['kyc-submit-button']}>Submit & Continue</button>
                    <button type="button" className={styles['kyc-cancel-button']} onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default KYCForm;
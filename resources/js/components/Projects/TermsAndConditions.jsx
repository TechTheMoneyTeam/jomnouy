import React, { useState, useEffect } from 'react';


const TermsAndConditions = ({ onAccept, onCancel }) => {
    const [agreed, setAgreed] = useState(false);
    
    return (
        <div className="terms-modal">
            <div className="terms-content">
                <h2 className="terms-title">Investment Terms and Conditions</h2>
                <div className="terms-text">
                    <p>By investing in this project, you acknowledge and agree to the following terms:</p>
                    <ol>
                        <li>You understand that investing involves risk and the potential for loss of your investment.</li>
                        <li>You confirm that you are over 18 years of age and legally allowed to make investments in your jurisdiction.</li>
                        <li>You agree to provide accurate personal and financial information as required by regulatory standards.</li>
                        <li>You understand that funds will only be collected if the project reaches its funding goal by the deadline.</li>
                        <li>You acknowledge that JOMNOUY is a platform facilitating investments and is not responsible for project outcomes.</li>
                        <li>You understand that returns on investment are not guaranteed and depend on the project's success.</li>
                        <li>You agree to comply with all applicable tax regulations regarding your investment.</li>
                        <li>You consent to JOMNOUY collecting and processing your personal data in accordance with our Privacy Policy.</li>
                    </ol>
                </div>
                <div className="terms-checkbox">
                    <input 
                        type="checkbox" 
                        id="agree-terms" 
                        checked={agreed} 
                        onChange={() => setAgreed(!agreed)} 
                    />
                    <label htmlFor="agree-terms">I have read and agree to the terms and conditions</label>
                </div>
                <div className="terms-buttons">
                    <button 
                        className="terms-accept-button" 
                        disabled={!agreed} 
                        onClick={onAccept}
                    >
                        Accept & Continue
                    </button>
                    <button className="terms-cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TermsAndConditions
import React, { useState } from 'react';
import styles from './aba-payment.module.css';

const PaymentPage = ({ onSuccess, amount = 299.99, investmentData }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('input'); // 'input', 'processing', 'success', 'error'
  const [error, setError] = useState('');

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return;
    }
    
    if (expiryDate.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Change status to processing
    setPaymentStatus('processing');
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      setIsProcessing(false);
      if (onSuccess) onSuccess();
    }, 2000);
  };

  return (
    <div className={styles.abaPaymentContainer}>
      <div className={styles.abaHeader}>
        <button className={styles.abaBackButton}>
          <span>&#8249;</span>
        </button>
        <h2 className={styles.abaTitle}>ABA<sup>+</sup> Payment</h2>
      </div>
      
      <div className={styles.abaContent}>
        {paymentStatus === 'input' && (
          <>
            <div className={styles.abaWelcomeSection}>
              <h1 className={styles.abaWelcomeTitle}>Complete Your Payment</h1>
              <p className={styles.abaWelcomeText}>
                Please enter your card details below to process your payment securely.
              </p>
            </div>
            
            <div className={styles.abaAmountSection}>
              <div className={styles.abaAmountLabel}>Total Amount</div>
              <div className={styles.abaAmount}>${amount.toFixed(2)}</div>
            </div>
            
            <div className={styles.abaFormContainer}>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className={styles.abaErrorMessage}>
                    {error}
                  </div>
                )}
                
                <div className={styles.abaFormGroup}>
                  <label className={styles.abaLabel}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    maxLength="19"
                    className={styles.abaInput}
                    required
                  />
                </div>
                
                <div className={styles.abaFormGroup}>
                  <label className={styles.abaLabel}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Nith Heng"
                    className={styles.abaInput}
                    required
                  />
                </div>
                
                <div className={styles.abaInputGroup}>
                  <div className={styles.abaFormGroup}>
                    <label className={styles.abaLabel}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={styles.abaInput}
                      required
                    />
                  </div>
                  <div className={styles.abaFormGroup}>
                    <label className={styles.abaLabel}>
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="XXX"
                      maxLength="4"
                      className={styles.abaInput}
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className={styles.abaButton}
                  disabled={isProcessing}
                >
                  Pay Now
                </button>
              </form>
            </div>
            
            <div className={styles.abaSecurityText}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C10.6 22 9.30001 21.5 8.40001 20.7L3.30001 15.6C2.50001 14.8 2.00001 13.6 2.00001 12.4V7.10001C2.00001 4.70001 3.90001 2.70001 6.30001 2.60001C6.60001 2.60001 6.80001 2.60001 7.10001 2.60001L12 5.30001L16.9 2.60001C17.2 2.50001 17.4 2.50001 17.7 2.50001C20.1 2.60001 22.0001 4.60001 22.0001 7.00001V12.3C22.0001 13.5 21.5 14.7 20.7 15.5L15.6 20.6C14.7 21.5 13.4 22 12 22Z" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12.5C11.4 12.5 11 12.1 11 11.5V9.5C11 8.9 11.4 8.5 12 8.5C12.6 8.5 13 8.9 13 9.5V11.5C13 12.1 12.6 12.5 12 12.5Z" fill="currentColor"/>
                <path d="M12 16C11.4 16 11 15.6 11 15C11 14.4 11.4 14 12 14C12.6 14 13 14.4 13 15C13 15.6 12.6 16 12 16Z" fill="currentColor"/>
              </svg>
              Your payment information is secure and encrypted
            </div>
          </>
        )}
        
        {paymentStatus === 'processing' && (
          <div className={styles.abaProcessing}>
            <div className={styles.abaSpinner}></div>
            <p className={styles.abaProcessingText}>Processing your payment...</p>
            <p className={styles.abaProcessingSubtext}>Please don't close this window</p>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className={styles.abaSuccess}>
            <div className={styles.abaSuccessIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.abaSuccessTitle}>Payment Successful!</h3>
            <p className={styles.abaSuccessText}>
              Your transaction has been completed successfully.
            </p>
            <p className={styles.abaTransactionId}>
              Transaction ID: TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <button 
              className={styles.abaReturnButton}
              onClick={() => window.location.reload()}
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.abaFooter}>
        <div className={styles.abaStepIndicator}></div>
        <div className={styles.abaStepIndicatorActive}></div>
        <div className={styles.abaStepIndicator}></div>
      </div>
    </div>
  );
};

export default PaymentPage;
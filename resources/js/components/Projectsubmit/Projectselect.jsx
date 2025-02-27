import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Projectselect.module.css';

const ProjectSelectionForm = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedOption === 'Existing Project') {
      navigate('/existing');
    } else if (selectedOption === 'Start-up') {
      navigate('/#');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Select the your project type</h1>
      <p className={styles.subheading}>
        Choose your project type to receive personalized options and suggestions for your
        work.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.selectContainer}>
          <div
            className={styles.customSelect}
            onClick={toggleDropdown}
          >
            <span className={styles.selectText}>
              {selectedOption || 'Select project type'}
            </span>
            <span className={styles.arrow}>▼</span>
          </div>
          
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div 
                className={styles.option}
                onClick={() => handleOptionSelect('Existing Project')}
              >
                Existing Project
              </div>
              <div 
                className={styles.option}
                onClick={() => handleOptionSelect('Start-up')}
              >
                Start-up
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className={styles.nextButton}
          disabled={!selectedOption}
        >
          Next
        </button>
      </form>

      <p className={styles.note}>
        Please note: Your ability to edit, hide, or delete a project is limited after 
        you launch a project.
      </p>
    </div>
  );
};

export default ProjectSelectionForm;
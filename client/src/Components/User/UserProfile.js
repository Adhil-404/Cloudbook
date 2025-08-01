import React, { useState, useEffect } from 'react';
import UserNav from './Usernav';
import '../../Assets/Styles/Userstyles/UserProfile.css';
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    profileImage: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      newsletter: false,
      orderUpdates: false,
      promotions: false,
      recommendations: false
    },
    readingGoals: {
      yearlyGoal: '',
      currentCount: '',
      favoriteGenres: []
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          console.error('No auth token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || '',
            bio: userData.bio || '',
            profileImage: userData.profileImage || null,
            address: {
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              zipCode: userData.address?.zipCode || '',
              country: userData.address?.country || ''
            },
            preferences: {
              newsletter: userData.preferences?.newsletter || false,
              orderUpdates: userData.preferences?.orderUpdates || false,
              promotions: userData.preferences?.promotions || false,
              recommendations: userData.preferences?.recommendations || false
            },
            readingGoals: {
              yearlyGoal: userData.readingGoals?.yearlyGoal || '',
              currentCount: userData.readingGoals?.currentCount || '',
              favoriteGenres: userData.readingGoals?.favoriteGenres || []
            }
          });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCheckboxChange = (field, checked, section = null) => {
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: checked
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: checked
      }));
    }
  };

  const handleGenreToggle = (genre) => {
    setProfileData(prev => ({
      ...prev,
      readingGoals: {
        ...prev.readingGoals,
        favoriteGenres: prev.readingGoals.favoriteGenres.includes(genre)
          ? prev.readingGoals.favoriteGenres.filter(g => g !== genre)
          : [...prev.readingGoals.favoriteGenres, genre]
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setIsEditing(false);
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'bi bi-person-fill' },
    { id: 'address', label: 'Address', icon: 'bi bi-geo-alt-fill' },
    { id: 'preferences', label: 'Preferences', icon: 'bi bi-gear-fill' },
    { id: 'reading', label: 'Reading Goals', icon: 'bi bi-book-fill' }
  ];

  const genres = ['Fantasy', 'Crime Fiction', 'Romance', 'Mystery', 'Thriller', 'Children\'s Literature', 'Historical Fiction', 'Dystopian fiction'];

  return (
    <div>
      <div><UserNav/></div>
      <div className="profile-container">
        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            fontSize: '18px',
            color: '#0b7a6c'
          }}>
            <i className="bi bi-hourglass-split" style={{ marginRight: '10px', fontSize: '24px' }}></i>
            Loading profile...
          </div>
        ) : (
          <>

        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {profileData.firstName || profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`.trim()
                  : 'User Profile'
                }
              </h1>
              <p className="profile-email">
                {profileData.email || 'No email provided'}
              </p>
              <p className="profile-member-since">
                Member since January 2023
              </p>
            </div>
            <button
              className={`edit-button ${isEditing ? 'cancel' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={isEditing ? 'bi bi-x-lg' : 'bi bi-pencil-fill'}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>


        <div className="profile-tabs">
          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>


          <div className="tab-content">
            {activeTab === 'personal' && (
              <div>
                <h2 className="section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-input form-textarea"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div>
                <h2 className="section-title">Address Information</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address.street}
                      onChange={(e) => handleInputChange('street', e.target.value, 'address')}
                      disabled={!isEditing}
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address.city}
                      onChange={(e) => handleInputChange('city', e.target.value, 'address')}
                      disabled={!isEditing}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State/Province</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address.state}
                      onChange={(e) => handleInputChange('state', e.target.value, 'address')}
                      disabled={!isEditing}
                      placeholder="Enter your state/province"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value, 'address')}
                      disabled={!isEditing}
                      placeholder="Enter your ZIP/postal code"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.address.country}
                      onChange={(e) => handleInputChange('country', e.target.value, 'address')}
                      disabled={!isEditing}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="section-title">Notification Preferences</h2>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={profileData.preferences.newsletter}
                      onChange={(e) => handleCheckboxChange('newsletter', e.target.checked, 'preferences')}
                      disabled={!isEditing}
                    />
                    <div className="checkbox-content">
                      <p className="checkbox-label">Newsletter</p>
                      <p className="checkbox-description">Receive our weekly newsletter with latest updates</p>
                    </div>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={profileData.preferences.orderUpdates}
                      onChange={(e) => handleCheckboxChange('orderUpdates', e.target.checked, 'preferences')}
                      disabled={!isEditing}
                    />
                    <div className="checkbox-content">
                      <p className="checkbox-label">Order Updates</p>
                      <p className="checkbox-description">Get notified about your order status</p>
                    </div>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={profileData.preferences.promotions}
                      onChange={(e) => handleCheckboxChange('promotions', e.target.checked, 'preferences')}
                      disabled={!isEditing}
                    />
                    <div className="checkbox-content">
                      <p className="checkbox-label">Promotions & Offers</p>
                      <p className="checkbox-description">Receive special offers and promotional content</p>
                    </div>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={profileData.preferences.recommendations}
                      onChange={(e) => handleCheckboxChange('recommendations', e.target.checked, 'preferences')}
                      disabled={!isEditing}
                    />
                    <div className="checkbox-content">
                      <p className="checkbox-label">Book Recommendations</p>
                      <p className="checkbox-description">Get personalized book recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reading' && (
              <div>
                <h2 className="section-title">Reading Goals & Preferences</h2>
                
                <div className="progress-container">
                  <div className="progress-header">
                    <h3 className="progress-title">Reading Progress</h3>
                    <span className="progress-stats">
                      {profileData.readingGoals.currentCount || 0} / {profileData.readingGoals.yearlyGoal || 0} books
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: profileData.readingGoals.yearlyGoal 
                          ? `${Math.min((profileData.readingGoals.currentCount / profileData.readingGoals.yearlyGoal) * 100, 100)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Yearly Reading Goal</label>
                    <input
                      type="number"
                      className="form-input"
                      value={profileData.readingGoals.yearlyGoal}
                      onChange={(e) => handleInputChange('yearlyGoal', e.target.value, 'readingGoals')}
                      disabled={!isEditing}
                      placeholder="Enter your yearly goal"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Books Read This Year</label>
                    <input
                      type="number"
                      className="form-input"
                      value={profileData.readingGoals.currentCount}
                      onChange={(e) => handleInputChange('currentCount', e.target.value, 'readingGoals')}
                      disabled={!isEditing}
                      placeholder="Enter current count"
                      min="0"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <label className="form-label">Favorite Genres</label>
                  <div className="genre-grid">
                    {genres.map(genre => (
                      <div
                        key={genre}
                        className={`genre-tag ${profileData.readingGoals.favoriteGenres.includes(genre) ? 'selected' : ''}`}
                        onClick={() => isEditing && handleGenreToggle(genre)}
                        style={{ cursor: isEditing ? 'pointer' : 'default' }}
                      >
                        {genre}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="save-buttons">
                <button className="save-btn secondary" onClick={handleCancel}>
                  <i className="bi bi-x-lg"></i>
                  Cancel
                </button>
                <button className="save-btn primary" onClick={handleSave}>
                  <i className="bi bi-check-lg"></i>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
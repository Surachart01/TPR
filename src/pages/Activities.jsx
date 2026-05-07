import { useState } from 'react';
import { Calendar, Image as ImageIcon, MapPin, Tag, ChevronRight, Search } from 'lucide-react';
import './Activities.css';
import siteData from '../data/siteData.json';

export function Activities() {
  const { activities } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [searchQuery, setSearchQuery] = useState('');

  const currentActivities = activities[activeTerm] || [];
  
  const filteredActivities = currentActivities.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="activities-container animate-fade-in">
      <div className="page-header">
        <div className="badge">กิจกรรมและการเรียนรู้</div>
        <h1 className="text-h1">{activities.title}</h1>
        <p className="text-body max-w-2xl">{activities.description}</p>
      </div>

      <div className="activities-controls">
        <div className="tabs-wrapper glass-panel">
          <button 
            className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            ภาคเรียนที่ 1
          </button>
          <button 
            className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            ภาคเรียนที่ 2
          </button>
        </div>

        <div className="search-wrapper glass-panel">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="ค้นหากิจกรรม..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="activities-grid animate-fade-in" key={activeTerm + searchQuery}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="activity-card glass-panel">
              <div className="activity-image-wrapper">
                <img src={activity.imageUrl} alt={activity.title} className="activity-img" />
                <div className="activity-category-badge">{activity.category}</div>
              </div>
              <div className="activity-info">
                <div className="activity-date">
                  <Calendar size={14} />
                  <span>{activity.date}</span>
                </div>
                <h3 className="activity-title">{activity.title}</h3>
                <button className="view-details-btn">
                  <span>ดูรายละเอียด</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results glass-panel">
            <ImageIcon size={48} className="text-muted" />
            <p>ไม่พบข้อมูลกิจกรรมที่คุณค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}

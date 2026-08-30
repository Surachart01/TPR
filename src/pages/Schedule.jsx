import { useState } from 'react';
import { Calendar, ExternalLink, Download, Clock, BookOpen, Users, Grid } from 'lucide-react';
import './Schedule.css';
import siteData from '../data/siteData.json';

export function Schedule() {
  const { schedule } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const currentTerm = schedule[activeTerm];

  // Timetable data for Term 1 (based on the user's provided image)
  const timeSlots = [
    "08:00 - 08:30", "08:30 - 09:30", "09:30 - 10:30", "10:30 - 11:30", 
    "11:30 - 12:30", "12:30 - 13:30", "13:30 - 14:30", "14:30 - 15:30", "15:30 - 16:30"
  ];

  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  // Mapping for the grid (dayIndex, slotStartIndex, slotSpan, subject, code, color)
  const timetableEvents = {
    term1: [
      { day: 0, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#9e9e9e" },
      { day: 1, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#9e9e9e" },
      { day: 2, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#9e9e9e" },
      { day: 3, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#9e9e9e" },
      { day: 4, start: 0, span: 1, name: "กิจกรรมหน้าเสาธง", code: "", color: "#9e9e9e" },
      
      { day: 1, start: 6, span: 3, name: "ระบบปฏิบัติการเครื่องแม่ข่าย", code: "31901-2002", color: "#E91E63" },
      { day: 2, start: 1, span: 3, name: "การเขียนโปรแกรมคอมพิวเตอร์", code: "21900-1001", color: "#4CAF50" },
      { day: 4, start: 1, span: 2, name: "ระบบปฏิบัติการเครื่องแม่ข่าย", code: "31901-2002", color: "#00BCD4" },
    ],
    term2: [] // Add term 2 data here later
  };

  const currentEvents = timetableEvents[activeTerm] || [];

  return (
    <div className="schedule-container animate-fade-in">
      <div className="page-header">
        <div className="badge">ตารางการปฏิบัติงาน</div>
        <h1 className="text-h1">{schedule.title}</h1>
        <p className="text-body">ข้อมูลการจัดการเรียนการสอนและตารางเวลาปฏิบัติงาน {currentTerm.semester}</p>
      </div>

      <div className="schedule-controls">
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

        <div className="view-toggle glass-panel">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="ดูแบบตาราง"
          >
            <Grid size={18} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="ดูแบบรายการ"
          >
            <BookOpen size={18} />
          </button>
        </div>

        {schedule.driveUrl && (
          <a 
            href={schedule.driveUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="drive-link-btn"
          >
            <ExternalLink size={18} />
            <span>ดูเวลาฝึกงาน (Google Drive)</span>
          </a>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="timetable-section animate-fade-in">
          <div className="timetable-container glass-panel">
            <div className="timetable-header">
              <div className="time-col-header">วัน / เวลา</div>
              {timeSlots.map((slot, i) => (
                <div key={i} className="slot-header">
                  <span className="slot-num">{i === 0 ? "เช้า" : `คาบ ${i}`}</span>
                  <span className="slot-time">{slot}</span>
                </div>
              ))}
            </div>
            
            <div className="timetable-body">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="day-row">
                  <div className="day-name">{day}</div>
                  <div className="slots-container">
                    {/* Render blank slots */}
                    {timeSlots.map((_, i) => (
                      <div key={i} className="empty-slot"></div>
                    ))}
                    
                    {/* Render events */}
                    {currentEvents.filter(e => e.day === dayIndex).map((event, i) => (
                      <div 
                        key={i} 
                        className="event-block"
                        style={{ 
                          gridColumnStart: event.start + 1, 
                          gridColumnEnd: event.start + 1 + event.span,
                          backgroundColor: event.color + '22',
                          borderLeft: `4px solid ${event.color}`,
                          color: event.color
                        }}
                      >
                        <span className="event-code">{event.code}</span>
                        <span className="event-name">{event.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="courses-section animate-fade-in">
          <div className="courses-list">
            {currentTerm.courses.map((course) => (
              <div key={course.id} className="course-card glass-panel">
                <div className="course-header">
                  <span className="course-code">{course.code}</span>
                  <span className="course-hours">{course.hours} ชม./สัปดาห์</span>
                </div>
                <h3 className="course-name">{course.name}</h3>
                
                {course.day && (
                  <div className="course-schedule-tag">
                    <Calendar size={15} />
                    <span>{course.day}</span>
                  </div>
                )}

                {course.time && (
                  <div className="course-time-tag">
                    <Clock size={15} />
                    <span>{course.time}</span>
                  </div>
                )}

                <div className="course-footer">
                  <div className="course-info-item">
                    <Users size={16} />
                    <span>กลุ่มเรียน: {course.classes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { 
  Book, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Layers, 
  FileCode2, 
  Award,
  Sparkles,
  UserCheck,
  ChevronRight,
  Code
} from 'lucide-react';
import './LessonPlans.css';
import siteData from '../data/siteData.json';

export function LessonPlans() {
  const { lessonPlans } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [viewMode, setViewMode] = useState('units'); // 'units' | 'courseInfo' | 'ebook'
  const [selectedUnit, setSelectedUnit] = useState(null);

  const currentPlan = lessonPlans[activeTerm];
  const courseInfo = currentPlan?.courseInfo;
  const units = currentPlan?.units || [];

  return (
    <div className="lesson-plans-container animate-fade-in">
      <div className="page-header">
        <div className="badge">หลักสูตรและแผนการจัดการเรียนรู้</div>
        <h1 className="text-h1">{lessonPlans.title}</h1>
        <p className="text-body max-w-3xl">{lessonPlans.description}</p>
      </div>

      {/* Course Banner Card */}
      {courseInfo && (
        <div className="course-banner-card glass-panel animate-slide-up">
          <div className="course-banner-main">
            <div className="course-code-badge">
              <Code size={16} />
              <span>{courseInfo.code}</span>
            </div>
            <h2 className="course-name">{courseInfo.name}</h2>
            <p className="course-curriculum">{courseInfo.curriculum} • {courseInfo.department}</p>
            <div className="course-meta-tags">
              <span className="meta-tag"><Clock size={14} /> {courseInfo.credits} ({courseInfo.totalHours} ชั่วโมง)</span>
              <span className="meta-tag"><GraduationCap size={14} /> ทฤษฎี {courseInfo.theoryHours} ชม. / ปฏิบัติ {courseInfo.practicalHours} ชม.</span>
              <span className="meta-tag"><UserCheck size={14} /> ผู้จัดทำ: {courseInfo.instructor}</span>
            </div>
          </div>
          <div className="course-banner-actions">
            {currentPlan.ebookUrl && (
              <a
                href={currentPlan.ebookUrl.replace('/preview', '/view')}
                target="_blank"
                rel="noopener noreferrer"
                className="course-download-btn"
              >
                <Download size={18} />
                <span>ดาวน์โหลดเล่มแผน (PDF)</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Top Controls: Term & View Tabs */}
      <div className="plans-controls">
        <div className="term-switch-wrapper glass-panel">
          <button 
            className={`tab-btn ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            แผนการสอน เทอม 1
          </button>
          <button 
            className={`tab-btn ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            แผนการสอน เทอม 2
          </button>
        </div>

        <div className="view-mode-tabs glass-panel">
          {units.length > 0 && (
            <>
              <button 
                className={`view-mode-btn ${viewMode === 'units' ? 'active' : ''}`}
                onClick={() => setViewMode('units')}
              >
                <Layers size={16} />
                <span>โครงสร้างหน่วยการเรียนรู้ ({units.length})</span>
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'courseInfo' ? 'active' : ''}`}
                onClick={() => setViewMode('courseInfo')}
              >
                <Award size={16} />
                <span>คำอธิบาย & สมรรถนะ</span>
              </button>
            </>
          )}
          {currentPlan?.ebookUrl && (
            <button 
              className={`view-mode-btn ${viewMode === 'ebook' || units.length === 0 ? 'active' : ''}`}
              onClick={() => setViewMode('ebook')}
            >
              <BookOpen size={16} />
              <span>เล่มแผน E-Book Reader</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: Units Structure */}
      {viewMode === 'units' && units.length > 0 && (
        <div className="units-section animate-fade-in">
          <div className="units-header-row">
            <div>
              <h3 className="section-title">หน่วยการเรียนรู้และสาระสำคัญ (9 หน่วย & 18 สัปดาห์)</h3>
              <p className="section-subtitle">คลิกที่การ์ดเพื่อดูรายละเอียดหัวข้อย่อยและใบงานประจำหน่วย</p>
            </div>
            <div className="hours-summary-badge">
              <span>รวมทั้งสิ้น {courseInfo?.totalHours || 54} ชม. (18 สัปดาห์)</span>
            </div>
          </div>

          <div className="units-grid">
            {units.map((u, idx) => {
              const isEvaluation = u.unit === 'Midterm' || u.unit === 'Final';
              return (
                <div 
                  key={idx} 
                  className={`unit-card glass-panel ${isEvaluation ? 'evaluation-card' : ''} ${selectedUnit === idx ? 'expanded' : ''}`}
                  onClick={() => setSelectedUnit(selectedUnit === idx ? null : idx)}
                >
                  <div className="unit-card-header">
                    <div className="unit-number-tag">
                      {isEvaluation ? (
                        <span className="eval-tag-label">{u.unit === 'Midterm' ? 'กลางภาค' : 'ปลายภาค'}</span>
                      ) : (
                        <span>หน่วยที่ {u.unit}</span>
                      )}
                    </div>
                    <div className="unit-time-info">
                      <span className="unit-week">{u.weeks} ({u.times})</span>
                      <span className="unit-hours">{u.totalHours} ชม.</span>
                    </div>
                  </div>

                  <h4 className="unit-title">{u.title}</h4>

                  {u.competencyStandard && (
                    <p className="unit-standard">
                      <Award size={14} className="standard-icon" />
                      <span>{u.competencyStandard}</span>
                    </p>
                  )}

                  {/* Topics List */}
                  {u.topics && (
                    <div className="unit-topics">
                      <h5 className="sub-heading">หัวข้อการเรียนรู้:</h5>
                      <ul className="topic-list">
                        {u.topics.map((topic, tIdx) => (
                          <li key={tIdx}>
                            <ChevronRight size={14} className="topic-bullet" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Worksheets */}
                  {u.worksheets && u.worksheets.length > 0 && (
                    <div className="unit-worksheets">
                      <h5 className="sub-heading">ใบงานและชิ้นงาน:</h5>
                      <div className="worksheet-tags">
                        {u.worksheets.map((ws, wsIdx) => (
                          <span key={wsIdx} className="ws-tag">
                            <FileCode2 size={13} />
                            <span>{ws}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Course Description & Competencies */}
      {viewMode === 'courseInfo' && courseInfo && (
        <div className="course-details-section animate-fade-in">
          {/* Course Description */}
          <div className="info-block glass-panel">
            <div className="block-header">
              <BookOpen size={22} className="text-primary" />
              <h3>คำอธิบายรายวิชา (Course Description)</h3>
            </div>
            <p className="block-content-desc">{currentPlan.courseDescription}</p>
          </div>

          <div className="info-two-col-grid">
            {/* Learning Outcomes */}
            <div className="info-block glass-panel">
              <div className="block-header">
                <Sparkles size={20} className="text-primary" />
                <h3>ผลลัพธ์การเรียนรู้ระดับรายวิชา (Learning Outcomes)</h3>
              </div>
              <p className="highlight-text">{currentPlan.learningOutcome}</p>
              
              {courseInfo.standardRef && (
                <div className="standard-ref-box">
                  <Award size={18} />
                  <div>
                    <strong>อ้างอิงมาตรฐานอาชีพ:</strong>
                    <p>{courseInfo.standardRef}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Objectives */}
            <div className="info-block glass-panel">
              <div className="block-header">
                <CheckCircle2 size={20} className="text-primary" />
                <h3>จุดประสงค์รายวิชา</h3>
              </div>
              <ul className="info-list">
                {currentPlan.objectives?.map((obj, i) => (
                  <li key={i}>
                    <span className="list-number">{i + 1}</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competencies */}
          <div className="info-block glass-panel">
            <div className="block-header">
              <Award size={20} className="text-primary" />
              <h3>สมรรถนะรายวิชา (Course Competencies)</h3>
            </div>
            <div className="competencies-grid">
              {currentPlan.competencies?.map((comp, i) => (
                <div key={i} className="competency-card">
                  <div className="comp-badge">สมรรถนะที่ {i + 1}</div>
                  <p>{comp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: Full E-Book Viewer */}
      {(viewMode === 'ebook' || units.length === 0) && currentPlan?.ebookUrl && (
        <div className="ebook-viewer-section animate-fade-in" key={activeTerm}>
          <div className="ebook-frame-container">
            <div className="ebook-spine"></div>
            <div className="ebook-content glass-panel">
              <div className="ebook-header">
                <div className="ebook-title">
                  <BookOpen size={20} className="text-primary" />
                  <span>{currentPlan.semester} - {courseInfo?.name || 'แผนการจัดการเรียนรู้'}</span>
                </div>
                <div className="ebook-actions">
                  <span className="ebook-status">E-Book Reader Mode</span>
                </div>
              </div>
              
              <div className="iframe-wrapper">
                <iframe 
                  src={currentPlan.ebookUrl} 
                  allow="autoplay" 
                  title={`แผนการสอน ${currentPlan.semester}`}
                  className="ebook-iframe"
                ></iframe>
              </div>
            </div>
          </div>
          
          <div className="ebook-footer-info">
            <p>
              <Book size={16} />
              <span>สามารถเปิดอ่านและเลื่อนดูหน้าต่างๆ ได้โดยตรง หรือคลิกปุ่ม "ดาวน์โหลดเล่มแผน" เพื่อเก็บไฟล์ไว้ในเครื่อง</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

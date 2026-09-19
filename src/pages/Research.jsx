import { useState, useRef } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Maximize2, 
  Award, 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  Layers, 
  Calendar,
  CheckCircle2,
  Code2,
  HelpCircle
} from 'lucide-react';
import './Research.css';
import siteData from '../data/siteData.json';

export function Research() {
  const { research, siteConfig } = siteData;
  const slidesUrl = research?.slidesUrl || '/slides.html';
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      }
    }
  };

  return (
    <div className="research-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="badge">งานวิจัยในชั้นเรียน (Classroom Action Research)</div>
        <h1 className="text-h1">{research?.title || 'วิจัยในชั้นเรียน'}</h1>
        <p className="text-body max-w-3xl">
          โครงร่างและการดำเนินงานวิจัยในชั้นเรียนเพื่อแก้ปัญหาและส่งเสริมทักษะการเรียนรู้ของผู้เรียนผ่านนวัตกรรมทางการศึกษา
        </p>
      </div>

      {/* Main Research Banner Card */}
      <div className="research-banner-card glass-panel animate-slide-up">
        <div className="research-banner-main">
          <div className="research-code-badge">
            <Code2 size={16} />
            <span>รหัสหัวข้อ {research?.code || '3.5'} • โครงร่างงานวิจัย</span>
          </div>
          <h2 className="research-topic-title">
            {research?.topic || 'การพัฒนาเว็บแอปพลิเคชันแบบเกมมิฟิเคชัน เพื่อส่งเสริมผลสัมฤทธิ์ทางการเรียนและทักษะการเขียนโปรแกรมควบคุมบอร์ด Arduino Uno'}
          </h2>
          <p className="research-topic-sub">
            {research?.subTopic || 'สำหรับนักเรียนระดับชั้น ปวช.2 วิทยาลัยอาชีวศึกษานครปฐม'}
          </p>

          <div className="research-meta-tags">
            <span className="meta-tag">
              <UserCheck size={14} /> ผู้วิจัย: {research?.researcher || siteConfig?.studentName}
            </span>
            <span className="meta-tag">
              <GraduationCap size={14} /> {research?.faculty || 'คณะครุศาสตร์อุตสาหกรรม มจพ.'}
            </span>
            <span className="meta-tag">
              <Calendar size={14} /> {research?.semester || 'ภาคเรียนที่ 2 ปีการศึกษา 2569'}
            </span>
            <span className="meta-tag">
              <Layers size={14} /> สไลด์นำเสนอ {research?.totalSlides || 9} สไลด์
            </span>
            <span className="meta-tag">
              <Award size={14} /> รูปแบบ: {research?.design || 'One Group Pretest-Posttest'}
            </span>
          </div>
        </div>

        <div className="research-banner-actions">
          <a
            href={slidesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="research-primary-btn"
          >
            <ExternalLink size={18} />
            <span>เปิดสไลด์แท็บใหม่</span>
          </a>
          <button
            type="button"
            onClick={handleFullscreen}
            className="research-secondary-btn"
          >
            <Maximize2 size={16} />
            <span>ขยายเต็มหน้าจอ</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      {research?.highlights && research.highlights.length > 0 && (
        <div className="research-highlights-grid">
          {research.highlights.map((item, idx) => {
            const icons = [Sparkles, BookOpen, CheckCircle2, Calendar];
            const IconComponent = icons[idx % icons.length];
            return (
              <div key={idx} className="research-card glass-panel">
                <div className="research-card-icon">
                  <IconComponent size={22} />
                </div>
                <div className="research-card-content">
                  <h3 className="research-card-title">{item.title}</h3>
                  <p className="research-card-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Presentation Viewer Section */}
      <div className="research-slides-section">
        <div className="slides-container glass-panel">
          <div className="slides-header">
            <div className="slides-title-group">
              <div className="slides-icon-wrap">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="slides-name">
                  สไลด์นำเสนอโครงร่างงานวิจัยในชั้นเรียน (Interactive Presentation)
                </h3>
                <span className="slides-info">
                  จำนวน {research?.totalSlides || 9} สไลด์ • มีบทพูดนำเสนอ (Speaker Notes) ประกอบทุกสไลด์
                </span>
              </div>
            </div>

            <div className="slides-actions">
              <button
                type="button"
                onClick={handleFullscreen}
                className="slide-btn secondary"
                title="ขยายเต็มหน้าจอ"
              >
                <Maximize2 size={16} />
                <span>เต็มหน้าจอ</span>
              </button>
              <a
                href={slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="slide-btn primary"
                title="เปิดสไลด์ในหน้าต่างใหม่"
              >
                <ExternalLink size={16} />
                <span>เปิดแท็บใหม่</span>
              </a>
            </div>
          </div>

          <div className="slides-frame-wrap">
            <iframe
              ref={iframeRef}
              src={slidesUrl}
              title="สไลด์นำเสนอโครงร่างงานวิจัยในชั้นเรียน"
              className="slides-iframe"
              allow="fullscreen"
            ></iframe>
          </div>
        </div>

        {/* Presentation Tips / Shortcuts */}
        <div className="slides-footer-tip">
          <div className="tip-box">
            <div className="tip-header">
              <HelpCircle size={16} />
              <span>ปุ่มลัดและวิธีควบคุมสไลด์ (Controls & Shortcuts):</span>
            </div>
            <div className="tip-tags">
              <span className="tip-key"><kbd>Space</kbd> / <kbd>→</kbd> สไลด์ถัดไป</span>
              <span className="tip-key"><kbd>←</kbd> สไลด์ก่อนหน้า</span>
              <span className="tip-key"><kbd>S</kbd> เปิด/ปิดบทพูด (Speaker Notes)</span>
              <span className="tip-key"><kbd>F</kbd> สลับโหมดเต็มหน้าจอ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

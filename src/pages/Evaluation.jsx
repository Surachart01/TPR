import { 
  FileText, 
  Download, 
  ExternalLink, 
  Award, 
  BookOpen, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';
import './Evaluation.css';
import siteData from '../data/siteData.json';

export function Evaluation() {
  const { evaluation, siteConfig } = siteData;
  const pdfUrl = evaluation?.pdfUrl || '/docs/evaluation-surachart.pdf';
  const downloadName = evaluation?.downloadName || 'เล่มประเมิน_สุรชาติ.pdf';

  return (
    <div className="evaluation-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="badge">การประเมินผลการฝึกประสบการณ์วิชาชีพ</div>
        <h1 className="text-h1">{evaluation?.title || 'แบบการประเมินฝึกสอน'}</h1>
        <p className="text-body max-w-3xl">
          {evaluation?.description || 'เอกสารและแบบประเมินผลการฝึกประสบการณ์วิชาชีพครู ฉบับสมบูรณ์'}
        </p>
      </div>

      {/* Main Document Summary Card */}
      <div className="eval-banner-card glass-panel animate-slide-up">
        <div className="eval-banner-main">
          <div className="eval-doc-badge">
            <FileCheck2 size={16} />
            <span>{evaluation?.subtitle || 'เล่มแบบประเมินการฝึกประสบการณ์วิชาชีพครู'}</span>
          </div>
          <h2 className="eval-doc-title">แบบประเมินการฝึกประสบการณ์วิชาชีพครู</h2>
          <p className="eval-doc-sub">
            {siteConfig?.studentName} • {siteConfig?.major} • {siteConfig?.university}
          </p>

          <div className="eval-meta-tags">
            <span className="meta-tag">
              <GraduationCap size={14} /> {siteConfig?.schoolName}
            </span>
            <span className="meta-tag">
              <Calendar size={14} /> ปีการศึกษา {siteConfig?.academicYear}
            </span>
            <span className="meta-tag">
              <Layers size={14} /> เอกสาร {evaluation?.totalPages || 20} หน้า
            </span>
            <span className="meta-tag">
              <FileText size={14} /> ขนาดไฟล์ {evaluation?.fileSize || '68 MB'}
            </span>
            <span className="meta-tag">
              <UserCheck size={14} /> ผู้รับการประเมิน: {siteConfig?.studentName}
            </span>
          </div>
        </div>

        <div className="eval-banner-actions">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={downloadName}
            className="eval-download-btn"
          >
            <Download size={18} />
            <span>ดาวน์โหลดเล่มประเมิน (PDF)</span>
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eval-tab-btn"
          >
            <ExternalLink size={16} />
            <span>เปิดอ่านแท็บใหม่</span>
          </a>
        </div>
      </div>

      {/* Highlights Grid */}
      {evaluation?.sections && evaluation.sections.length > 0 && (
        <div className="eval-sections-grid">
          {evaluation.sections.map((sec, idx) => {
            const icons = [BookOpen, Award, ShieldCheck];
            const IconComponent = icons[idx % icons.length];
            return (
              <div key={idx} className="eval-feature-card glass-panel">
                <div className="eval-feature-icon">
                  <IconComponent size={22} />
                </div>
                <div className="eval-feature-content">
                  <h3 className="eval-feature-title">{sec.title}</h3>
                  <p className="eval-feature-desc">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Viewer Section */}
      <div className="eval-pdf-section">
        <div className="eval-pdf-container glass-panel">
          <div className="eval-pdf-header">
            <div className="eval-pdf-title-group">
              <div className="eval-pdf-icon-wrap">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="eval-pdf-name">
                  {downloadName}
                </h3>
                <span className="eval-pdf-info">
                  เอกสารฉบับเต็ม ({evaluation?.totalPages || 20} หน้า) • {siteConfig?.schoolName}
                </span>
              </div>
            </div>

            <div className="eval-pdf-actions">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-btn secondary"
                title="เปิดเอกสารในแท็บใหม่"
              >
                <ExternalLink size={16} />
                <span>เปิดแท็บใหม่</span>
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={downloadName}
                className="pdf-btn primary"
                title="ดาวน์โหลดไฟล์ PDF"
              >
                <Download size={16} />
                <span>ดาวน์โหลด PDF</span>
              </a>
            </div>
          </div>

          <div className="eval-pdf-frame-wrap">
            <iframe
              src={pdfUrl}
              title="เล่มประเมินการฝึกประสบการณ์วิชาชีพครู"
              className="eval-pdf-iframe"
            ></iframe>
          </div>
        </div>

        <div className="eval-pdf-footer">
          <p>
            <BookOpen size={16} />
            <span>
              สามารถเลื่อนดูหน้าเอกสาร ซูมเข้า-ออก หรือกดปุ่ม <strong>"เปิดแท็บใหม่"</strong> ด้านบนเพื่อเปิดดูเอกสารแบบเต็มหน้าจอ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

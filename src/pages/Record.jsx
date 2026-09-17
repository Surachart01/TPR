import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  Info, 
  ExternalLink, 
  RefreshCw, 
  Image as ImageIcon, 
  FileText, 
  LayoutGrid, 
  List,
  CheckCircle2,
  Filter
} from 'lucide-react';
import './Record.css';
import siteData from '../data/siteData.json';

export function Record() {
  const { teachingRecord } = siteData;
  const [activeTerm, setActiveTerm] = useState('term1');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [records, setRecords] = useState([]);
  const [maxWeek, setMaxWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Filter and view states
  const [imageFilter, setImageFilter] = useState('all'); // 'all' | 'with-image' | 'no-image'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  const getPreviewUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/preview`;
  };

  const getDriveUrl = (id) => {
    if (!id || id === '-' || id === '') return null;
    return `https://drive.google.com/file/d/${id}/view`;
  };

  const getSheetViewUrl = (url) => {
    if (!url) return '#';
    if (url.includes('/pub?')) {
      return url.replace('/pub?', '/pubhtml?').replace('&output=csv', '');
    }
    if (url.includes('/gviz/tq') || url.includes('/export?')) {
      return url.split('/gviz/tq')[0].split('/export?')[0] + '/edit?gid=0';
    }
    return url;
  };

  const isImageValid = (id) => {
    return Boolean(id && id !== '-' && id !== '' && id.trim().length > 3);
  };

  // Robust CSV line parser that handles quoted fields
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Clean quotes from CSV field
  const cleanField = (str) => {
    if (!str) return '';
    return str.replace(/^["']|["']$/g, '').trim();
  };

  // Parse raw CSV text → array of record objects
  // Columns: วันที่(0), วิชาสอน(1), รายละเอียด(2), รูปภาพ(3), เทอม(4), สัปดาห์(5)
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const rows = lines.slice(1); // Skip header row
    const parsed = rows
      .map(line => {
        const cols = parseCSVLine(line);
        return {
          date: cleanField(cols[0]),
          subject: cleanField(cols[1]) || '-',
          detail: cleanField(cols[2]),
          imageId: cleanField(cols[3]),
          term: cleanField(cols[4]),
          week: parseInt(cleanField(cols[5])) || 0,
        };
      })
      // Only keep rows that have a date AND some content
      .filter(r => r.date && r.date !== '' && (r.detail !== '' || r.imageId !== ''));

    return parsed;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsDemoMode(false);
    try {
      const response = await fetch(teachingRecord.sheetUrl);
      if (!response.ok) throw new Error('Network error');
      const text = await response.text();
      const all = parseCSV(text);
      // Filter by term column (activeTerm === 'term1' → term === '1', etc.)
      const termNum = activeTerm === 'term1' ? '1' : '2';
      const data = all.filter(r => !r.term || r.term === '' || r.term === termNum);
      setRecords(data);
      // Set maxWeek from sheet's สัปดาห์ column
      const max = data.reduce((acc, r) => Math.max(acc, r.week || 0), 1);
      setMaxWeek(max > 0 ? max : 1);
    } catch (err) {
      console.warn('Google Sheet fetch error:', err);
      setError('ไม่สามารถโหลดข้อมูลจาก Google Sheets ได้ กรุณาตรวจสอบลิงก์หรือการแชร์ชีต');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSelectedWeek(1);
  }, [activeTerm]);

  // Current week's records
  const weekRecords = useMemo(() => {
    return records.filter(r => r.week === selectedWeek);
  }, [records, selectedWeek]);

  // Stats for the active week
  const weekStats = useMemo(() => {
    const total = weekRecords.length;
    const withImg = weekRecords.filter(r => isImageValid(r.imageId)).length;
    const noImg = total - withImg;
    return { total, withImg, noImg };
  }, [weekRecords]);

  // Filtered records by user selection
  const filteredRecords = useMemo(() => {
    return weekRecords.filter(r => {
      const hasImg = isImageValid(r.imageId);
      if (imageFilter === 'with-image') return hasImg;
      if (imageFilter === 'no-image') return !hasImg;
      return true;
    });
  }, [weekRecords, imageFilter]);

  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1);

  return (
    <div className="record-container animate-fade-in">
      <div className="page-header">
        <div className="badge">บันทึกการปฏิบัติงาน</div>
        <h1 className="text-h1">{teachingRecord.title}</h1>
        <p className="page-subtitle">
          {teachingRecord.description || 'บันทึกสรุปการปฏิบัติหน้าที่การสอนรายวัน รายสัปดาห์ และกิจกรรมที่ได้รับมอบหมาย'}
        </p>
      </div>

      {/* Term Selection & Refresh */}
      <div className="record-top-bar">
        <div className="term-tabs">
          <button
            className={`term-tab ${activeTerm === 'term1' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term1')}
          >
            ภาคเรียนที่ 1
          </button>
          <button
            className={`term-tab ${activeTerm === 'term2' ? 'active' : ''}`}
            onClick={() => setActiveTerm('term2')}
          >
            ภาคเรียนที่ 2
          </button>
        </div>
        
        <div className="top-bar-actions">
          <button onClick={fetchData} className="refresh-btn" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>รีเฟรชข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Week Selection */}
      {!loading && !error && weeks.length > 0 && (
        <div className="week-selector-wrapper glass-panel">
          <div className="selector-header">
            <div className="selector-title">
              <Clock size={18} />
              <span>เลือกสัปดาห์ที่ต้องการดูบันทึก</span>
            </div>
            <span className="week-counter-badge">
              สัปดาห์ที่ {selectedWeek} จากทั้งหมด {maxWeek} สัปดาห์
            </span>
          </div>
          <div className="week-grid">
            {weeks.map(week => (
              <button
                key={week}
                className={`week-btn ${selectedWeek === week ? 'active' : ''}`}
                onClick={() => setSelectedWeek(week)}
              >
                <span className="week-label">สัปดาห์ที่</span>
                <span className="week-number">{week}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Week Control & View Toolbar */}
      {!loading && !error && weekRecords.length > 0 && (
        <div className="record-controls-bar glass-panel">
          {/* Quick Stats Pill */}
          <div className="week-summary-pills">
            <div className="summary-pill total">
              <CheckCircle2 size={15} />
              <span>ทั้งหมด <strong>{weekStats.total}</strong> รายการ</span>
            </div>
            {weekStats.withImg > 0 && (
              <div className="summary-pill with-photo">
                <ImageIcon size={15} />
                <span>มีภาพประกอบ <strong>{weekStats.withImg}</strong></span>
              </div>
            )}
            {weekStats.noImg > 0 && (
              <div className="summary-pill text-only">
                <FileText size={15} />
                <span>บันทึกข้อความ <strong>{weekStats.noImg}</strong></span>
              </div>
            )}
          </div>

          {/* Filter & View Switcher */}
          <div className="controls-right-group">
            <div className="filter-button-group">
              <button
                className={`filter-btn ${imageFilter === 'all' ? 'active' : ''}`}
                onClick={() => setImageFilter('all')}
                title="แสดงทั้งหมด"
              >
                ทั้งหมด ({weekStats.total})
              </button>
              <button
                className={`filter-btn ${imageFilter === 'with-image' ? 'active' : ''}`}
                onClick={() => setImageFilter('with-image')}
                title="แสดงเฉพาะรายการที่มีรูปภาพ"
              >
                <ImageIcon size={14} />
                <span>มีภาพ ({weekStats.withImg})</span>
              </button>
              <button
                className={`filter-btn ${imageFilter === 'no-image' ? 'active' : ''}`}
                onClick={() => setImageFilter('no-image')}
                title="แสดงเฉพาะรายการบันทึกข้อความ"
              >
                <FileText size={14} />
                <span>ข้อความ ({weekStats.noImg})</span>
              </button>
            </div>

            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="มุมมองการ์ด (Grid View)"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                onClick={() => setViewMode('timeline')}
                title="มุมมองไทม์ไลน์ (Timeline View)"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="error-banner glass-panel">
          <Info size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Content Area */}
      <div className={`records-content-wrapper ${viewMode === 'timeline' ? 'timeline-layout' : 'grid-layout'}`}>
        {loading ? (
          <div className="loading-state glass-panel">
            <RefreshCw size={36} className="animate-spin text-primary" />
            <h3>กำลังดึงข้อมูลจาก Google Sheets...</h3>
            <p>โปรดรอสักครู่ ระบบกำลังจัดเตรียมข้อมูลบันทึกการปฏิบัติงาน</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className={viewMode === 'timeline' ? 'records-timeline' : 'records-grid'}>
            {filteredRecords.map((item, index) => {
              const hasImage = isImageValid(item.imageId);
              
              return (
                <div 
                  key={index} 
                  className={`record-card glass-panel ${hasImage ? 'has-image-card' : 'no-image-card'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Card Header: Date & Subject */}
                  <div className="card-header">
                    <div className="header-left">
                      <div className="date-tag">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                      {item.subject && item.subject !== '-' && (
                        <div className="subject-tag">
                          <BookOpen size={14} />
                          <span>{item.subject}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="header-right">
                      {hasImage ? (
                        <span className="media-status-badge has-img">
                          <ImageIcon size={12} />
                          <span>มีภาพประกอบ</span>
                        </span>
                      ) : (
                        <span className="media-status-badge text-doc">
                          <FileText size={12} />
                          <span>บันทึกการสอน/กิจกรรม</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="detail-box">
                      <p className="detail-text">{item.detail}</p>
                    </div>

                    {/* Render Image Iframe & Direct Link ONLY when imageId exists */}
                    {hasImage && (
                      <div className="record-media-container">
                        <div className="record-image-wrapper">
                          <iframe
                            src={getPreviewUrl(item.imageId)}
                            className="record-iframe"
                            title="ภาพกิจกรรม"
                            allow="autoplay"
                            loading="lazy"
                          />
                        </div>
                        <a 
                          href={getDriveUrl(item.imageId)} 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="view-original-btn"
                        >
                          <ExternalLink size={14} />
                          <span>เปิดดูรูปภาพความละเอียดสูงบน Google Drive</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : !error ? (
          <div className="empty-state glass-panel">
            <Info size={48} className="text-muted" />
            <h3>ไม่พบข้อมูลสำหรับเงื่อนไขที่เลือก</h3>
            <p>
              {imageFilter !== 'all' 
                ? 'ไม่พบบันทึกที่ตรงกับตัวกรองที่เลือก ลองเปลี่ยนเป็น "ทั้งหมด"' 
                : `ยังไม่มีรายการบันทึกในสัปดาห์ที่ ${selectedWeek}`}
            </p>
            {imageFilter !== 'all' && (
              <button className="reset-filter-btn" onClick={() => setImageFilter('all')}>
                แสดงรายการทั้งหมด
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer Sheet Link */}
      {teachingRecord.sheetUrl && (
        <div className="guide-footer glass-panel">
          <div className="footer-content">
            <div className="footer-info">
              <h4>ต้องการดูข้อมูลบันทึกฉบับเต็ม หรือแก้ไขข้อมูล?</h4>
              <p>สามารถเปิดดูและจัดการตารางบันทึกการฝึกสอนได้โดยตรงบน Google Sheets</p>
            </div>
            <a 
              href={getSheetViewUrl(teachingRecord.sheetUrl)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="sheet-link-btn"
            >
              <ExternalLink size={18} />
              <span>เปิด Google Sheet บันทึกการฝึกสอน</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

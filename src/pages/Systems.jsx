import { useState } from 'react';
import { 
  Laptop, 
  ExternalLink, 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles,
  Code2,
  GitBranch
} from 'lucide-react';
import './Systems.css';
import siteData from '../data/siteData.json';

export function Systems() {
  const { systems } = siteData;
  const projects = systems?.projects || [];
  
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = ['ทั้งหมด', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.techStack && project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const activeCount = projects.filter(p => p.status === 'ใช้งานจริง').length;
  const inDevCount = projects.filter(p => p.status === 'กำลังพัฒนา').length;

  return (
    <div className="systems-container animate-fade-in">
      <div className="page-header">
        <div className="badge">ผลงานและนวัตกรรม</div>
        <h1 className="text-h1">{systems?.title || 'ผลงานการพัฒนาระบบ'}</h1>
        <p className="text-body max-w-2xl">
          {systems?.description || 'รวบรวมระบบสารสนเทศและนวัตกรรมดิจิทัลที่พัฒนาขึ้นเพื่อสนับสนุนการดำเนินงานของวิทยาลัย'}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="systems-stats-grid">
        <div className="sys-stat-card glass-panel">
          <div className="sys-stat-icon total">
            <Layers size={24} />
          </div>
          <div className="sys-stat-info">
            <h3>{projects.length}</h3>
            <p>ระบบทั้งหมด</p>
          </div>
        </div>
        <div className="sys-stat-card glass-panel">
          <div className="sys-stat-icon active">
            <CheckCircle2 size={24} />
          </div>
          <div className="sys-stat-info">
            <h3>{activeCount}</h3>
            <p>เปิดใช้งานจริง</p>
          </div>
        </div>
        <div className="sys-stat-card glass-panel">
          <div className="sys-stat-icon dev">
            <Clock size={24} />
          </div>
          <div className="sys-stat-info">
            <h3>{inDevCount}</h3>
            <p>กำลังพัฒนา / ปรับปรุง</p>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="systems-controls">
        <div className="category-tabs glass-panel">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-wrapper glass-panel">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="ค้นหาชื่อระบบ, เทคโนโลยี..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="systems-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="system-card glass-panel">
              <div className="system-card-image-wrapper">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="system-card-img" />
                ) : (
                  <div className="system-img-placeholder">
                    <Laptop size={48} />
                  </div>
                )}
                <div className="system-badges-overlay">
                  <span className="system-category-tag">{project.category}</span>
                  <span className={`system-status-tag ${project.status === 'ใช้งานจริง' ? 'active' : 'dev'}`}>
                    {project.status === 'ใช้งานจริง' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="system-card-body">
                <div className="system-header-row">
                  <h2 className="system-title">{project.title}</h2>
                  {project.date && <span className="system-date">{project.date}</span>}
                </div>

                <p className="system-description">{project.description}</p>

                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="system-features">
                    <h3 className="features-title">
                      <Sparkles size={15} className="features-icon" />
                      คุณสมบัติและฟังก์ชันหลัก
                    </h3>
                    <ul className="features-list">
                      {project.keyFeatures.map((feat, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} className="feature-check-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.techStack && project.techStack.length > 0 && (
                  <div className="system-tech-stack">
                    <div className="tech-stack-label">
                      <Code2 size={14} />
                      <span>เทคโนโลยีที่ใช้:</span>
                    </div>
                    <div className="tech-tags">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="system-card-actions">
                  {project.systemUrl ? (
                    <a
                      href={project.systemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="system-action-btn primary"
                    >
                      <ExternalLink size={16} />
                      <span>เข้าสู่ระบบ</span>
                    </a>
                  ) : (
                    <button className="system-action-btn disabled" disabled>
                      <span>เร็วๆ นี้</span>
                    </button>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="system-action-btn secondary"
                      title="ดูโค้ดบน GitHub"
                    >
                      <GitBranch size={16} />
                      <span>GitHub</span>
                    </a>
                  )}

                  {project.docUrl && (
                    <a
                      href={project.docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="system-action-btn outline"
                      title="ดูเอกสารคู่มือการใช้งาน"
                    >
                      <FileText size={16} />
                      <span>คู่มือ</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-systems-found glass-panel">
            <Laptop size={48} className="text-muted" />
            <p>ไม่พบผลงานระบบที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}

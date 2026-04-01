"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getExperiences, createExperience, updateExperience, deleteExperience,
  getSkills, createSkill, updateSkill, deleteSkill,
  getProjects, createProject, updateProject, deleteProject,
  uploadResume, getResume, getConfig, updateConfig,
  getSocials, createSocial, updateSocial, deleteSocial,
  type Experience, type Skill, type Project, type ResumeInfo, type SiteConfig, type SocialLink, type SectionLayout,
} from '@/app/lib/api';

type Tab = 'overview' | 'experiences' | 'skills' | 'projects' | 'resume' | 'config' | 'socials' | 'layout';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [message, setMessage] = useState({ text: '', type: '' as 'success' | 'error' | '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) router.push('/admin');
  }, [router]);

  const loadData = useCallback(async () => {
    try {
      const [exp, sk, proj, res, conf, soc] = await Promise.all([
        getExperiences(), getSkills(), getProjects(), getResume(), getConfig(), getSocials(),
      ]);
      setExperiences(exp);
      setSkills(sk);
      setProjects(proj);
      setResume(res);
      setConfig(conf);
      setSocials(soc);
    } catch {
      showMessage('Failed to load data.', 'error');
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'experiences', label: 'Chronicles', icon: '📜', count: experiences.length },
    { key: 'skills', label: 'Arsenal', icon: '🛡️', count: skills.length },
    { key: 'projects', label: 'Conquests', icon: '⚔️', count: projects.length },
    { key: 'resume', label: 'Decree', icon: '📄' },
    { key: 'socials', label: 'Links', icon: '🔗', count: socials.length },
    { key: 'layout', label: 'Layout', icon: '🎨' },
    { key: 'config', label: 'Config', icon: '⚙️' },
  ];

  return (
    <main className="min-h-screen bg-parchment">
      {/* Top Bar */}
      <div className="bg-parchment-light/80 backdrop-blur-xl border-b border-gold-light/10 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gold-light/5 flex items-center justify-center text-iron-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h1 className="font-heading text-nebula-purple-light text-base tracking-wider">
            Mission Control
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-iron-light hover:text-crimson-light text-xs transition-colors font-heading tracking-wider">
            View Site
          </a>
          <button onClick={handleLogout} className="text-iron-light hover:text-rose text-xs transition-colors font-heading tracking-wider">
            Logout
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div className={`px-6 py-2.5 text-center text-sm animate-fade-in-down ${
          message.type === 'error' ? 'bg-rose/10 text-rose border-b border-rose/20' : 'bg-forest/10 text-forest border-b border-forest/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'} min-h-[calc(100vh-52px)] bg-parchment-light/40 backdrop-blur-sm border-r border-gold-light/5 transition-all duration-300`}>
          <nav className="p-3 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-gold-light/10 text-gold-light border border-gold-light/15'
                    : 'text-iron-light hover:text-dark-wood hover:bg-dark-wood/3'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="font-heading tracking-wider text-[11px] uppercase flex-1">
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    activeTab === tab.key ? 'bg-gold-light/20 text-gold-light' : 'bg-iron-light/10 text-iron-light/50'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 p-6 min-h-[calc(100vh-52px)]">
          {activeTab === 'overview' && (
            <OverviewPanel
              experiences={experiences}
              skills={skills}
              projects={projects}
              socials={socials}
              resume={resume}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'experiences' && (
            <ExperiencesPanel experiences={experiences} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'skills' && (
            <SkillsPanel skills={skills} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'projects' && (
            <ProjectsPanel projects={projects} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'resume' && (
            <ResumePanel resume={resume} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'socials' && (
            <SocialsPanel socials={socials} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'layout' && (
            <LayoutPanel config={config} onRefresh={loadData} onMessage={showMessage} />
          )}
          {activeTab === 'config' && (
            <ConfigPanel config={config} onRefresh={loadData} onMessage={showMessage} />
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Overview Panel ────────────────────────────────────────────
function OverviewPanel({
  experiences, skills, projects, socials, resume, onNavigate,
}: {
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  socials: SocialLink[];
  resume: ResumeInfo | null;
  onNavigate: (tab: Tab) => void;
}) {
  const totalSkills = skills.reduce((sum, g) => sum + g.items.length, 0);
  const featuredProjects = projects.filter(p => p.featured).length;

  const stats = [
    { label: 'Experiences', value: experiences.length, icon: '📜', tab: 'experiences' as Tab, color: 'from-amber-400/15 to-orange-400/15' },
    { label: 'Skill Groups', value: skills.length, icon: '🛡️', tab: 'skills' as Tab, color: 'from-violet-400/15 to-purple-400/15', sub: `${totalSkills} total skills` },
    { label: 'Projects', value: projects.length, icon: '⚔️', tab: 'projects' as Tab, color: 'from-sky-400/15 to-blue-400/15', sub: `${featuredProjects} featured` },
    { label: 'Social Links', value: socials.length, icon: '🐦', tab: 'socials' as Tab, color: 'from-emerald-400/15 to-green-400/15' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-heading text-2xl text-dark-wood tracking-wider mb-1">Dashboard</h2>
        <p className="text-iron-light text-sm">Welcome back, Commander. Here&apos;s your portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <button
            key={stat.label}
            onClick={() => onNavigate(stat.tab)}
            className="glass-card p-5 text-left group hover:border-gold-light/15"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center border border-white/5`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <span className="font-heading text-[11px] text-iron-light uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="font-heading text-3xl text-dark-wood font-bold">{stat.value}</div>
            {stat.sub && <p className="text-iron-light/50 text-xs mt-1">{stat.sub}</p>}
          </button>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-heading text-sm text-gold-light tracking-wider mb-4">Resume Status</h3>
          {resume ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
                <span className="text-forest text-sm">&#10003;</span>
              </div>
              <div>
                <p className="text-dark-wood text-sm font-medium">{resume.filename}</p>
                <p className="text-iron-light/50 text-xs">Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose/10 flex items-center justify-center text-rose text-sm">!</div>
              <p className="text-iron-light text-sm">No resume uploaded yet</p>
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-heading text-sm text-gold-light tracking-wider mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {experiences.slice(0, 3).map(exp => (
              <div key={exp.id} className="flex items-center gap-2 text-xs">
                <span className="text-gold-light/50">📜</span>
                <span className="text-iron-light truncate">{exp.title} at {exp.company}</span>
              </div>
            ))}
            {experiences.length === 0 && <p className="text-iron-light/50 text-xs">No entries yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Components ───────────────────────────────────────
function PanelHeader({ icon, title, onAdd, showForm }: { icon: string; title: string; onAdd: () => void; showForm: boolean }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="font-heading text-xl text-dark-wood tracking-wider flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <button onClick={onAdd} className="medieval-btn text-[11px] !py-2 !px-4">
        {showForm ? 'Cancel' : '+ Add New'}
      </button>
    </div>
  );
}

function ItemCard({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="glass-card p-4 flex justify-between items-start group hover:border-gold-light/10">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex gap-1.5 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="w-7 h-7 rounded-lg hover:bg-gold-light/10 flex items-center justify-center text-gold-light/60 hover:text-gold-light transition-colors text-xs">
          &#9998;
        </button>
        <button onClick={onDelete} className="w-7 h-7 rounded-lg hover:bg-rose/10 flex items-center justify-center text-rose/60 hover:text-rose transition-colors text-xs">
          &#128465;
        </button>
      </div>
    </div>
  );
}

function FormCard({ children, onSubmit }: { children: React.ReactNode; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <form onSubmit={onSubmit} className="glass-card p-6 mb-6 space-y-4 border-gold-light/10!">
      {children}
    </form>
  );
}

// ─── Experiences Panel ─────────────────────────────────────────
function ExperiencesPanel({ experiences, onRefresh, onMessage }: { experiences: Experience[]; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ title: '', company: '', period: '', description: '', technologies: '', order: 0 });

  const resetForm = () => { setForm({ title: '', company: '', period: '', description: '', technologies: '', order: 0 }); setEditing(null); setShowForm(false); };

  const startEdit = (exp: Experience) => {
    setForm({ title: exp.title, company: exp.company, period: exp.period, description: exp.description, technologies: exp.technologies.join(', '), order: exp.order });
    setEditing(exp);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editing) { await updateExperience(editing.id, data); onMessage('Chronicle updated!'); }
      else { await createExperience(data); onMessage('Chronicle added!'); }
      resetForm(); onRefresh();
    } catch { onMessage('Failed to save chronicle.', 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this chronicle?')) return;
    try { await deleteExperience(id); onMessage('Chronicle removed.'); onRefresh(); }
    catch { onMessage('Failed to remove chronicle.', 'error'); }
  };

  return (
    <div>
      <PanelHeader icon="📜" title="Chronicles of Service" onAdd={() => { resetForm(); setShowForm(!showForm); }} showForm={showForm} />

      {showForm && (
        <FormCard onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="admin-input" />
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company" required className="admin-input" />
            <input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="Period (e.g. 2024 - Present)" required className="admin-input" />
            <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="Technologies (comma-separated)" className="admin-input" />
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} required className="admin-input" />
          <div className="flex items-center gap-3">
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="admin-input w-24!" />
            <button type="submit" className="medieval-btn text-[11px] !py-2">{editing ? 'Update' : 'Create'}</button>
          </div>
        </FormCard>
      )}

      <div className="space-y-2">
        {experiences.map(exp => (
          <ItemCard key={exp.id} onEdit={() => startEdit(exp)} onDelete={() => handleDelete(exp.id)}>
            <h3 className="text-dark-wood font-heading text-sm font-bold">{exp.title}</h3>
            <p className="text-iron-light text-xs mt-0.5">{exp.company} &middot; {exp.period}</p>
            <p className="text-iron-light/50 text-xs mt-1 line-clamp-1">{exp.description}</p>
          </ItemCard>
        ))}
        {experiences.length === 0 && <p className="text-iron-light/40 text-sm text-center py-12">No chronicles yet. Add your first experience.</p>}
      </div>
    </div>
  );
}

// ─── Skills Panel ──────────────────────────────────────────────
function SkillsPanel({ skills, onRefresh, onMessage }: { skills: Skill[]; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ category: '', items: '', order: 0 });

  const resetForm = () => { setForm({ category: '', items: '', order: 0 }); setEditing(null); setShowForm(false); };

  const startEdit = (skill: Skill) => {
    setForm({ category: skill.category, items: skill.items.join(', '), order: skill.order });
    setEditing(skill);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, items: form.items.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editing) { await updateSkill(editing.id, data); onMessage('Arsenal updated!'); }
      else { await createSkill(data); onMessage('Arsenal added!'); }
      resetForm(); onRefresh();
    } catch { onMessage('Failed to save arsenal.', 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this skill category?')) return;
    try { await deleteSkill(id); onMessage('Skill removed.'); onRefresh(); }
    catch { onMessage('Failed to remove skill.', 'error'); }
  };

  return (
    <div>
      <PanelHeader icon="🛡️" title="Arsenal Management" onAdd={() => { resetForm(); setShowForm(!showForm); }} showForm={showForm} />

      {showForm && (
        <FormCard onSubmit={handleSubmit}>
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category name" required className="admin-input" />
          <textarea value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} placeholder="Skills (comma-separated)" rows={2} required className="admin-input" />
          <div className="flex items-center gap-3">
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="admin-input w-24!" />
            <button type="submit" className="medieval-btn text-[11px] !py-2">{editing ? 'Update' : 'Create'}</button>
          </div>
        </FormCard>
      )}

      <div className="space-y-2">
        {skills.map(skill => (
          <ItemCard key={skill.id} onEdit={() => startEdit(skill)} onDelete={() => handleDelete(skill.id)}>
            <h3 className="text-dark-wood font-heading text-sm font-bold">{skill.category}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {skill.items.map(item => (
                <span key={item} className="text-[10px] px-2 py-0.5 bg-iron-light/5 text-iron-light rounded-md">{item}</span>
              ))}
            </div>
          </ItemCard>
        ))}
        {skills.length === 0 && <p className="text-iron-light/40 text-sm text-center py-12">No skills yet.</p>}
      </div>
    </div>
  );
}

// ─── Projects Panel ────────────────────────────────────────────
function ProjectsPanel({ projects, onRefresh, onMessage }: { projects: Project[]; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', liveUrl: '', repoUrl: '', technologies: '', featured: false, order: 0 });

  const resetForm = () => { setForm({ title: '', description: '', imageUrl: '', liveUrl: '', repoUrl: '', technologies: '', featured: false, order: 0 }); setEditing(null); setShowForm(false); };

  const startEdit = (proj: Project) => {
    setForm({ title: proj.title, description: proj.description, imageUrl: proj.imageUrl || '', liveUrl: proj.liveUrl || '', repoUrl: proj.repoUrl || '', technologies: proj.technologies.join(', '), featured: proj.featured, order: proj.order });
    setEditing(proj);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean), imageUrl: form.imageUrl || null, liveUrl: form.liveUrl || null, repoUrl: form.repoUrl || null };
    try {
      if (editing) { await updateProject(editing.id, data); onMessage('Conquest updated!'); }
      else { await createProject(data); onMessage('Conquest added!'); }
      resetForm(); onRefresh();
    } catch { onMessage('Failed to save conquest.', 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this conquest?')) return;
    try { await deleteProject(id); onMessage('Conquest removed.'); onRefresh(); }
    catch { onMessage('Failed to remove conquest.', 'error'); }
  };

  return (
    <div>
      <PanelHeader icon="⚔️" title="Conquest Gallery" onAdd={() => { resetForm(); setShowForm(!showForm); }} showForm={showForm} />

      {showForm && (
        <FormCard onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="admin-input" />
            <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="Technologies (comma-separated)" className="admin-input" />
            <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL (optional)" className="admin-input" />
            <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="Live URL (optional)" className="admin-input" />
            <input value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} placeholder="Repository URL (optional)" className="admin-input" />
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="admin-input" />
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} required className="admin-input" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-dark-wood text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-gold w-4 h-4" />
              <span className="font-heading text-xs tracking-wider">Featured</span>
            </label>
            <button type="submit" className="medieval-btn text-[11px] !py-2">{editing ? 'Update' : 'Create'}</button>
          </div>
        </FormCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {projects.map(proj => (
          <ItemCard key={proj.id} onEdit={() => startEdit(proj)} onDelete={() => handleDelete(proj.id)}>
            <div className="flex items-start gap-3">
              {proj.imageUrl && (
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-aged-paper">
                  <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-dark-wood font-heading text-sm font-bold flex items-center gap-1.5">
                  {proj.featured && <span className="text-gold text-xs">&#9733;</span>}
                  {proj.title}
                </h3>
                <p className="text-iron-light/50 text-xs mt-0.5 line-clamp-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {proj.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 bg-iron-light/5 text-iron-light/60 rounded">{t}</span>
                  ))}
                  {proj.technologies.length > 3 && <span className="text-[9px] text-iron-light/40">+{proj.technologies.length - 3}</span>}
                </div>
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      {projects.length === 0 && <p className="text-iron-light/40 text-sm text-center py-12">No conquests yet.</p>}
    </div>
  );
}

// ─── Resume Panel ──────────────────────────────────────────────
function ResumePanel({ resume, onRefresh, onMessage }: { resume: ResumeInfo | null; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      onMessage('Only PDF files are accepted.', 'error');
      return;
    }
    setUploading(true);
    try {
      await uploadResume(file);
      onMessage('Resume uploaded successfully!');
      onRefresh();
    } catch {
      onMessage('Failed to upload resume.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      <h2 className="font-heading text-xl text-dark-wood tracking-wider mb-6 flex items-center gap-2">
        <span>📄</span> Royal Decree (Resume)
      </h2>

      <div className="glass-card p-6 space-y-6">
        {resume && (
          <div className="flex items-center gap-4 p-4 bg-forest/5 rounded-xl border border-forest/10">
            <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-dark-wood text-sm font-medium">{resume.filename}</p>
              <p className="text-iron-light/50 text-xs">Uploaded {new Date(resume.uploadedAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            dragOver ? 'border-gold bg-gold-light/5' : 'border-iron-light/10 hover:border-gold-light/30'
          }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-3xl mb-3 opacity-50">📄</div>
          <p className="text-dark-wood text-sm mb-1">
            {uploading ? 'Uploading...' : 'Drag & drop a PDF here'}
          </p>
          <p className="text-iron-light/50 text-xs mb-4">or</p>
          <label className="medieval-btn text-[11px] !py-2 cursor-pointer inline-block">
            Browse Files
            <input type="file" accept=".pdf" onChange={handleFileChange} disabled={uploading} className="hidden" />
          </label>
          <p className="text-iron-light/30 text-[10px] mt-3">PDF only, max 10MB</p>
        </div>
      </div>
    </div>
  );
}

// ─── Layout Panel (Drag & Drop) ───────────────────────────────
const DEFAULT_SECTIONS: SectionLayout[] = [
  { id: 'hero', visible: true },
  { id: 'about', visible: true },
  { id: 'skills', visible: true },
  { id: 'stats', visible: true },
  { id: 'experience', visible: true },
  { id: 'contact', visible: true },
];

const SECTION_META: Record<string, { label: string; icon: string; desc: string }> = {
  hero: { label: 'Hero Section', icon: '🚀', desc: 'Main hero banner with title, roles, and CTA buttons' },
  about: { label: 'About Me', icon: '🧑‍🚀', desc: 'Biography and highlight cards' },
  skills: { label: 'Tech Arsenal', icon: '⚡', desc: 'Skills grid organized by category' },
  stats: { label: 'Stats Counter', icon: '📊', desc: 'Animated statistics counters' },
  experience: { label: 'Mission Log', icon: '📜', desc: 'Work experience timeline' },
  contact: { label: 'Contact', icon: '📡', desc: 'Contact form and social links' },
};

function LayoutPanel({ config, onRefresh, onMessage }: { config: SiteConfig | null; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [sections, setSections] = useState<SectionLayout[]>(DEFAULT_SECTIONS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config?.sectionLayout) {
      try {
        const parsed = JSON.parse(config.sectionLayout);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
        }
      } catch {
        // use default
      }
    }
  }, [config]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newSections = [...sections];
    const [dragged] = newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, dragged);
    setSections(newSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const toggleVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], visible: !newSections[index].visible };
    setSections(newSections);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setSections(newSections);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig({ sectionLayout: JSON.stringify(sections) });
      onMessage('Layout saved! Changes will appear on the landing page.');
      onRefresh();
    } catch {
      onMessage('Failed to save layout.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSections(DEFAULT_SECTIONS);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading text-xl text-dark-wood tracking-wider flex items-center gap-2">
            <span>🎨</span> Landing Page Layout
          </h2>
          <p className="text-iron-light text-xs mt-1">Drag and drop sections to reorder. Toggle visibility to show/hide sections.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="medieval-btn-outline text-[11px] !py-2 !px-4">
            Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="medieval-btn text-[11px] !py-2 !px-4">
            {saving ? 'Saving...' : 'Save Layout'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => {
          const meta = SECTION_META[section.id] || { label: section.id, icon: '?', desc: '' };
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`glass-card p-4 flex items-center gap-4 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                isDragging ? 'opacity-50 scale-[0.98]' : ''
              } ${isDragOver ? 'border-violet/30! shadow-[0_0_20px_rgba(139,92,246,0.2)]' : ''} ${
                !section.visible ? 'opacity-60' : ''
              }`}
            >
              {/* Drag Handle */}
              <div className="flex flex-col gap-0.5 text-iron-light/30 cursor-grab">
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </div>

              {/* Order number */}
              <span className="font-heading text-xs text-iron-light/30 w-6 text-center">{index + 1}</span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet/10 to-nebula-blue/10 flex items-center justify-center border border-violet/10 shrink-0">
                <span className="text-xl">{meta.icon}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-dark-wood font-heading text-sm font-bold tracking-wide">{meta.label}</h3>
                <p className="text-iron-light/50 text-xs mt-0.5">{meta.desc}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="w-7 h-7 rounded-lg hover:bg-iron-light/5 flex items-center justify-center text-iron-light/40 hover:text-dark-wood transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === sections.length - 1}
                  className="w-7 h-7 rounded-lg hover:bg-iron-light/5 flex items-center justify-center text-iron-light/40 hover:text-dark-wood transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleVisibility(index)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    section.visible
                      ? 'hover:bg-forest/10 text-forest/60 hover:text-forest'
                      : 'hover:bg-rose/10 text-rose/60 hover:text-rose'
                  }`}
                  title={section.visible ? 'Hide section' : 'Show section'}
                >
                  {section.visible ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 glass-card p-4">
        <p className="text-iron-light/40 text-xs font-heading tracking-wider">
          <span className="text-cosmic-gold">TIP:</span> Drag sections to reorder them on the landing page. Use the eye icon to toggle visibility. Click &quot;Save Layout&quot; to apply changes.
        </p>
      </div>
    </div>
  );
}

// ─── Config Panel ──────────────────────────────────────────────
function ConfigPanel({ config, onRefresh, onMessage }: { config: SiteConfig | null; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [form, setForm] = useState({
    heroTitle: config?.heroTitle || '',
    heroSubtitle: config?.heroSubtitle || '',
    aboutText: config?.aboutText || '',
  });

  useEffect(() => {
    if (config) setForm({ heroTitle: config.heroTitle, heroSubtitle: config.heroSubtitle, aboutText: config.aboutText });
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await updateConfig(form); onMessage('Configuration updated!'); onRefresh(); }
    catch { onMessage('Failed to update configuration.', 'error'); }
  };

  return (
    <div>
      <h2 className="font-heading text-xl text-dark-wood tracking-wider mb-6 flex items-center gap-2">
        <span>⚙️</span> Site Configuration
      </h2>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 border-gold-light/10!">
        <div>
          <label className="block text-iron-light text-xs font-heading tracking-wider uppercase mb-2">Hero Title</label>
          <input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })} className="admin-input" />
          <p className="text-iron-light/30 text-[10px] mt-1">The last word will be highlighted with a gradient effect</p>
        </div>
        <div>
          <label className="block text-iron-light text-xs font-heading tracking-wider uppercase mb-2">Hero Subtitle</label>
          <textarea value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} rows={2} className="admin-input" />
          <p className="text-iron-light/30 text-[10px] mt-1">Displayed with a typewriter animation effect</p>
        </div>
        <div>
          <label className="block text-iron-light text-xs font-heading tracking-wider uppercase mb-2">About Text</label>
          <textarea value={form.aboutText} onChange={e => setForm({ ...form, aboutText: e.target.value })} rows={5} className="admin-input" />
          <p className="text-iron-light/30 text-[10px] mt-1">Displayed in the About section. Use line breaks to create paragraphs.</p>
        </div>
        <button type="submit" className="medieval-btn text-[11px] !py-2">
          Save Configuration
        </button>
      </form>
    </div>
  );
}

// ─── Socials Panel ─────────────────────────────────────────────
function SocialsPanel({ socials, onRefresh, onMessage }: { socials: SocialLink[]; onRefresh: () => void; onMessage: (msg: string, type?: 'success' | 'error') => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState({ platform: '', url: '', icon: '🔗', order: 0 });

  const resetForm = () => { setForm({ platform: '', url: '', icon: '🔗', order: 0 }); setEditing(null); setShowForm(false); };

  const startEdit = (social: SocialLink) => {
    setForm({ platform: social.platform, url: social.url, icon: social.icon, order: social.order });
    setEditing(social);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateSocial(editing.id, form); onMessage('Link updated!'); }
      else { await createSocial(form); onMessage('Link added!'); }
      resetForm(); onRefresh();
    } catch { onMessage('Failed to save link.', 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this link?')) return;
    try { await deleteSocial(id); onMessage('Link removed.'); onRefresh(); }
    catch { onMessage('Failed to remove link.', 'error'); }
  };

  return (
    <div>
      <PanelHeader icon="🐦" title="Social Links" onAdd={() => { resetForm(); setShowForm(!showForm); }} showForm={showForm} />

      {showForm && (
        <FormCard onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} placeholder="Platform (e.g. GitHub)" required className="admin-input" />
            <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" required className="admin-input" />
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Emoji icon" className="admin-input" />
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="admin-input" />
          </div>
          <button type="submit" className="medieval-btn text-[11px] !py-2">{editing ? 'Update' : 'Add Link'}</button>
        </FormCard>
      )}

      <div className="space-y-2">
        {socials.map(social => (
          <ItemCard key={social.id} onEdit={() => startEdit(social)} onDelete={() => handleDelete(social.id)}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{social.icon}</span>
              <div>
                <h3 className="text-dark-wood font-heading text-sm font-bold">{social.platform}</h3>
                <p className="text-iron-light/40 text-xs truncate max-w-xs">{social.url}</p>
              </div>
            </div>
          </ItemCard>
        ))}
        {socials.length === 0 && <p className="text-iron-light/40 text-sm text-center py-12">No social links yet.</p>}
      </div>
    </div>
  );
}

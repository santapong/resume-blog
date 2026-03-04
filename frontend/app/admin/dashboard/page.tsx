"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    getExperiences, createExperience, updateExperience, deleteExperience,
    getSkills, createSkill, updateSkill, deleteSkill,
    getProjects, createProject, updateProject, deleteProject,
    uploadResume, getResume, getConfig, updateConfig,
    getSocials, createSocial, updateSocial, deleteSocial,
    type Experience, type Skill, type Project, type ResumeInfo, type SiteConfig, type SocialLink,
} from '@/app/lib/api';

type Tab = 'experiences' | 'skills' | 'projects' | 'resume' | 'config' | 'socials';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('experiences');
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [resume, setResume] = useState<ResumeInfo | null>(null);
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [socials, setSocials] = useState<SocialLink[]>([]);
    const [message, setMessage] = useState('');

    // Auth check
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin');
        }
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
            setMessage('Failed to load data.');
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        router.push('/admin');
    };

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: 'experiences', label: 'Chronicles', icon: '📜' },
        { key: 'skills', label: 'Arsenal', icon: '🛡️' },
        { key: 'projects', label: 'Conquests', icon: '⚔️' },
        { key: 'resume', label: 'Decree', icon: '📄' },
        { key: 'socials', label: 'Ravens', icon: '🐦' },
        { key: 'config', label: 'Config', icon: '⚙️' },
    ];

    return (
        <main className="min-h-screen bg-dark-wood">
            {/* Top Bar */}
            <div className="bg-dark-wood-light border-b border-gold/30 px-6 py-3 flex justify-between items-center">
                <h1 className="font-[family-name:var(--font-heading)] text-gold text-lg tracking-wider">
                    ⚜️ Admin Chamber
                </h1>
                <button onClick={handleLogout} className="text-parchment/60 hover:text-crimson text-sm transition-colors">
                    🚪 Leave Castle
                </button>
            </div>

            {/* Message Banner */}
            {message && (
                <div className="bg-gold/20 border-b border-gold/30 px-6 py-2 text-center text-dark-wood text-sm">
                    {message}
                </div>
            )}

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-56 min-h-[calc(100vh-52px)] bg-dark-wood-light border-r border-gold/20 p-4">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2 text-sm transition-colors ${activeTab === tab.key
                                    ? 'bg-gold/20 text-gold border border-gold/30'
                                    : 'text-parchment/60 hover:text-parchment hover:bg-white/5'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span className="font-[family-name:var(--font-heading)] tracking-wider uppercase text-xs">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 p-6">
                    {activeTab === 'experiences' && (
                        <ExperiencesPanel
                            experiences={experiences}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                    {activeTab === 'skills' && (
                        <SkillsPanel
                            skills={skills}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                    {activeTab === 'projects' && (
                        <ProjectsPanel
                            projects={projects}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                    {activeTab === 'resume' && (
                        <ResumePanel
                            resume={resume}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                    {activeTab === 'socials' && (
                        <SocialsPanel
                            socials={socials}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                    {activeTab === 'config' && (
                        <ConfigPanel
                            config={config}
                            onRefresh={loadData}
                            onMessage={showMessage}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}

// ─── Experiences Panel ──────────────────────────────────────────
function ExperiencesPanel({
    experiences,
    onRefresh,
    onMessage,
}: {
    experiences: Experience[];
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Experience | null>(null);
    const [form, setForm] = useState({ title: '', company: '', period: '', description: '', technologies: '', order: 0 });

    const resetForm = () => {
        setForm({ title: '', company: '', period: '', description: '', technologies: '', order: 0 });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (exp: Experience) => {
        setForm({
            title: exp.title,
            company: exp.company,
            period: exp.period,
            description: exp.description,
            technologies: exp.technologies.join(', '),
            order: exp.order,
        });
        setEditing(exp);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        };
        try {
            if (editing) {
                await updateExperience(editing.id, data);
                onMessage('Chronicle updated!');
            } else {
                await createExperience(data);
                onMessage('Chronicle added!');
            }
            resetForm();
            onRefresh();
        } catch {
            onMessage('Failed to save chronicle.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Remove this chronicle?')) return;
        try {
            await deleteExperience(id);
            onMessage('Chronicle removed.');
            onRefresh();
        } catch {
            onMessage('Failed to remove chronicle.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-[family-name:var(--font-heading)] text-xl text-gold tracking-wider">
                    📜 Chronicles of Service
                </h2>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="medieval-btn text-xs !py-2">
                    {showForm ? '✕ Cancel' : '+ Add Chronicle'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="scroll-card p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} placeholder="Period (e.g. 2024 - Present)" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="Technologies (comma-separated)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} required
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order"
                        className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm w-24 focus:outline-none focus:border-gold" />
                    <button type="submit" className="medieval-btn text-xs !py-2">
                        {editing ? '✏️ Update' : '📜 Create'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {experiences.map(exp => (
                    <div key={exp.id} className="bg-dark-wood-light border border-gold/20 rounded p-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-gold font-[family-name:var(--font-heading)] text-sm font-bold">{exp.title}</h3>
                            <p className="text-parchment/60 text-xs">{exp.company} · {exp.period}</p>
                            <p className="text-parchment/40 text-xs mt-1 line-clamp-2">{exp.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => startEdit(exp)} className="text-gold/70 hover:text-gold text-xs">✏️</button>
                            <button onClick={() => handleDelete(exp.id)} className="text-crimson/70 hover:text-crimson text-xs">🗑️</button>
                        </div>
                    </div>
                ))}
                {experiences.length === 0 && <p className="text-parchment/40 text-sm text-center py-8">No chronicles yet.</p>}
            </div>
        </div>
    );
}

// ─── Skills Panel ───────────────────────────────────────────────
function SkillsPanel({
    skills,
    onRefresh,
    onMessage,
}: {
    skills: Skill[];
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Skill | null>(null);
    const [form, setForm] = useState({ category: '', items: '', order: 0 });

    const resetForm = () => {
        setForm({ category: '', items: '', order: 0 });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (skill: Skill) => {
        setForm({ category: skill.category, items: skill.items.join(', '), order: skill.order });
        setEditing(skill);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            items: form.items.split(',').map(t => t.trim()).filter(Boolean),
        };
        try {
            if (editing) {
                await updateSkill(editing.id, data);
                onMessage('Arsenal updated!');
            } else {
                await createSkill(data);
                onMessage('Arsenal added!');
            }
            resetForm();
            onRefresh();
        } catch {
            onMessage('Failed to save arsenal.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Remove this skill category?')) return;
        try {
            await deleteSkill(id);
            onMessage('Skill removed.');
            onRefresh();
        } catch {
            onMessage('Failed to remove skill.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-[family-name:var(--font-heading)] text-xl text-gold tracking-wider">
                    🛡️ Arsenal Management
                </h2>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="medieval-btn text-xs !py-2">
                    {showForm ? '✕ Cancel' : '+ Add Category'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="scroll-card p-6 mb-6 space-y-4">
                    <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category name" required
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                    <textarea value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} placeholder="Skills (comma-separated)" rows={2} required
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order"
                        className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm w-24 focus:outline-none focus:border-gold" />
                    <button type="submit" className="medieval-btn text-xs !py-2">
                        {editing ? '✏️ Update' : '🛡️ Create'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-dark-wood-light border border-gold/20 rounded p-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-gold font-[family-name:var(--font-heading)] text-sm font-bold">{skill.category}</h3>
                            <p className="text-parchment/40 text-xs mt-1">{skill.items.join(', ')}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => startEdit(skill)} className="text-gold/70 hover:text-gold text-xs">✏️</button>
                            <button onClick={() => handleDelete(skill.id)} className="text-crimson/70 hover:text-crimson text-xs">🗑️</button>
                        </div>
                    </div>
                ))}
                {skills.length === 0 && <p className="text-parchment/40 text-sm text-center py-8">No skills yet.</p>}
            </div>
        </div>
    );
}

// ─── Projects Panel ─────────────────────────────────────────────
function ProjectsPanel({
    projects,
    onRefresh,
    onMessage,
}: {
    projects: Project[];
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState({
        title: '', description: '', imageUrl: '', liveUrl: '', repoUrl: '',
        technologies: '', featured: false, order: 0,
    });

    const resetForm = () => {
        setForm({ title: '', description: '', imageUrl: '', liveUrl: '', repoUrl: '', technologies: '', featured: false, order: 0 });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (proj: Project) => {
        setForm({
            title: proj.title,
            description: proj.description,
            imageUrl: proj.imageUrl || '',
            liveUrl: proj.liveUrl || '',
            repoUrl: proj.repoUrl || '',
            technologies: proj.technologies.join(', '),
            featured: proj.featured,
            order: proj.order,
        });
        setEditing(proj);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...form,
            technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
            imageUrl: form.imageUrl || null,
            liveUrl: form.liveUrl || null,
            repoUrl: form.repoUrl || null,
        };
        try {
            if (editing) {
                await updateProject(editing.id, data);
                onMessage('Conquest updated!');
            } else {
                await createProject(data);
                onMessage('Conquest added!');
            }
            resetForm();
            onRefresh();
        } catch {
            onMessage('Failed to save conquest.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Remove this conquest?')) return;
        try {
            await deleteProject(id);
            onMessage('Conquest removed.');
            onRefresh();
        } catch {
            onMessage('Failed to remove conquest.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-[family-name:var(--font-heading)] text-xl text-gold tracking-wider">
                    ⚔️ Conquest Gallery
                </h2>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="medieval-btn text-xs !py-2">
                    {showForm ? '✕ Cancel' : '+ Add Conquest'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="scroll-card p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="Technologies (comma-separated)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL (optional)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="Live URL (optional)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} placeholder="Repository URL (optional)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm w-24 focus:outline-none focus:border-gold" />
                    </div>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} required
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                    <label className="flex items-center gap-2 text-dark-wood text-sm cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
                        ⭐ Featured Conquest
                    </label>
                    <button type="submit" className="medieval-btn text-xs !py-2">
                        {editing ? '✏️ Update' : '⚔️ Create'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {projects.map(proj => (
                    <div key={proj.id} className="bg-dark-wood-light border border-gold/20 rounded p-4 flex justify-between items-start">
                        <div>
                            <h3 className="text-gold font-[family-name:var(--font-heading)] text-sm font-bold">
                                {proj.featured && '⭐ '}{proj.title}
                            </h3>
                            <p className="text-parchment/40 text-xs mt-1 line-clamp-2">{proj.description}</p>
                            <p className="text-parchment/30 text-xs mt-1">{proj.technologies.join(', ')}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => startEdit(proj)} className="text-gold/70 hover:text-gold text-xs">✏️</button>
                            <button onClick={() => handleDelete(proj.id)} className="text-crimson/70 hover:text-crimson text-xs">🗑️</button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && <p className="text-parchment/40 text-sm text-center py-8">No conquests yet.</p>}
            </div>
        </div>
    );
}

// ─── Resume Panel ───────────────────────────────────────────────
function ResumePanel({
    resume,
    onRefresh,
    onMessage,
}: {
    resume: ResumeInfo | null;
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            await uploadResume(file);
            onMessage('Royal decree uploaded!');
            onRefresh();
        } catch {
            onMessage('Failed to upload decree.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-gold tracking-wider mb-6">
                📄 Royal Decree (Resume)
            </h2>

            <div className="scroll-card p-6 space-y-6">
                {resume ? (
                    <div className="space-y-3">
                        <p className="text-dark-wood">
                            <span className="font-bold">Current:</span> {resume.filename}
                        </p>
                        <p className="text-iron text-sm">
                            Uploaded: {new Date(resume.uploadedAt).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <p className="text-iron">No decree uploaded yet.</p>
                )}

                <div>
                    <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                        Upload New Decree (PDF)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-iron file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gold file:text-dark-wood file:font-[family-name:var(--font-heading)] file:text-xs file:tracking-wider file:uppercase file:cursor-pointer hover:file:bg-gold-light"
                    />
                    {uploading && <p className="text-gold text-sm mt-2">⏳ Inscribing the decree...</p>}
                </div>
            </div>
        </div>
    );
}

// ─── Config Panel ───────────────────────────────────────────────
function ConfigPanel({
    config,
    onRefresh,
    onMessage,
}: {
    config: SiteConfig | null;
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [form, setForm] = useState({
        heroTitle: config?.heroTitle || '',
        heroSubtitle: config?.heroSubtitle || '',
        aboutText: config?.aboutText || '',
    });

    useEffect(() => {
        if (config) {
            setForm({
                heroTitle: config.heroTitle,
                heroSubtitle: config.heroSubtitle,
                aboutText: config.aboutText,
            });
        }
    }, [config]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateConfig(form);
            onMessage('Configuration updated!');
            onRefresh();
        } catch {
            onMessage('Failed to update configuration.');
        }
    };

    return (
        <div>
            <h2 className="font-[family-name:var(--font-heading)] text-xl text-gold tracking-wider mb-6">
                ⚙️ Castle Configuration
            </h2>

            <form onSubmit={handleSubmit} className="scroll-card p-6 space-y-4">
                <div>
                    <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                        Hero Title
                    </label>
                    <input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                    <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                        Hero Subtitle
                    </label>
                    <textarea value={form.heroSubtitle} onChange={e => setForm({ ...form, heroSubtitle: e.target.value })} rows={2}
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                    <label className="block font-[family-name:var(--font-heading)] text-dark-wood text-sm tracking-wider uppercase mb-2">
                        About Text
                    </label>
                    <textarea value={form.aboutText} onChange={e => setForm({ ...form, aboutText: e.target.value })} rows={4}
                        className="w-full px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                </div>
                <button type="submit" className="medieval-btn text-xs !py-2">
                    💾 Save Configuration
                </button>
            </form>
        </div>
    );
}

// ─── Socials Panel ──────────────────────────────────────────────
function SocialsPanel({
    socials,
    onRefresh,
    onMessage,
}: {
    socials: SocialLink[];
    onRefresh: () => void;
    onMessage: (msg: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<SocialLink | null>(null);
    const [form, setForm] = useState({ platform: '', url: '', icon: '🔗', order: 0 });

    const resetForm = () => {
        setForm({ platform: '', url: '', icon: '🔗', order: 0 });
        setEditing(null);
        setShowForm(false);
    };

    const startEdit = (social: SocialLink) => {
        setForm({ platform: social.platform, url: social.url, icon: social.icon, order: social.order });
        setEditing(social);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateSocial(editing.id, form);
                onMessage('Raven updated!');
            } else {
                await createSocial(form);
                onMessage('Raven dispatched!');
            }
            resetForm();
            onRefresh();
        } catch {
            onMessage('Failed to manage raven.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Release this raven?')) return;
        try {
            await deleteSocial(id);
            onMessage('Raven released.');
            onRefresh();
        } catch {
            onMessage('Failed to release raven.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl text-gold tracking-wider">
                    🐦 Ravens (Social Links)
                </h2>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="medieval-btn text-xs py-2!">
                    {showForm ? '✕ Cancel' : '+ Add Raven'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="scroll-card p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} placeholder="Platform (e.g. GitHub, LinkedIn)" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL (e.g. https://github.com/user)" required
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm focus:outline-none focus:border-gold" />
                        <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Icon emoji (e.g. 🐙)"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm w-24 focus:outline-none focus:border-gold" />
                        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} placeholder="Order"
                            className="px-3 py-2 bg-parchment-light border border-gold/40 rounded text-dark-wood text-sm w-24 focus:outline-none focus:border-gold" />
                    </div>
                    <button type="submit" className="medieval-btn text-xs py-2!">
                        {editing ? '✏️ Update' : '🐦 Dispatch Raven'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {socials.map(social => (
                    <div key={social.id} className="bg-dark-wood-light border border-gold/20 rounded p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{social.icon}</span>
                            <div>
                                <h3 className="text-gold font-heading text-sm font-bold">{social.platform}</h3>
                                <p className="text-parchment/40 text-xs truncate max-w-xs">{social.url}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => startEdit(social)} className="text-gold/70 hover:text-gold text-xs">✏️</button>
                            <button onClick={() => handleDelete(social.id)} className="text-crimson/70 hover:text-crimson text-xs">🗑️</button>
                        </div>
                    </div>
                ))}
                {socials.length === 0 && <p className="text-parchment/40 text-sm text-center py-8">No ravens yet. Add social links to appear in the footer and contact section.</p>}
            </div>
        </div>
    );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001/api';

// ─── Types ───────────────────────────────────────────────────────
export interface Experience {
    id: number;
    title: string;
    company: string;
    period: string;
    description: string;
    technologies: string[];
    order: number;
    createdAt: string;
}

export interface Skill {
    id: number;
    category: string;
    items: string[];
    order: number;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    liveUrl: string | null;
    repoUrl: string | null;
    technologies: string[];
    featured: boolean;
    order: number;
    createdAt: string;
}

export interface ResumeInfo {
    id: number;
    filename: string;
    isActive: boolean;
    uploadedAt: string;
    url: string;
}

export interface SectionLayout {
    id: string;
    visible: boolean;
}

export interface SiteConfig {
    id: number;
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    sectionLayout: string;
}

// ─── Auth ────────────────────────────────────────────────────────
export async function login(username: string, password: string): Promise<{ token: string }> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
}

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// ─── Experiences ─────────────────────────────────────────────────
export async function getExperiences(): Promise<Experience[]> {
    const res = await fetch(`${API_URL}/experiences`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function createExperience(data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_URL}/experiences`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
}

export async function updateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
}

export async function deleteExperience(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
}

// ─── Skills ──────────────────────────────────────────────────────
export async function getSkills(): Promise<Skill[]> {
    const res = await fetch(`${API_URL}/skills`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function createSkill(data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
}

export async function updateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
}

export async function deleteSkill(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete skill');
}

// ─── Projects ────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
}

export async function deleteProject(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete project');
}

// ─── Resume ──────────────────────────────────────────────────────
export async function getResume(): Promise<ResumeInfo | null> {
    const res = await fetch(`${API_URL}/resume`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

export async function uploadResume(file: File): Promise<ResumeInfo> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch(`${API_URL}/resume`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload resume');
    return res.json();
}

// ─── Config ──────────────────────────────────────────────────────
export async function getConfig(): Promise<SiteConfig> {
    const res = await fetch(`${API_URL}/config`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
}

export async function updateConfig(data: Partial<SiteConfig>): Promise<SiteConfig> {
    const res = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
}

// ─── Social Links ────────────────────────────────────────────────
export interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    order: number;
}

export async function getSocials(): Promise<SocialLink[]> {
    const res = await fetch(`${API_URL}/socials`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function createSocial(data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_URL}/socials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create social link');
    return res.json();
}

export async function updateSocial(id: number, data: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetch(`${API_URL}/socials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update social link');
    return res.json();
}

export async function deleteSocial(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/socials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete social link');
}

// ─── Blog Posts ──────────────────────────────────────────────────
export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    tags: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getPosts(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    const res = await fetch(`${API_URL}/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

import api from './api';

export interface ProjectCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface ProjectTag {
  id: string | number;
  name: string;
  slug: string;
  color?: string;
  count?: number;
}

const DEFAULT_CATEGORIES: ProjectCategory[] = [
  { id: 1, name: 'Plataformas Web', slug: 'plataformas-web', description: 'Portais corporativos, sistemas web e PWAs de alta performance' },
  { id: 2, name: 'Aplicações Mobile', slug: 'aplicacoes-mobile', description: 'Aplicativos nativos e híbridos para iOS e Android' },
  { id: 3, name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'Infraestrutura escalável, microsserviços e automação de deploy' },
  { id: 4, name: 'Inteligência Artificial', slug: 'inteligencia-artificial', description: 'Agentes autônomos, LLMs e visão computacional' },
  { id: 5, name: 'E-commerce & SaaS', slug: 'ecommerce-saas', description: 'Soluções transacionais, pagamentos e plataformas de recorrência' }
];

const DEFAULT_TAGS: ProjectTag[] = [
  { id: 1, name: 'React', slug: 'react', color: '#38bdf8' },
  { id: 2, name: 'TypeScript', slug: 'typescript', color: '#3b82f6' },
  { id: 3, name: 'Node.js', slug: 'nodejs', color: '#22c55e' },
  { id: 4, name: 'Next.js', slug: 'nextjs', color: '#ffffff' },
  { id: 5, name: 'Python', slug: 'python', color: '#eab308' },
  { id: 6, name: 'AWS', slug: 'aws', color: '#f97316' },
  { id: 7, name: 'TailwindCSS', slug: 'tailwindcss', color: '#06b6d4' },
  { id: 8, name: 'Docker', slug: 'docker', color: '#0ea5e9' },
  { id: 9, name: 'PostgreSQL', slug: 'postgresql', color: '#6366f1' },
  { id: 10, name: 'GraphQL', slug: 'graphql', color: '#ec4899' },
  { id: 11, name: 'UI/UX', slug: 'ui-ux', color: '#a855f7' },
  { id: 12, name: 'IA / LLMs', slug: 'ia-llms', color: '#8b5cf6' },
  { id: 13, name: 'Mobile', slug: 'mobile', color: '#10b981' },
  { id: 14, name: 'SaaS', slug: 'saas', color: '#14b8a6' }
];

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// ================= CATEGORIAS =================

export async function fetchProjectCategories(): Promise<ProjectCategory[]> {
  try {
    const res = await api.get('/projects/categories');
    const data = res.data.returnObj || res.data;
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem('ksi_project_categories', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // API endpoint fallback
  }

  const cached = localStorage.getItem('ksi_project_categories');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  localStorage.setItem('ksi_project_categories', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
}

export async function saveProjectCategory(category: { id?: string | number; name: string; slug?: string; description?: string }): Promise<ProjectCategory[]> {
  const current = await fetchProjectCategories();
  const slug = category.slug || slugify(category.name);
  
  let updated: ProjectCategory[];
  if (category.id) {
    updated = current.map(c => c.id === category.id ? { ...c, ...category, slug } : c);
  } else {
    const newCat: ProjectCategory = {
      id: Date.now(),
      name: category.name,
      slug,
      description: category.description || ''
    };
    updated = [...current, newCat];
  }

  localStorage.setItem('ksi_project_categories', JSON.stringify(updated));

  try {
    if (category.id) {
      await api.put(`/projects/categories/${category.id}`, { ...category, slug });
    } else {
      await api.post('/projects/categories', { ...category, slug });
    }
  } catch (err) {
    // Backend fallback
  }

  return updated;
}

export async function deleteProjectCategory(id: string | number): Promise<ProjectCategory[]> {
  const current = await fetchProjectCategories();
  const updated = current.filter(c => c.id !== id);
  localStorage.setItem('ksi_project_categories', JSON.stringify(updated));

  try {
    await api.delete(`/projects/categories/${id}`);
  } catch (err) {
    // Backend fallback
  }

  return updated;
}

// ================= TAGS =================

export async function fetchProjectTags(): Promise<ProjectTag[]> {
  try {
    const res = await api.get('/projects/tags');
    const data = res.data.returnObj || res.data;
    if (Array.isArray(data) && data.length > 0) {
      localStorage.setItem('ksi_project_tags', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // Backend fallback
  }

  const cached = localStorage.getItem('ksi_project_tags');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  localStorage.setItem('ksi_project_tags', JSON.stringify(DEFAULT_TAGS));
  return DEFAULT_TAGS;
}

export async function saveProjectTag(tag: { id?: string | number; name: string; slug?: string; color?: string }): Promise<ProjectTag[]> {
  const current = await fetchProjectTags();
  const slug = tag.slug || slugify(tag.name);
  
  let updated: ProjectTag[];
  if (tag.id) {
    updated = current.map(t => t.id === tag.id ? { ...t, ...tag, slug } : t);
  } else {
    const newTag: ProjectTag = {
      id: Date.now(),
      name: tag.name,
      slug,
      color: tag.color || '#38bdf8'
    };
    updated = [...current, newTag];
  }

  localStorage.setItem('ksi_project_tags', JSON.stringify(updated));

  try {
    if (tag.id) {
      await api.put(`/projects/tags/${tag.id}`, { ...tag, slug });
    } else {
      await api.post('/projects/tags', { ...tag, slug });
    }
  } catch (err) {
    // Backend fallback
  }

  return updated;
}

export async function deleteProjectTag(id: string | number): Promise<ProjectTag[]> {
  const current = await fetchProjectTags();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem('ksi_project_tags', JSON.stringify(updated));

  try {
    await api.delete(`/projects/tags/${id}`);
  } catch (err) {
    // Backend fallback
  }

  return updated;
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Edit, Eye, EyeOff, FolderKanban, GripVertical, Plus, Search, Trash2 } from 'lucide-react';
import api from '../../services/api';
import type { Project } from '../../components/Portfolio';
import KsiLoader from '../../components/KsiLoader';

type AdminProject = Project & { published: boolean; displayOrder: number };

type SortableProjectRowProps = {
  project: AdminProject;
  dragDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function SortableProjectRow({ project, dragDisabled, onEdit, onDelete }: SortableProjectRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id, disabled: dragDisabled });
  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 220ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.82 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 2 : 0,
    background: isDragging ? 'rgba(20, 42, 76, 0.96)' : undefined,
    boxShadow: isDragging ? '0 16px 36px rgba(0, 0, 0, 0.38)' : undefined
  };

  return (
    <tr ref={setNodeRef} style={rowStyle}>
      <td style={{ paddingLeft: '18px', paddingRight: 0, width: '42px' }}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={dragDisabled}
          title={dragDisabled ? 'Limpe a busca para reordenar' : 'Arraste para reordenar'}
          aria-label={`Reordenar ${project.title}`}
          style={{ display: 'inline-flex', alignItems: 'center', padding: '6px', border: 0, background: 'transparent', color: dragDisabled ? 'var(--admin-text-dim)' : 'var(--admin-accent)', cursor: dragDisabled ? 'not-allowed' : 'grab', touchAction: 'none' }}
        >
          <GripVertical size={20} />
        </button>
      </td>
      <td style={{ paddingLeft: '12px', paddingRight: '16px', minWidth: '320px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '8px 0' }}>
          <div style={{ width: '150px', height: '92px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--admin-card-border)', background: 'rgba(0, 0, 0, 0.4)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)' }}>
            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} referrerPolicy="no-referrer" loading="lazy" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{project.title}</p>
            {project.description && <p style={{ margin: '4px 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>}
          </div>
        </div>
      </td>
      <td><span className="category-badge" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>{project.category}</span></td>
      <td><span className={`status-pill ${project.published ? 'publicado' : 'rascunho'}`}>{project.published ? <><Eye size={13} /> Publicado</> : <><EyeOff size={13} /> Oculto</>}</span></td>
      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
        <div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
          <button className="action-icon-btn edit" onClick={onEdit} title="Editar projeto"><Edit size={15} /></button>
          <button className="action-icon-btn delete" onClick={onDelete} title="Excluir projeto"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectsDashboard() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reordering, setReordering] = useState(false);
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const loadProjects = () => {
    setLoading(true);
    api.get('/projects/admin')
      .then((response) => setProjects(response.data.returnObj || response.data || []))
      .catch(() => alert('Não foi possível carregar os projetos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProjects(); }, []);

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const query = search.toLowerCase();
    return project.title.toLowerCase().includes(query) || project.category.toLowerCase().includes(query);
  }), [projects, search]);

  const handleDelete = async (project: AdminProject) => {
    if (!window.confirm(`Excluir o projeto “${project.title}”? A imagem enviada também será removida.`)) return;
    try {
      await api.delete(`/projects/${project.id}`);
      loadProjects();
    } catch {
      alert('Não foi possível excluir o projeto.');
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id || reordering) return;

    const fromIndex = projects.findIndex((project) => project.id === Number(active.id));
    const toIndex = projects.findIndex((project) => project.id === Number(over.id));
    if (fromIndex < 0 || toIndex < 0) return;

    const previousProjects = projects;
    const reorderedProjects = arrayMove(projects, fromIndex, toIndex);
    setProjects(reorderedProjects);
    setReordering(true);

    try {
      await api.put('/projects/admin/reorder', { ids: reorderedProjects.map((project) => project.id) });
    } catch {
      setProjects(previousProjects);
      alert('Não foi possível salvar a nova ordem dos projetos.');
    } finally {
      setReordering(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>Projetos <span style={{ color: 'var(--admin-accent)' }}>do Portfólio</span></h1>
          <p style={{ color: 'var(--admin-text-muted)', margin: '6px 0 0' }}>Arraste os projetos pela alça para definir a ordem exibida no site.</p>
        </div>
        <Link to="/admin/projetos/novo" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', border: 'none' }}><Plus size={18} /> Novo projeto</Link>
      </div>

      <div className="admin-card" style={{ padding: '18px 24px', marginBottom: '24px', position: 'relative', maxWidth: '460px' }}>
        <Search size={18} style={{ position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%)', color: 'var(--admin-text-dim)' }} />
        <input className="admin-input admin-search-input" placeholder="Buscar por projeto ou categoria..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <KsiLoader kicker="PORTFÓLIO" title="Carregando Projetos" message="Sincronizando os cases de sucesso e mídias..." theme="dark" minHeight="280px" /> : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <div className="table-responsive">
              <table className="admin-table">
                <thead><tr><th style={{ width: '42px', paddingLeft: '18px' }} aria-label="Reordenar" /><th>Projeto</th><th>Categoria</th><th>Status</th><th style={{ textAlign: 'right', paddingRight: '24px' }}>Ações</th></tr></thead>
                <SortableContext items={filteredProjects.map((project) => project.id)} strategy={verticalListSortingStrategy}>
                  <tbody>
                    {filteredProjects.map((project) => <SortableProjectRow key={project.id} project={project} dragDisabled={Boolean(search) || reordering} onEdit={() => navigate(`/admin/projetos/editar/${project.id}`)} onDelete={() => handleDelete(project)} />)}
                    {filteredProjects.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--admin-text-muted)' }}><FolderKanban size={42} style={{ opacity: 0.45, marginBottom: '12px' }} /><p>Nenhum projeto encontrado.</p></td></tr>}
                  </tbody>
                </SortableContext>
              </table>
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
}

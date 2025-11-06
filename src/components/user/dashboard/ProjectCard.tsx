import { Calendar, ChevronRight } from "lucide-react";
interface Project {
  id: string;
  projectName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ProjectCard: React.FC<{
  project: Project;
  onClick: () => void;
}> = ({ project, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-400"
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-semibold text-gray-900">{project.projectName}</h3>
      <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0" />
    </div>
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
      {project.description || 'No description provided'}
    </p>
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1 text-gray-500">
        <Calendar className="w-4 h-4" />
        {new Date(project.createdAt).toLocaleDateString('en-IN')}
      </span>
    </div>
  </div>
);
'use client'
import { useEffect, useState } from "react";
import { Plus, Loader2, CheckCircle2, Clock, X, Star, StarOff } from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  taskId: string;
  taskName: string;
  description: string | null;
  expectedHours: string;
  actualHours: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt: string | null;
  createdAt: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  totalStars?: number;
  reviewCount?: number;
}

interface ProjectDetails {
  project: Project;
  tasks: Task[];
  summary: {
    totalTasks: number;
    totalExpectedHours: string;
    totalActualHours: string;
    variance: string;
    variancePercentage: string;
  };
}

// Dynamic Star Rating Display Component
const DynamicStars: React.FC<{ count: number; color?: string }> = ({ count, color = "text-purple-500" }) => {
  const stars = [];
  const displayCount = Math.min(Math.max(count, 0), 5); // Clamp between 0-5
  
  for (let i = 0; i < displayCount; i++) {
    stars.push(
      <Star key={i} className={`${color} fill-current`} size={16} />
    );
  }
  
  // If no stars, show one empty star
  if (displayCount === 0) {
    return <Star className="text-gray-300" size={16} />;
  }
  
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export const ProjectTasksView: React.FC<{
  projectDetails: ProjectDetails;
  currentUserId: string;
  onBack: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}> = ({ projectDetails, currentUserId, onBack, onRefresh, isLoading }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);
  const [tasksWithStars, setTasksWithStars] = useState<Task[]>([]);
  const [totalProjectStars, setTotalProjectStars] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingStars, setLoadingStars] = useState(true);

  const { project, tasks } = projectDetails;
  const myTasks = tasksWithStars.filter(t => t.employeeId === currentUserId);

  // Fetch stars for all tasks
  useEffect(() => {
    const fetchStarsForAllTasks = async () => {
      setLoadingStars(true);
      try {
        const tasksWithStarsData = await Promise.all(
          tasks.map(async (task) => {
            try {
              const response = await fetch(`/api/reviews?taskId=${task.taskId}`);
              if (response.ok) {
                const data = await response.json();
                const totalStars = data.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
                return {
                  ...task,
                  totalStars,
                  reviewCount: data.reviews.length
                };
              }
            } catch (error) {
              console.error(`Error fetching stars for task ${task.taskId}:`, error);
            }
            return { ...task, totalStars: 0, reviewCount: 0 };
          })
        );

        setTasksWithStars(tasksWithStarsData);
        
        // Calculate total project stars
        const projectTotal = tasksWithStarsData.reduce((sum, task) => sum + (task.totalStars || 0), 0);
        const projectReviews = tasksWithStarsData.reduce((sum, task) => sum + (task.reviewCount || 0), 0);
        setTotalProjectStars(projectTotal);
        setTotalReviews(projectReviews);
      } catch (error) {
        console.error('Error fetching stars:', error);
      } finally {
        setLoadingStars(false);
      }
    };

    fetchStarsForAllTasks();
  }, [tasks]);

  // Filter tasks based on search
  useEffect(() => {
    if (taskSearchTerm) {
      const filtered = tasksWithStars.filter(task =>
        task.taskName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.employeeName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.employeeEmail.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
        task.status.toLowerCase().includes(taskSearchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasksWithStars);
    }
  }, [taskSearchTerm, tasksWithStars]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleOpenReviews = (task: Task) => {
    setSelectedTaskForReview(task);
  };

  if (isLoading || loadingStars) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2">
          ← Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={taskSearchTerm}
              onChange={(e) => setTaskSearchTerm(e.target.value)}
              placeholder="Search tasks, employees, or status..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
            <p className="text-gray-500 mt-1">{project.description || 'No description'}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">My Tasks</p>
          <p className="text-3xl font-bold text-gray-900">{myTasks.length}</p>
        </div>
       
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Actual Hours</p>
          <p className="text-3xl font-bold text-purple-600">
            {myTasks.reduce((sum, t) => sum + parseFloat(t.actualHours), 0).toFixed(1)}
          </p>
        </div>

        {/* Total Stars Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-yellow-800">Total Stars Received</p>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-yellow-600">{totalProjectStars}</p>
            <p className="text-sm text-yellow-700">stars</p>
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            From {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actual</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => {
                // Calculate average rating for star display
                const avgRating = task.reviewCount && task.reviewCount > 0 
                  ? Math.round((task.totalStars || 0) / task.reviewCount) 
                  : 0;

                return (
                  <tr key={task.taskId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{task.employeeName}</p>
                        <p className="text-sm text-gray-500">{task.employeeEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{task.taskName}</p>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-gray-700">{task.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {parseFloat(task.actualHours).toFixed(1)}h
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(task.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenReviews(task)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group"
                      >
                        <DynamicStars count={avgRating} color="text-purple-500 group-hover:text-purple-600" />
                        {/* <span>Reviews</span> */}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {taskSearchTerm ? 'No tasks found matching your search.' : 'No tasks yet for this project.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedTaskForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8 bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Reviews for {selectedTaskForReview.taskName}</h3>
              <button
                onClick={() => setSelectedTaskForReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Add your UserTaskReviewSection component here */}
            <p className="text-gray-500">Review section will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  );
};
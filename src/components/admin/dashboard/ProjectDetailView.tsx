import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Edit2, Loader2, TrendingDown, TrendingUp, X, Trash2, CheckSquare, Square, Star, MessageSquare } from "lucide-react";
import DownloadButton from '@/components/DownloadButton';
import SearchBox from '@/components/SearchBox';
import Navigation from "@/components/pages/Navbar";
import { exportSelectedTasksDetailedToExcel } from '@/utils/exportUtils';
import { TaskReviewSection } from "./TaskReviewSection";

// ==================== TYPES ====================
interface Project {
  id: string;
  projectName: string;
  description: string | null;
  createdBy: string;
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
  approvedAt: string ;
  createdAt: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
}

interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerType: 'admin' | 'employee';
  rating: number;
  feedback: string | null;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface EmployeeSummary {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  totalTasks: number;
  totalExpectedHours: number;
  totalActualHours: number;
  pendingTasks: number;
  approvedTasks: number;
  rejectedTasks: number;
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
  employees: EmployeeSummary[];
}

export const ProjectDetailView: React.FC<{
  projectDetails: ProjectDetails;
  onBack: () => void;
  isLoading: boolean;
}> = ({ projectDetails, onBack, isLoading }) => {

  const { project, tasks, summary, employees } = projectDetails;

  // ✅ Local State (tasks copy)
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState('');
  const [editedExpectedHours, setEditedExpectedHours] = useState('');
  const [editedStatus, setEditedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [editedDate, setEditedDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Search
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(allTasks);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeSummary[]>(employees);

  // Selection State
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // ✅ Review State - only selectedTaskForReview needed
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);

  
  // Filter tasks based on search
  useEffect(() => {
    if (taskSearchTerm) {
      const filtered = allTasks.filter(task =>
        task.taskName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.employeeName.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        task.employeeEmail.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
        task.status.toLowerCase().includes(taskSearchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(allTasks);
    }
  }, [taskSearchTerm, allTasks]);


  // Filter employees based on search
  useEffect(() => {
    if (employeeSearchTerm) {
      const filtered = employees.filter(employee =>
        employee.employeeName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.employeeEmail.toLowerCase().includes(employeeSearchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [employeeSearchTerm, employees]);


  // ==================== SELECTION HANDLERS ====================
  const handleToggleSelect = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredTasks.map(t => t.taskId));
    setSelectedTasks(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedTasks(new Set());
  };

  const isTaskSelected = (taskId: string) => {
    return selectedTasks.has(taskId);
  };

  const handleExportSelected = async () => {
    if (selectedTasks.size === 0) return;
    
    setIsExporting(true);
    try {
      exportSelectedTasksDetailedToExcel(
        projectDetails,
        selectedTasks,
        `project_${project.projectName}_selected_tasks`
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };


  // ==================== REVIEW HANDLERS ====================
  const handleOpenReviewSection = (task: Task) => {
    setSelectedTaskForReview(task);
  };

  const handleCloseReviewSection = () => {
    setSelectedTaskForReview(null);
  };


  // ==================== TASK HANDLERS ====================
  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.taskId);
    setEditedTaskName(task.taskName);
    setEditedExpectedHours(task.expectedHours);
    // ✅ Auto-approve if status is pending
    setEditedStatus(task.status === 'pending' ? 'approved' : task.status);
    setEditedDate(new Date(task.createdAt).toISOString().split('T')[0]);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTaskName('');
    setEditedExpectedHours('');
    setEditedDate('');
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editedTaskName.trim()) {
      alert('Task name cannot be empty');
      return;
    }

    const expectedHoursNum = parseFloat(editedExpectedHours);
    if (isNaN(expectedHoursNum) || expectedHoursNum < 0) {
      alert('Expected hours must be a valid positive number');
      return;
    }

    if (!editedDate) {
      alert('Please select a date');
      return;
    }

    // ✅ Validate date is not in future
    const selectedDate = new Date(editedDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
      alert('Cannot select a future date');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: editedTaskName.trim(),
          expectedHours: expectedHoursNum,
          status: editedStatus,
          createdAt: editedDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }

      setAllTasks(prev =>
        prev.map(t =>
          t.taskId === taskId
            ? {
                ...t,
                taskName: editedTaskName,
                expectedHours: editedExpectedHours,
                status: editedStatus,
                createdAt: editedDate,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );

      setFilteredTasks(prev =>
        prev.map(t =>
          t.taskId === taskId
            ? {
                ...t,
                taskName: editedTaskName,
                expectedHours: editedExpectedHours,
                status: editedStatus,
                createdAt: editedDate,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );

      setEditingTaskId(null);
      setEditedTaskName('');
      setEditedExpectedHours('');
      setEditedStatus('pending');
      setEditedDate('');

    } catch (error) {
      console.error('Error updating task:', error);
      alert(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    setDeletingTaskId(taskId);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      setAllTasks(prev => prev.filter(t => t.taskId !== taskId));
      setFilteredTasks(prev => prev.filter(t => t.taskId !== taskId));
      
      setSelectedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });

      alert('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };


  const varianceNum = parseFloat(summary.variance);
  const isOverBudget = varianceNum > 0;

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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isAdmin = false; // This will be determined by session in TaskReviewSection component

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex-1 max-w-md">
              <SearchBox
                value={taskSearchTerm}
                onChange={setTaskSearchTerm}
                placeholder="Search tasks, employees, or status..."
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <DownloadButton
                onDownload={handleExportSelected}
                isLoading={isExporting}
                disabled={selectedTasks.size === 0}
                variant="outline"
              >
                Export Selected ({selectedTasks.size})
              </DownloadButton>
            </div>
          </div>

          {filteredTasks.length > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {selectedTasks.size} of {filteredTasks.length} tasks selected for export
            </div>
          )}

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
              <p className="text-gray-500 mt-1">{project.description || 'No description'}</p>
            </div>
          </div>
        </div>


        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{summary.totalTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Expected Hours</p>
            <p className="text-3xl font-bold text-blue-600">{parseFloat(summary.totalExpectedHours).toFixed(1)}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Actual Hours</p>
            <p className="text-3xl font-bold text-purple-600">{parseFloat(summary.totalActualHours).toFixed(1)}</p>
          </div>
        </div>


        {/* TASK TABLE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll();
                        } else {
                          handleDeselectAll();
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Expected</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actual</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.taskId} 
                    className={`hover:bg-gray-50 transition-colors ${
                      isTaskSelected(task.taskId) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isTaskSelected(task.taskId)}
                        onChange={() => handleToggleSelect(task.taskId)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{task.employeeName}</p>
                        <p className="text-sm text-gray-500">{task.employeeEmail}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {editingTaskId === task.taskId ? (
                        <input
                          type="text"
                          value={editedTaskName}
                          onChange={(e) => setEditedTaskName(e.target.value)}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{task.taskName}</p>
                      )}
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-gray-700">{task.description || 'No description'}</p>
                    </td>

                    <td className="px-6 py-4">
                      {editingTaskId === task.taskId ? (
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={editedExpectedHours}
                          onChange={(e) => setEditedExpectedHours(e.target.value)}
                          className="w-24 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      ) : (
                        <span className="font-semibold text-gray-900">
                          {parseFloat(task.expectedHours).toFixed(1)}h
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {parseFloat(task.actualHours).toFixed(1)}h
                    </td>

                    <td className="px-6 py-4">
                      {editingTaskId === task.taskId ? (
                        <select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value as any)}
                          className="px-3 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                      )}
                    </td>

                    {/* <td className="px-6 py-4">
                      {editingTaskId === task.taskId ? (
                        <input
                          type="date"
                          value={editedDate}
                          onChange={(e) => setEditedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      ) : (
                        <span className="text-sm text-gray-600">
                          {new Date(task.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}

                    </td> */}

                    <td className="px-6 py-4"> 
                        {new Date(task.approvedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                    </td>

                    <td className="px-6 py-4">
                      {editingTaskId === task.taskId ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(task.taskId)}
                            disabled={isSaving}
                            className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50 flex items-center gap-1"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            Save
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="text-gray-600 hover:text-gray-700 font-medium disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(task)}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task.taskId)}
                            disabled={deletingTaskId === task.taskId}
                            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50"
                          >
                            {deletingTaskId === task.taskId ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>

                          {/* ✅ Review Button - Anyone can view reviews */}
                          <button
                            onClick={() => handleOpenReviewSection(task)}
                            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                          >
                            <Star className="w-4 h-4" />
                            Reviews
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks yet for this project.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ==================== REVIEW SECTION (Replaces Modal) ==================== */}
      {selectedTaskForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-50 rounded-lg shadow-xl max-w-3xl w-full my-8">
            <div className="p-4 bg-white border-b border-gray-200 sticky top-0 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Task Reviews</h2>
                <button
                  onClick={handleCloseReviewSection}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <TaskReviewSection
                taskId={selectedTaskForReview.taskId}
                taskName={selectedTaskForReview.taskName}
                employeeName={selectedTaskForReview.employeeName}
                employeeId={selectedTaskForReview.employeeId}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
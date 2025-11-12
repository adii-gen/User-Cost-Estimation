import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Edit2, Loader2, TrendingDown, TrendingUp, X, Trash2, CheckSquare, Square } from "lucide-react";
import DownloadButton from '@/components/DownloadButton';
import SearchBox from '@/components/SearchBox';
import Navigation from "@/components/pages/Navbar";
import { exportSelectedTasksDetailedToExcel } from '@/utils/exportUtils';  // ✅ NEW IMPORT


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
  approvedAt: string | null;
  createdAt: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Search
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(allTasks);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeSummary[]>(employees);

  // ==================== SELECTION STATE ====================
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  
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

  // ==================== ✅ UPDATED EXPORT HANDLER ====================
  const handleExportSelected = async () => {
    if (selectedTasks.size === 0) return;
    
    setIsExporting(true);
    try {
      // ✅ Use new selective export function with detailed info
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


  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.taskId);
    setEditedTaskName(task.taskName);
    setEditedExpectedHours(task.expectedHours);
    setEditedStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTaskName('');
    setEditedExpectedHours('');
  };

  // ✅ Save task updates WITHOUT full page reload
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

    setIsSaving(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskName: editedTaskName.trim(),
          expectedHours: expectedHoursNum,
          status: editedStatus,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }

      // ✅ Locally update state
      setAllTasks(prev =>
        prev.map(t =>
          t.taskId === taskId
            ? {
                ...t,
                taskName: editedTaskName,
                expectedHours: editedExpectedHours,
                status: editedStatus,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );

      // ensure filtered list synced
      setFilteredTasks(prev =>
        prev.map(t =>
          t.taskId === taskId
            ? {
                ...t,
                taskName: editedTaskName,
                expectedHours: editedExpectedHours,
                status: editedStatus,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );

      setEditingTaskId(null);
      setEditedTaskName('');
      setEditedExpectedHours('');
      setEditedStatus('pending');

    } catch (error) {
      console.error('Error updating task:', error);
      alert(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };


  // ✅ Delete task WITHOUT full page reload
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

      // ✅ Remove from local state
      setAllTasks(prev => prev.filter(t => t.taskId !== taskId));
      setFilteredTasks(prev => prev.filter(t => t.taskId !== taskId));
      
      // Remove from selection if selected
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

  return (
    <>
      {/* <Navigation/> */}
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
            
            {/* Select/Deselect & Export Buttons */}
            <div className="flex gap-2">
              {filteredTasks.length > 0 && (
                <>
                  {/* <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Select All
                  </button> */}
                  {/* <button
                    onClick={handleDeselectAll}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    disabled={selectedTasks.size === 0}
                  >
                    <Square className="w-4 h-4" />
                    Deselect All
                  </button> */}
                </>
              )}
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

          {/* Selection Counter */}
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


        {/* ==================  TASK TABLE  ================== */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Tasks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {/* Checkbox Column */}
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
                    {/* Checkbox Cell */}
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

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(task.createdAt).toLocaleDateString('en-IN', {
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
                            Confirm
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
    </>
  );
};
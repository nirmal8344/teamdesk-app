import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { PlusIcon } from '../components/icons/Icons';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import * as api from '../services/api';


const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colorClasses = {
    [TaskPriority.High]: 'bg-destructive/10 text-destructive',
    [TaskPriority.Medium]: 'bg-warning/10 text-warning',
    [TaskPriority.Low]: 'bg-success/10 text-success',
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses[priority]}`}>{priority}</span>;
};

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const colorClasses = {
    [TaskStatus.ToDo]: 'bg-muted text-muted-foreground',
    [TaskStatus.InProgress]: 'bg-secondary/10 text-secondary',
    [TaskStatus.Done]: 'bg-success/10 text-success',
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

type AddTaskData = Pick<Task, 'title' | 'dueDate'>;

const AddTaskForm: React.FC<{ onAddTask: (taskData: AddTaskData) => void, onClose: () => void }> = ({ onAddTask, onClose }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask({ title, dueDate });
        onClose();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Task Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Add Task</button>
            </div>
        </form>
    );
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const data = await api.getTasks();
            setTasks(data);
        } catch (err) {
            setError('Failed to fetch tasks.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (taskData: AddTaskData) => {
    try {
        const newTask = await api.createTask(taskData);
        setTasks(prev => [newTask, ...prev]);
    } catch (err) {
        setError('Failed to add task.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <tr><td colSpan={6} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>;
    }
    if (error) {
        return <tr><td colSpan={6} className="text-center py-8 text-destructive">{error}</td></tr>;
    }
    return tasks.map((task) => (
      <tr key={task.id} className="border-b border-border hover:bg-muted/50">
        <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
          {task.title}
        </th>
        <td className="px-6 py-4">
          <PriorityBadge priority={task.priority} />
        </td>
        <td className="px-6 py-4">
            <StatusBadge status={task.status} />
        </td>
        <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
            <td className="px-6 py-4">
              <div className="flex items-center space-x-2">
                  <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-7 h-7 rounded-full" />
                  <span>{task.assignedTo.name}</span>
              </div>
          </td>
        <td className="px-6 py-4">{task.relatedTo?.name || 'N/A'}</td>
      </tr>
    ));
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Tasks</h1>
        <button onClick={() => setModalOpen(true)} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Priority</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Due Date</th>
                <th scope="col" className="px-6 py-4 font-semibold">Assigned To</th>
                <th scope="col" className="px-6 py-4 font-semibold">Related To</th>
              </tr>
            </thead>
            <tbody>
              {renderContent()}
            </tbody>
          </table>
        </div>
      </Card>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Task">
            <AddTaskForm onAddTask={handleAddTask} onClose={() => setModalOpen(false)} />
        </Modal>
    </div>
  );
};

export default Tasks;

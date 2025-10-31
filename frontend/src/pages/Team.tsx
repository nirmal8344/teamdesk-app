import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { PlusIcon, GridIcon, ListIcon } from '../components/icons/Icons';
import { User } from '../types';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import * as api from '../services/api';


interface MemberFormProps {
    onSave: (userData: Omit<User, 'id'>) => void;
    onClose: () => void;
    memberToEdit?: User | null;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSave, onClose, memberToEdit }) => {
    const [formData, setFormData] = useState({ 
        name: memberToEdit?.name || '', 
        email: memberToEdit?.email || '' 
    });
    const [avatar, setAvatar] = useState<string | undefined>(memberToEdit?.avatar);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, avatar: avatar || '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload onImageSelect={setAvatar} currentImage={avatar} />
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">
                    {memberToEdit ? 'Save Changes' : 'Invite Member'}
                </button>
            </div>
        </form>
    );
};


const Team: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const data = await api.getUsers();
                setUsers(data);
            } catch (err) {
                setError('Failed to fetch team members.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleOpenAddModal = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserToEdit(null);
    };

    const handleSaveMember = async (userData: Omit<User, 'id'>) => {
        try {
            if (userToEdit) {
                const updatedUser = await api.updateUser(userToEdit.id, userData);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            } else {
                const newUser = await api.createUser(userData);
                setUsers(prev => [newUser, ...prev]);
            }
            handleCloseModal();
        } catch (err) {
            setError(userToEdit ? 'Failed to update member.' : 'Failed to invite member.');
        }
    };
    
    const renderGridContent = () => {
        if (isLoading) return Array.from({length: 4}).map((_, i) => <Card key={i} className="animate-pulse h-64 bg-muted" />);
        if (error) return <p className="col-span-full text-center text-destructive">{error}</p>;
        return users.map(user => (
            <Card key={user.id} className="text-center flex flex-col items-center">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4 object-cover" />
                <h3 className="text-lg font-semibold text-foreground font-display">{user.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 break-all">{user.email}</p>
                <button onClick={() => handleOpenEditModal(user)} className="w-full bg-primary/10 text-primary font-semibold py-2 px-4 rounded-xl hover:bg-primary/20 transition">
                    Manage
                </button>
            </Card>
        ));
    };
    
    const renderListContent = () => {
        if (isLoading) return <tr><td colSpan={3} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>;
        if (error) return <tr><td colSpan={3} className="text-center py-8 text-destructive">{error}</td></tr>;
        return users.map(user => (
            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full"/>
                        <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenEditModal(user)} className="font-medium text-primary hover:text-secondary">Manage</button>
                </td>
            </tr>
        ));
    };

  return (
    <div>
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-display text-foreground">Users & Team</h1>
            <div className="flex items-center space-x-2">
                 <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-card shadow-sm' : ''}`}> <GridIcon className="w-5 h-5" /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-card shadow-sm' : ''}`}> <ListIcon className="w-5 h-5" /></button>
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center bg-primary text-primary-foreground px-5 py-2.5 font-semibold rounded-lg shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Invite Member
                </button>
            </div>
        </div>
        
        {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {renderGridContent()}
            </div>
        ) : (
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-muted-foreground">
                        <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">User</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderListContent()}
                        </tbody>
                    </table>
                </div>
            </Card>
        )}
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={userToEdit ? "Edit Team Member" : "Invite New Member"}>
        <MemberForm onSave={handleSaveMember} onClose={handleCloseModal} memberToEdit={userToEdit} />
      </Modal>
    </div>
  );
};

export default Team;

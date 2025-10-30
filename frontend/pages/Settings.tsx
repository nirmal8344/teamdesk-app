import React, { useState } from 'react';
import Card from '../components/common/Card';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import * as api from '../services/api';

interface SettingsProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUserUpdate }) => {
    const { theme, setTheme } = useTheme();
    const [formData, setFormData] = useState({ name: user.name, email: user.email });
    const [avatar, setAvatar] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveStatus('saving');
        try {
            const updatedUserData = {
                ...user,
                ...formData,
                avatar: avatar || user.avatar,
            };
            const updatedUser = await api.updateUser(user.id, updatedUserData);
            onUserUpdate(updatedUser);
            setSaveStatus('saved');
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    };

    const saveButtonText = () => {
        switch (saveStatus) {
            case 'saving': return 'Saving...';
            case 'saved': return 'Saved!';
            case 'error': return 'Error!';
            default: return 'Save Changes';
        }
    };

    const handleRevoke = () => {
        if (window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            alert("API Key revoked!");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold font-display text-foreground mb-8">Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold text-foreground font-display mb-2">Profile</h2>
                    <p className="text-muted-foreground">Manage your personal information and preferences.</p>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center space-x-6 pb-6 border-b border-border">
                                <img src={avatar || user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                                <div>
                                    <label htmlFor="avatar-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold rounded-xl hover:bg-opacity-90 transition">
                                        Change Avatar
                                    </label>
                                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
                                </div>
                            </div>
                            <div className="space-y-6 pt-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground" />
                                </div>
                                <div className="flex justify-end items-center pt-4">
                                    <button type="button" className="text-foreground font-semibold py-2 px-4 rounded-xl mr-4 hover:bg-accent">Cancel</button>
                                    <button type="submit" disabled={saveStatus !== 'idle'} className={`bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all duration-300 ${saveStatus === 'saved' ? 'bg-success' : ''} ${saveStatus === 'error' ? 'bg-destructive' : ''} ${saveStatus === 'saving' ? 'cursor-not-allowed opacity-70' : ''}`}>
                                        {saveButtonText()}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>

            <div className="border-t border-border my-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold text-foreground font-display mb-2">API Keys</h2>
                    <p className="text-muted-foreground">Manage your API keys for integrations like Gemini.</p>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-foreground">Gemini API Key</p>
                                <p className="text-sm text-muted-foreground">Used for all AI features</p>
                            </div>
                             <div className="flex items-center space-x-2">
                                <span className="text-success font-mono text-sm flex items-center"><div className="w-2 h-2 bg-success rounded-full mr-2"></div>Connected</span>
                                <button onClick={handleRevoke} className="bg-destructive/10 text-destructive px-4 py-2 text-sm font-semibold rounded-xl hover:bg-destructive/20 transition">Revoke</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="border-t border-border my-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold text-foreground font-display mb-2">Appearance</h2>
                    <p className="text-muted-foreground">Customize the look and feel of the application.</p>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-foreground">Interface Theme</p>
                                <p className="text-sm text-muted-foreground">Select your preferred theme.</p>
                            </div>
                            <div className="flex items-center space-x-2 bg-muted p-1 rounded-xl">
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                                        theme === 'light' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:bg-background/50'
                                    }`}
                                >
                                    Light
                                </button>
                                 <button 
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition ${
                                        theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent'
                                    }`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default Settings;

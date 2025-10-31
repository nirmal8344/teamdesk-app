import React, { useState, useEffect } from 'react';
import { Bookmark, Bookmark as BookmarkType } from '../types';
import { LeadsIcon, DealsIcon, ReportsIcon, PlusIcon, BookmarksIcon } from '../components/icons/Icons';
import Modal from '../components/common/Modal';
import * as api from '../services/api';

const iconMap: { [key in BookmarkType['type']]: React.ElementType } = {
    lead: LeadsIcon,
    deal: DealsIcon,
    report: ReportsIcon,
    other: BookmarksIcon,
};

const BookmarkItem: React.FC<{ bookmark: BookmarkType }> = ({ bookmark }) => {
    const Icon = bookmark.icon;
    return (
        <div className="flex items-center p-4 border border-border rounded-2xl hover:bg-accent transition-colors">
            <Icon className="w-6 h-6 mr-4 text-primary" />
            <div>
                <p className="font-semibold text-foreground">{bookmark.title}</p>
                <p className="text-sm text-muted-foreground">{bookmark.subtitle}</p>
            </div>
        </div>
    );
};

const AddBookmarkForm: React.FC<{ onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'icon'>) => void, onClose: () => void }> = ({ onAddBookmark, onClose }) => {
    const [formData, setFormData] = useState({ title: '', subtitle: '', type: 'other' as BookmarkType['type'] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as BookmarkType['type'] }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddBookmark(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Subtitle / Link</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                    <option value="lead">Lead</option>
                    <option value="deal">Deal</option>
                    <option value="report">Report</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Add</button>
            </div>
        </form>
    );
};


const Bookmarks: React.FC = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setIsLoading(true);
                const data = await api.getBookmarks();
                // Map the icon dynamically based on the type from the API
                const bookmarksWithIcons = data.map(bm => ({...bm, icon: iconMap[bm.type]}));
                setBookmarks(bookmarksWithIcons);
            } catch (err) {
                setError('Failed to load bookmarks.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookmarks();
    }, []);

    const handleAddBookmark = async (bookmarkData: Omit<BookmarkType, 'id' | 'icon'>) => {
        try {
            const newBookmark = await api.createBookmark(bookmarkData);
            setBookmarks(prev => [{ ...newBookmark, icon: iconMap[newBookmark.type] }, ...prev]);
        } catch (err) {
            setError('Failed to add bookmark.');
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-10"></div>;
        }
        if (error) {
            return <p className="text-center text-destructive">{error}</p>;
        }
        
        const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
            (acc[bookmark.type] = acc[bookmark.type] || []).push(bookmark);
            return acc;
        }, {} as Record<BookmarkType['type'], BookmarkType[]>);
    
        const groupTitles: Record<BookmarkType['type'], string> = {
            lead: "Favorite Leads",
            deal: "Pinned Deals",
            report: "Saved Reports",
            other: "Other Bookmarks"
        };
        
        return (Object.keys(groupedBookmarks) as Array<keyof typeof groupedBookmarks>).map(type => (
            groupedBookmarks[type]?.length > 0 && (
                <div key={type}>
                    <h2 className="text-xl font-semibold text-foreground font-display mb-4">{groupTitles[type]}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedBookmarks[type].map(bm => <BookmarkItem key={bm.id} bookmark={bm} />)}
                    </div>
                </div>
            )
        ));
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-display text-foreground">Bookmarks</h1>
                <button onClick={() => setModalOpen(true)} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Bookmark
                </button>
            </div>
            <div className="space-y-8">
                {renderContent()}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Bookmark">
                <AddBookmarkForm onAddBookmark={handleAddBookmark} onClose={() => setModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Bookmarks;

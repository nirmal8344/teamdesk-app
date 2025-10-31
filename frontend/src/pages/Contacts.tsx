import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { PlusIcon } from '../components/icons/Icons';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import * as api from '../services/api';

const Tag: React.FC<{ text: string }> = ({ text }) => (
  <span className="bg-muted text-muted-foreground px-3 py-1 text-xs font-medium rounded-full">{text}</span>
);

type ContactFormData = Omit<Contact, 'id'>;

interface ContactFormProps {
  onSave: (contactData: ContactFormData) => void;
  onClose: () => void;
  contactToEdit?: Contact | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSave, onClose, contactToEdit }) => {
    const [formData, setFormData] = useState({
        name: contactToEdit?.name || '',
        company: contactToEdit?.company || '',
        email: contactToEdit?.email || '',
        phone: contactToEdit?.phone || '',
        tags: contactToEdit?.tags.join(', ') || ''
    });
    const [avatar, setAvatar] = useState<string | undefined>(contactToEdit?.avatar);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contactData: ContactFormData = {
            name: formData.name,
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            avatar: avatar || contactToEdit?.avatar
        };
        onSave(contactData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <ImageUpload onImageSelect={setAvatar} currentImage={avatar} />
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tags (comma-separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">
                  {contactToEdit ? 'Save Changes' : 'Add Contact'}
                </button>
            </div>
        </form>
    );
};

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const data = await api.getContacts();
            setContacts(data);
        } catch (err) {
            setError('Failed to fetch contacts.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchContacts();
  }, []);

  const handleOpenAddModal = () => {
    setContactToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (contact: Contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContactToEdit(null);
  };

  const handleSaveContact = async (contactData: ContactFormData) => {
    try {
        if (contactToEdit) {
            // Update existing contact
            const updatedContact = await api.updateContact(contactToEdit.id, contactData);
            setContacts(prev => prev.map(c => (c.id === updatedContact.id ? updatedContact : c)));
        } else {
            // Add new contact
            const newContact = await api.createContact(contactData);
            setContacts(prev => [newContact, ...prev]);
        }
        handleCloseModal();
    } catch (err) {
        setError(contactToEdit ? 'Failed to update contact.' : 'Failed to add contact.');
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
        return <tr><td colSpan={6} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>;
    }
    if (error) {
        return <tr><td colSpan={6} className="text-center py-8 text-destructive">{error}</td></tr>;
    }
    return contacts.map((contact) => (
        <tr key={contact.id} className="border-b border-border hover:bg-muted/50">
            <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
            <div className="flex items-center space-x-3">
                <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full" />
                <span>{contact.name}</span>
            </div>
            </th>
            <td className="px-6 py-4">{contact.email}</td>
            <td className="px-6 py-4">{contact.phone}</td>
            <td className="px-6 py-4">{contact.company}</td>
            <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
                {contact.tags.map(tag => <Tag key={tag} text={tag} />)}
            </div>
            </td>
            <td className="px-6 py-4 text-right">
            <button onClick={() => handleOpenEditModal(contact)} className="font-medium text-primary hover:text-secondary">Edit</button>
            </td>
        </tr>
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Contacts</h1>
        <button onClick={handleOpenAddModal} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Contact
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 font-semibold">Phone</th>
                <th scope="col" className="px-6 py-4 font-semibold">Company</th>
                <th scope="col" className="px-6 py-4 font-semibold">Tags</th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderContent()}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={contactToEdit ? "Edit Contact" : "Add New Contact"}>
          <ContactForm onSave={handleSaveContact} onClose={handleCloseModal} contactToEdit={contactToEdit} />
      </Modal>
    </div>
  );
};

export default Contacts;

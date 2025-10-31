import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { Product } from '../types';
import { PlusIcon } from '../components/icons/Icons';
import Modal from '../components/common/Modal';
import * as api from '../services/api';

type AddProductData = Omit<Product, 'id' | 'createdAt'>;

const AddProductForm: React.FC<{ onAddProduct: (productData: AddProductData) => void, onClose: () => void }> = ({ onAddProduct, onClose }) => {
    const [formData, setFormData] = useState({ name: '', category: '', price: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddProduct({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
             <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={onClose} className="text-foreground font-semibold py-2 px-4 rounded-xl mr-2 hover:bg-accent">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2 font-semibold rounded-xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition">Add Product</button>
            </div>
        </form>
    );
};


const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async (productData: AddProductData) => {
        try {
            const newProduct = await api.createProduct(productData);
            setProducts(prev => [newProduct, ...prev]);
        } catch (err) {
            setError('Failed to add product.');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <tr><td colSpan={4} className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>;
        }
        if (error) {
            return <tr><td colSpan={4} className="text-center py-8 text-destructive">{error}</td></tr>;
        }
        return products.map((product) => (
            <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                    {product.name}
                </th>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">${product.price.toLocaleString()}</td>
                <td className="px-6 py-4">{new Date(product.createdAt).toLocaleDateString()}</td>
            </tr>
        ));
    };

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-display text-foreground">Products / Services</h1>
            <button onClick={() => setModalOpen(true)} className="flex items-center bg-primary text-primary-foreground px-5 py-3 font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Product
            </button>
        </div>
       <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-semibold">Product Name</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {renderContent()}
                </tbody>
            </table>
        </div>
      </Card>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Product">
        <AddProductForm onAddProduct={handleAddProduct} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Products;

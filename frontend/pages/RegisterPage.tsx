import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authService';

interface RegisterPageProps {
    onRegister: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        try {
            await authService.register({ name, email, password });
            onRegister();
        } catch (err) {
            setError('Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground rounded-3xl shadow-2xl">
                <div className="text-center">
                    <div className="inline-block w-14 h-14 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-3xl font-display mb-4">
                        T
                    </div>
                    <h1 className="text-3xl font-bold text-foreground font-display">Create Account</h1>
                    <p className="mt-2 text-muted-foreground">Join the TeamDesk platform</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-center text-sm text-destructive">{error}</p>}
                    <div className="space-y-4">
                        <input name="name" type="text" placeholder="Full Name" required className="appearance-none rounded-2xl relative block w-full px-4 py-3 bg-muted border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        <input name="email" type="email" placeholder="Email address" required className="appearance-none rounded-2xl relative block w-full px-4 py-3 bg-muted border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        <input name="password" type="password" placeholder="Password" required className="appearance-none rounded-2xl relative block w-full px-4 py-3 bg-muted border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="text-center text-sm">
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            Already have an account? Sign in
                        </Link>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-primary-foreground bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

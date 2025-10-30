import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [linkSent, setLinkSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await authService.forgotPassword(email);
            setLinkSent(true);
        } catch (err) {
            setError('Could not send reset link. Please check the email address.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground rounded-3xl shadow-2xl">
                {linkSent ? (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-foreground font-display">Check your email</h1>
                        <p className="mt-2 text-muted-foreground">We've sent a password reset link to your email address.</p>
                        <Link to="/login" className="mt-6 inline-block w-full text-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-primary-foreground bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all">
                           Back to Sign in
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground font-display">Reset Password</h1>
                            <p className="mt-2 text-muted-foreground">Enter your email to get a reset link.</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && <p className="text-center text-sm text-destructive">{error}</p>}
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="appearance-none rounded-2xl relative block w-full px-4 py-3 bg-muted border border-input placeholder-muted-foreground text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            
                            <div className="text-center text-sm">
                                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                                    Back to Sign in
                                </Link>
                            </div>

                            <div>
                                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-2xl text-primary-foreground bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Intake.css';

function Intake() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessName: '',
        biggestChallenge: '',
        repetitiveProcesses: '',
        aiGoals: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    // Prefill email if provided in URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFgbHHM63wG-WrNwFrwzzLoj0kv6r7MD9RHPDFhTAVeS-8Y2UopbSVrzacie8GuZARg/exec';

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'intake'
                }),
            });

            setStatus('success');
            setFormData({
                name: '',
                email: '',
                businessName: '',
                biggestChallenge: '',
                repetitiveProcesses: '',
                aiGoals: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="intake-page">
            <Header />

            <main className="intake-main">
                <div className="intake-container">
                    <div className="intake-header">
                        <h1>Let's Automate Your Success</h1>
                        <p>Tell us a bit about your business. We'll analyze your needs and show you exactly where AI can save you time and money.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="intake-success">
                            <h2>Message Received! 🚀</h2>
                            <p>Thank you for sharing your details. Our team is reviewing your information and will be in touch shortly to schedule your free consultation.</p>
                            <a href="/" className="btn-home">Back to Home</a>
                        </div>
                    ) : (
                        <form className="intake-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="businessName">Business Name</label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="Your Company Ltd."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="biggestChallenge">What is your biggest business challenge right now?</label>
                                <textarea
                                    id="biggestChallenge"
                                    name="biggestChallenge"
                                    value={formData.biggestChallenge}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="e.g. Too much time spent on emails, difficulty tracking leads..."
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="repetitiveProcesses">List any repetitive tasks you do daily/weekly:</label>
                                <textarea
                                    id="repetitiveProcesses"
                                    name="repetitiveProcesses"
                                    value={formData.repetitiveProcesses}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="e.g. Invoicing, data entry, social media posting..."
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="aiGoals">What are your goals with AI/Automation?</label>
                                <select
                                    id="aiGoals"
                                    name="aiGoals"
                                    value={formData.aiGoals}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a goal...</option>
                                    <option value="Save Time">Save Time</option>
                                    <option value="Reduce Costs">Reduce Costs</option>
                                    <option value="Scale Operations">Scale Operations</option>
                                    <option value="Improve Customer Experience">Improve Customer Experience</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-submit" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Sending...' : 'Submit for Review'}
                            </button>

                            {status === 'error' && <p className="error-message">Something went wrong. Please try again.</p>}
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Intake;

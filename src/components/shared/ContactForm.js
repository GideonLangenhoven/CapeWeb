import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import './ContactForm.css';

/**
 * ContactForm Component
 *
 * Full-featured contact form with validation and submission handling.
 * Can be used standalone or integrated into a contact page.
 */
export default function ContactForm({ onSubmit, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'website', label: 'Website Development' },
    { value: 'ai', label: 'AI Automation' },
    { value: 'support', label: 'Support' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // Clear error for this field when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but validate format if provided)
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Subject validation
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Custom submission handler if provided
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: log to console (replace with actual API call)
        console.log('Form submitted:', formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Success
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      if (onSuccess) {
        onSuccess(formData);
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-grid">
        <Input
          id="name"
          label="Your Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="John Doe"
          disabled={isSubmitting}
          success={submitSuccess ? "Thank you!" : ""}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="john@example.com"
          disabled={isSubmitting}
          autoComplete="email"
        />

        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+27 XX XXX XXXX"
          helper="Optional - We'll call if needed"
          disabled={isSubmitting}
          autoComplete="tel"
        />

        <Select
          id="subject"
          label="Subject"
          value={formData.subject}
          onChange={handleChange}
          options={subjectOptions}
          error={errors.subject}
          required
          placeholder="Select a topic"
          disabled={isSubmitting}
        />
      </div>

      <Textarea
        id="message"
        label="Your Message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
        rows={6}
        placeholder="Tell us about your project or inquiry..."
        helper={`${formData.message.length} / 500 characters`}
        disabled={isSubmitting}
      />

      {submitSuccess && (
        <div className="contact-form-success" role="alert">
          ✅ Message sent successfully! We'll get back to you within 24 hours.
        </div>
      )}

      <div className="contact-form-footer">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          icon={!isSubmitting && <PaperAirplaneIcon className="w-5 h-5" />}
          fullWidth
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>

        <p className="contact-form-note">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="contact-form-link">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}

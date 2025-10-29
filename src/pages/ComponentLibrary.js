import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Loading,
  EmptyState,
  NoResults,
  ErrorState
} from '../components/ui';
import { TrustBadges, ContactForm } from '../components/shared';
import {
  PaperAirplaneIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  InboxIcon
} from '@heroicons/react/24/solid';
import './ComponentLibrary.css';

/**
 * Component Library Page
 *
 * Demonstrates all UI components from the design system.
 * Useful for development, testing, and documentation.
 */
export default function ComponentLibrary() {
  const [toasts, setToasts] = useState([]);

  return (
    <div className="component-library">
      <div className="container">
        <header className="library-header">
          <h1>CapeWeb Component Library</h1>
          <p className="library-description">
            A comprehensive showcase of all UI components built according to the CapeWeb style guide.
            WCAG 2.2 AA compliant, responsive, and dark mode ready.
          </p>
        </header>

        {/* Buttons Section */}
        <section className="library-section">
          <h2>Buttons</h2>
          <p className="section-description">
            Reusable button component with multiple variants, sizes, and icon support.
          </p>

          <div className="component-demo">
            <h3>Variants</h3>
            <div className="demo-grid">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>

            <h3>Sizes</h3>
            <div className="demo-grid">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="base">Base</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>

            <h3>With Icons</h3>
            <div className="demo-grid">
              <Button variant="primary" icon={<PaperAirplaneIcon className="w-5 h-5" />}>
                Send Message
              </Button>
              <Button
                variant="secondary"
                icon={<HeartIcon className="w-5 h-5" />}
                iconPosition="left"
              >
                Save to Favorites
              </Button>
            </div>

            <h3>States</h3>
            <div className="demo-grid">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" href="#demo">As Link</Button>
            </div>
          </div>
        </section>

        {/* Form Inputs Section */}
        <section className="library-section">
          <h2>Form Inputs</h2>
          <p className="section-description">
            Accessible form components with validation, error handling, and helper text.
          </p>

          <div className="component-demo">
            <div className="demo-form">
              <Input
                id="demo-input"
                label="Text Input"
                placeholder="Enter your name"
                helper="This is helper text"
              />

              <Input
                id="demo-email"
                label="Email Input"
                type="email"
                placeholder="your@email.com"
                required
              />

              <Input
                id="demo-error"
                label="Input with Error"
                error="This field has an error"
              />

              <Input
                id="demo-success"
                label="Input with Success"
                success="Looks good!"
              />

              <Textarea
                id="demo-textarea"
                label="Textarea"
                rows={4}
                placeholder="Enter your message..."
                helper="Maximum 500 characters"
              />

              <Select
                id="demo-select"
                label="Select Dropdown"
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' }
                ]}
                placeholder="Choose an option"
              />
            </div>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="library-section">
          <h2>Loading States</h2>
          <p className="section-description">
            Loading indicators with multiple variants and sizes.
          </p>

          <div className="component-demo">
            <h3>Spinner</h3>
            <div className="demo-grid">
              <Loading variant="spinner" size="sm" />
              <Loading variant="spinner" size="base" />
              <Loading variant="spinner" size="lg" />
            </div>

            <h3>Dots</h3>
            <div className="demo-grid">
              <Loading variant="dots" size="sm" />
              <Loading variant="dots" size="base" />
              <Loading variant="dots" size="lg" />
            </div>

            <h3>With Text</h3>
            <Loading variant="spinner" text="Loading content..." />
          </div>
        </section>

        {/* Empty States Section */}
        <section className="library-section">
          <h2>Empty States</h2>
          <p className="section-description">
            Helpful empty state messages with optional actions.
          </p>

          <div className="component-demo">
            <EmptyState
              icon={<InboxIcon />}
              title="No messages yet"
              description="When you receive messages, they'll appear here."
              actionLabel="Compose Message"
              onAction={() => alert('Action clicked!')}
            />

            <div style={{ marginTop: 'var(--space-6)' }}>
              <NoResults searchTerm="unicorns" onClear={() => alert('Clear search')} />
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
              <ErrorState
                error={{ message: 'Failed to load data' }}
                onRetry={() => alert('Retry clicked')}
              />
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="library-section">
          <h2>Trust Badges</h2>
          <p className="section-description">
            Security and trust signals to build credibility.
          </p>

          <div className="component-demo">
            <TrustBadges />
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="library-section">
          <h2>Contact Form</h2>
          <p className="section-description">
            Full-featured contact form with validation and submission handling.
          </p>

          <div className="component-demo">
            <ContactForm
              onSubmit={async (data) => {
                console.log('Form submitted:', data);
                return new Promise(resolve => setTimeout(resolve, 1500));
              }}
              onSuccess={(data) => {
                console.log('Success callback:', data);
              }}
            />
          </div>
        </section>

        {/* Design Tokens Section */}
        <section className="library-section">
          <h2>Design Tokens</h2>
          <p className="section-description">
            Color palette, spacing scale, and typography system.
          </p>

          <div className="component-demo">
            <h3>Colors</h3>
            <div className="color-grid">
              <div className="color-swatch">
                <div className="swatch" style={{ backgroundColor: '#0A174E' }}></div>
                <div className="swatch-label">Primary</div>
                <code>#0A174E</code>
              </div>
              <div className="color-swatch">
                <div className="swatch" style={{ backgroundColor: '#00D4FF' }}></div>
                <div className="swatch-label">Secondary</div>
                <code>#00D4FF</code>
              </div>
              <div className="color-swatch">
                <div className="swatch" style={{ backgroundColor: '#6A00FF' }}></div>
                <div className="swatch-label">Accent</div>
                <code>#6A00FF</code>
              </div>
            </div>

            <h3>Spacing Scale (8px base)</h3>
            <div className="spacing-demo">
              <div className="spacing-item">
                <div className="spacing-box" style={{ width: '8px' }}></div>
                <span>--space-1: 8px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-box" style={{ width: '16px' }}></div>
                <span>--space-2: 16px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-box" style={{ width: '24px' }}></div>
                <span>--space-3: 24px</span>
              </div>
              <div className="spacing-item">
                <div className="spacing-box" style={{ width: '32px' }}></div>
                <span>--space-4: 32px</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="library-footer">
          <p>
            All components are WCAG 2.2 AA compliant, fully responsive, and support dark mode.
          </p>
          <p>
            <a href="/privacy">Privacy Policy</a> | <a href="/">Back to Home</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

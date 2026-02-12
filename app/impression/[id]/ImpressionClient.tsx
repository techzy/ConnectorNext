// app/impression/[id]/ImpressionClient.tsx
'use client';

import { useState } from 'react';

export default function ImpressionClient({ 
  youtubeLink, 
  userId 
}: { 
  youtubeLink: string, 
  userId: string 
}) {
  const [submitted, setSubmitted] = useState(false);
  const [validated, setValidated] = useState(false);
  const [contactInfo, setContactInfo] = useState<{email: string, phone: string} | null>(null);

  const handleShare = async () => {
    const shareData = {
      title: 'Video Preview',
      text: 'Check out this video',
      url: window.location.href // or the specific video link
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard');
    }
  };

  const handleMeetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const phone = formData.get('phoneInput') as string;
    const email = formData.get('emailInput') as string;

    await fetch('/api/send_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, target_email: email, user_id: userId }),
    });

    // Close modal logic - in React/Bootstrap we usually use state or direct DOM manipulation
    // For simplicity with raw bootstrap JS:
    const closeBtn = document.getElementById('closeModalBtn');
    if(closeBtn) closeBtn.click();

    setContactInfo({ email, phone });
    setSubmitted(true);
    setValidated(false);
    form.reset();
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="h4 mb-4">Impression</h1>

          <div className="ratio ratio-16x9 mb-3">
            <iframe src={youtubeLink} title="YouTube video" allowFullScreen></iframe>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button onClick={handleShare} className="btn btn-lg btn-outline-secondary">
              Share
            </button>
            <button 
              type="button" 
              className="btn btn-lg btn-primary" 
              data-bs-toggle="modal" 
              data-bs-target="#meetModal"
            >
              Meet
            </button>
          </div>

          {submitted && contactInfo && (
            <div className="alert alert-success" role="alert">
              Thanks — we'll contact you at <strong>{contactInfo.email}</strong> or <strong>{contactInfo.phone}</strong>.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="meetModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request Contact</h5>
              <button type="button" id="closeModalBtn" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleMeetSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="phoneInput" className="form-label">Phone number</label>
                  <input type="tel" className="form-control" name="phoneInput" id="phoneInput" required />
                  <div className="invalid-feedback">Please enter your phone number.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email address</label>
                  <input type="email" className="form-control" name="emailInput" id="emailInput" required />
                  <div className="invalid-feedback">Please enter a valid email address.</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
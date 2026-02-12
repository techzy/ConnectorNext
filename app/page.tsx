// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [result, setResult] = useState<{ link: string; email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const link = formData.get('linkInput') as string;
    const email = formData.get('emailInput') as string;

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, link }),
      });
      const data = await res.json();
      
      if (data.redirect_url) {
        // Show success message briefly then redirect
        setResult({ link, email });
        window.location.href = data.redirect_url;
      }
    } catch (error) {
      console.error(error);
    }
    
    setValidated(true);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <form
                noValidate
                className={validated ? 'was-validated' : ''}
                onSubmit={handleSubmit}
              >
                <h1 className='pb-3 text-center'>Connector</h1>
                <div className="mb-3">
                  <label htmlFor="linkInput" className="form-label">Link</label>
                  <input
                    type="url"
                    className="form-control"
                    name="linkInput"
                    id="linkInput"
                    placeholder="Enter youtube link"
                    required
                  />
                  <div className="invalid-feedback">Please provide a valid URL.</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailInput"
                    id="emailInput"
                    placeholder="name@gmail.com"
                    required
                  />
                  <div className="invalid-feedback">Please provide a valid email address.</div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>

              {result && (
                <div className="mt-3 alert alert-success" role="alert">
                  Submitted: <strong>{result.link}</strong> — {result.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
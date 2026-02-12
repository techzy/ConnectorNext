// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center">
        <div className="col-lg-6">
          <div className="p-5">
            <h1 className="display-4 mb-3">404</h1>
            <p className="lead mb-4">The requested impression could not be found.</p>
            <Link href="/" className="btn btn-primary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
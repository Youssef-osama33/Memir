'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>حدث خطأ ما</h2>
      <p>{error.message || 'عذراً، وقع خطأ غير متوقع.'}</p>
      <button onClick={() => reset()} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
        إعادة المحاولة
      </button>
    </div>
  );
}

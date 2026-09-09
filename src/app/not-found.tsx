import Link from 'next/link';



export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FCFBF9', fontFamily: 'serif' }} dir="rtl">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#000' }}>الصفحة غير موجودة</h2>
        <p style={{ marginBottom: '24px', color: '#666', fontFamily: 'sans-serif' }}>عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</p>
        <Link href="/" style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '10px 24px', textDecoration: 'none', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

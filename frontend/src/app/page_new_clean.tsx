export default function Home() {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#1f2937'
      }}>
        OptiBite
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#6b7280',
        marginBottom: '2rem'
      }}>
        AI-Powered Meal Planning
      </p>
      <p style={{
        fontSize: '1.2rem',
        color: '#374151',
        lineHeight: '1.6'
      }}>
        Your personal nutrition assistant is now working properly!
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0, color: '#0369a1' }}>
          ✅ Next.js app is running successfully at http://localhost:3000
        </p>
      </div>
    </div>
  );
}

"use client";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#1f2937',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              O
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>OptiBite</span>
          </div>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#features" style={{ color: '#6b7280', textDecoration: 'none' }}>Features</a>
            <a href="#how-it-works" style={{ color: '#6b7280', textDecoration: 'none' }}>How it Works</a>
            <a href="#about" style={{ color: '#6b7280', textDecoration: 'none' }}>About</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          padding: '5rem 0 8rem 0',
          overflow: 'hidden'
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)'
          }} />
          
          {/* Content */}
          <div style={{
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              maxWidth: '64rem',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                border: '1px solid #e5e7eb',
                padding: '0.25rem 0.75rem',
                fontSize: '14px',
                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                margin: '0 auto'
              }}>
                AI-Powered Nutrition Planning
              </div>
              
              {/* Headline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  margin: 0
                }}>
                  Your Personal
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #1f2937 0%, #6b7280 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Meal Planning
                  </span>
                  <br />
                  Assistant
                </h1>
                
                <p style={{
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  maxWidth: '42rem',
                  margin: '0 auto',
                  lineHeight: 1.6
                }}>
                  Get science-based nutrition plans tailored to your unique metabolic profile with AI-powered insights.
                </p>
              </div>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  backgroundColor: '#1f2937',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  Start Planning →
                </button>
                
                <button style={{
                  backgroundColor: 'transparent',
                  color: '#1f2937',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          padding: '4rem 0',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* Feature 1 */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Precision Targeting
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                  Scientifically calculated BMR and calorie targets based on your physiology
                </p>
              </div>

              {/* Feature 2 */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  AI-Enhanced
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                  Creative meal descriptions and smart ingredient suggestions powered by AI
                </p>
              </div>

              {/* Feature 3 */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Instant Results
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
                  Get your personalized meal plan in seconds with real-time optimization
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        padding: '2rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#1f2937',
              color: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              O
            </div>
            <span style={{ fontWeight: 'bold' }}>OptiBite</span>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            AI-powered nutrition planning for a healthier lifestyle.
          </p>
          
          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <p style={{ margin: 0 }}>© 2025 OptiBite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

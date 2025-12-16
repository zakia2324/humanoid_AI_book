import React from 'react';
import Layout from '@theme/Layout';

function Signup() {
  return (
    <Layout title="Signup" description="Create a new account">
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
        <h1>Signup</h1>
        <p>This is a placeholder signup page.</p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
          <input type="text" placeholder="Username" style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="email" placeholder="Email" style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Password" style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="Confirm Password" style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '0.75rem', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>Signup</button>
        </form>
      </main>
    </Layout>
  );
}

export default Signup;

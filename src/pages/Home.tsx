import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, signUp, signIn, signOut } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [anonName, setAnonName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">
          You're logged in as {user.user_metadata?.anonymous_name || 'User'}!
        </h1>
        <button onClick={signOut} className="px-4 py-2 bg-red-500 text-white rounded">
          Sign Out
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError('');
    try {
      if (isSignUp) {
        if (!anonName) {
          setError('Please enter an anonymous name.');
          return;
        }
        await signUp(email, password, anonName);
        alert('Signed up! Check email for confirmation.');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        alert('Signed in!');
        navigate('/rooms');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to NeighborChat</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-xs"
      />
      {isSignUp && (
        <input
          type="text"
          placeholder="Anonymous Name (e.g., ChatFan123)"
          value={anonName}
          onChange={(e) => setAnonName(e.target.value)}
          className="mb-2 p-2 border rounded w-full max-w-xs"
        />
      )}
      <button 
        onClick={handleSubmit} 
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button 
        onClick={() => setIsSignUp(!isSignUp)} 
        className="text-blue-500 underline"
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Home;
import { useState } from 'react';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true); // Bascule entre Login et Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // --- LOGIQUE DE CONNEXION (LOGIN) ---
            try {
                const response = await fetch('http://127.0.0.1:8000/api/token/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // On sauvegarde le token dans le navigateur
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    onLogin(); // On prévient App.jsx que c'est bon
                } else {
                    setError("Nom d'utilisateur ou mot de passe incorrect.");
                }
            } catch (err) {
                setError("Erreur de connexion au serveur.");
            }
        } else {
            // --- LOGIQUE D'INSCRIPTION (REGISTER) ---
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, email })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("🎉 Compte créé avec succès ! Connectez-vous maintenant.");
                    setIsLogin(true); // Bascule vers la page de connexion
                } else {
                    setError(data.error || "Erreur lors de l'inscription.");
                }
            } catch (err) {
                setError("Erreur de connexion au serveur.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {isLogin ? "Connexion" : "Créer un compte"}
                </h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                            required 
                        />
                    </div>
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800">
                        {isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-600">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-600 font-bold hover:underline">
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth;
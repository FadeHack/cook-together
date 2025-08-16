// src/App.tsx
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { AppRouter } from './routes';
import { auth } from './config/firebase';
import { useAuthStore } from './store/auth.store';
import { getCurrentUser } from './services/auth.service';
import { getSavedRecipes } from './services/user.service';

function App() {
  const { setUser, setSavedRecipes } = useAuthStore();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        try {
          // Get the fresh ID token
          const idToken = await firebaseUser.getIdToken();
          // Fetch our backend's user profile
          const [appUser, savedRecipesResponse] = await Promise.all([
            getCurrentUser(idToken),
            getSavedRecipes() // This uses the token from our axios interceptor
          ]);
          // Update the global state
          setUser(appUser);

          const savedIds = savedRecipesResponse.results.map(recipe => recipe.id);
          setSavedRecipes(savedIds);

        } catch (error) {
          console.error('Failed to fetch user profile on app load:', error);
          // If we fail to get our profile, log them out of the app state
          setUser(null); 
        }
      } else {
        // User is signed out.
        // This will set isAuthenticated: false and isLoading: false
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setSavedRecipes]); // Re-run effect if setUser function changes (it won't, but it's good practice)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
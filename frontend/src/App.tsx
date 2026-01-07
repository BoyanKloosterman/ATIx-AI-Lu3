import AppRoutes from './AppRoutes.tsx';
import { AuthProvider } from './features/auth/AuthProvider.tsx';
import { ProfileProvider } from './features/profile/hooks/useProfile.tsx';

function App() {
    return (
        <AuthProvider>
            <ProfileProvider>
                <AppRoutes />
            </ProfileProvider>
        </AuthProvider>
    );
}

export default App;

// PersonalInfo.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

// import { CreateProfileDto } from '../types/profile.types';

export default function PersonalInfo() {
    const [showStudielocatieInfo, setShowStudielocatieInfo] = useState(false);
    const [opleiding, setOpleiding] = useState('');
    const [leerjaar, setLeerjaar] = useState('');
    const [studielocatie, setStudielocatie] = useState('');
    const [studiepunten, setStudiepunten] = useState('');
    const navigate = useNavigate();
    const { setDraft, userProfile, error } = useProfile();
    const [showError, setShowError] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    
    // Track if we've done the initial prefill
    const prefillDoneRef = useRef(false);

    // Only prefill once when userProfile becomes available
    useEffect(() => {
        if (!userProfile || prefillDoneRef.current) return;
        
        prefillDoneRef.current = true;
        
        setOpleiding(userProfile.studyProgram ?? '');
        setLeerjaar(String(userProfile.yearOfStudy ?? ''));
        setStudiepunten(String(userProfile.studyCredits ?? ''));
        setStudielocatie(userProfile.studyLocation ?? '');
    }, [userProfile]);

    // If the provider reports an error (server-side), show it
    useEffect(() => {
        if (error) {
            setLocalError(null);
            setShowError(true);
        }
    }, [error]);

    function handleNext() {
        if(!opleiding || !leerjaar || !studiepunten) {
            setLocalError('Vul alle velden in.');
            setShowError(true);
            return;
        }
        const form = { opleiding, leerjaar, studielocatie, studiepunten };
        console.log('handleNext - form:', form);

        // save partial form in profile context so it persists across navigation and refresh
        setDraft(form);
        console.log('handleNext - draft set');

        // navigate to next step
        console.log('handleNext - location before navigate', window.location.pathname);
        navigate('/profile/skillsAndIntrests');
        console.log('handleNext - navigate called');
        console.log('handleNext - location after navigate', window.location.pathname);
    }

    
    return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-sm">
            <h1 className="text-white text-4xl font-normal text-center mb-8">Profiel aanmaken</h1>
            
            <div className="bg-neutral-800 rounded-3xl p-6 space-y-4">
            
            <h2 className="text-white text-2xl font-normal text-center mb-4">Persoonlijke gegevens</h2>
            <div className="relative flex items-center w-full max-w-md">
                {/* Connecting line */}
                <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gray-600" />
                {/* Step 1 */}
                <p className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-black">1</p>
                {/* Step 2 */}
                <p className="relative z-10 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-sm font-medium text-white">2</p>
            </div>
            <div>
                <p> Vul hieronder je persoonlijke gegevens in om je profiel aan te maken die de Ai recommender zal gebruiken om modules voor jou te vinden.</p>
            </div>
            {showError && (localError || error) && (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                            <p className="text-red-300 text-sm">{localError ?? error}</p>
                        </div>
                    )}
            <div>
                <label htmlFor="opleiding" className="block text-white text-sm mb-2">
                Opleiding
                </label>
                <input
                type="text"
                id="opleiding"
                value={opleiding}
                onChange={(e) => { setOpleiding(e.target.value); setShowError(false); setLocalError(null); }}
                className="w-full bg-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
            </div>

            <div>
                <label htmlFor="leerjaar" className="block text-white text-sm mb-2">
                Leerjaar
                </label>
                <input
                type="number"
                id="leerjaar"
                value={leerjaar}
                onChange={(e) => { setLeerjaar(e.target.value); setShowError(false); setLocalError(null); }}
                className="w-full bg-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
            </div>
            {showStudielocatieInfo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-sm text-white relative">

                <h3 className="text-lg font-medium mb-2">Studielocatie</h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                    Vul hier een locatie in waar je zou willen studeren.
                    Dit veld is NIET verplicht om in te vullen!
                </p>

                <button
                    onClick={() => setShowStudielocatieInfo(false)}
                    className="mt-6 w-full rounded-lg bg-violet-400 hover:bg-violet-300 text-white font-medium py-2 transition"
                >
                    Sluiten
                </button>
                </div>
            </div>
            )}
            <div>
                <label htmlFor="studielocatie" className="flex items-center gap-2 text-white text-sm mb-2">
                    Studielocatie

                    {/* Info icon */}
                    <button
                    type="button"
                    onClick={() => setShowStudielocatieInfo(true)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-white hover:bg-neutral-500 transition"
                    aria-label="Studielocatie informatie"
                    >
                    i
                    </button>
                </label>

                <input
                    type="text"
                    id="studielocatie"
                    value={studielocatie}
                    onChange={(e) => { setStudielocatie(e.target.value); setShowError(false); setLocalError(null); }}
                    className="w-full bg-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
            </div>

            <div>
                <label htmlFor="studiepunten" className="block text-white text-sm mb-2">
                Studiepunten
                </label>
                <select
                    id="studiepunten"
                    value={studiepunten}
                    onChange={(e) => { setStudiepunten(e.target.value); setShowError(false); setLocalError(null); }}
                    className="w-full bg-neutral-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                    <option value="0">Selecteer studiepunten</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                </select>
            </div>


            <button 
                type="button"
                onClick={handleNext}
                style={{ backgroundColor: '#c4b5fd' }}
                className="w-full hover:bg-violet-400 text-black font-medium rounded-lg px-4 py-3 mt-4 transition-colors"
            >
                Volgende
            </button>
            </div>
        </div>

        <div className="fixed bottom-4 left-4 text-red-600 text-xl font-bold">
            Avans
        </div>
        
    </div>
    );
};


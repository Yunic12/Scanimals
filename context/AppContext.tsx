import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OwnerProfile {
  name: string;
  age: string;
  birthday: string;
  sex: string;
}

export interface Pet {
  id: string;
  name: string;
  emo: string;
  species: string;
  breed: string;
  allergy: string;
  chip: string;
  vax: boolean;
}

export interface UserAccount {
  email: string;
  password?: string;
  owner: OwnerProfile;
  pets: Pet[];
}

interface AppContextType {
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  owner: OwnerProfile | null;
  pets: Pet[];
  activePet: Pet | null;
  lost: boolean;
  loading: boolean;
  showWelcomeSplash: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, ownerProfile: OwnerProfile, initialPet: Omit<Pet, 'id'>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateOwnerProfile: (profile: OwnerProfile) => Promise<void>;
  addPet: (newPet: Omit<Pet, 'id'>) => Promise<void>;
  updatePet: (updatedPet: Pet) => Promise<void>;
  setLost: (status: boolean) => Promise<void>;
  dismissSplash: () => void;
}

const DEFAULT_USERS: UserAccount[] = [
  {
    email: 'sarah@scanimals.com',
    password: 'password123',
    owner: {
      name: 'Sarah Jenkins',
      age: '26',
      birthday: '1998-05-14',
      sex: 'Female',
    },
    pets: [
      {
        id: '1',
        name: 'Biscuit',
        emo: '🐕',
        species: 'Dog',
        breed: 'Golden Retriever',
        allergy: 'None',
        chip: '985112004481',
        vax: true,
      },
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [usersDb, setUsersDb] = useState<UserAccount[]>(DEFAULT_USERS);
  
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [lost, setLostState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWelcomeSplash, setShowWelcomeSplash] = useState<boolean>(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedDb = await AsyncStorage.getItem('scanimals_users_db');
      const storedSession = await AsyncStorage.getItem('scanimals_active_session');

      let db = DEFAULT_USERS;
      if (storedDb) {
        db = JSON.parse(storedDb);
        setUsersDb(db);
      } else {
        await AsyncStorage.setItem('scanimals_users_db', JSON.stringify(DEFAULT_USERS));
      }

      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        const activeUser = db.find((u: UserAccount) => u.email === sessionData.email);
        if (activeUser) {
          setIsAuthenticated(true);
          setCurrentUserEmail(activeUser.email);
          setOwner(activeUser.owner);
          setPets(activeUser.pets || []);
          setLostState(sessionData.lost || false);
        }
      }
    } catch (e) {
      console.error('Failed to load storage', e);
    } finally {
      setLoading(false);
    }
  };

  const persistSession = async (email: string, db: UserAccount[], isLost: boolean) => {
    await AsyncStorage.setItem('scanimals_users_db', JSON.stringify(db));
    await AsyncStorage.setItem('scanimals_active_session', JSON.stringify({ email, lost: isLost }));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const found = usersDb.find((u) => u.email.toLowerCase() === cleanEmail && u.password === pass);

    if (found) {
      setIsAuthenticated(true);
      setCurrentUserEmail(found.email);
      setOwner(found.owner);
      setPets(found.pets);
      setShowWelcomeSplash(true); // Trigger welcome splash upon successful login
      await persistSession(found.email, usersDb, lost);
      return true;
    }
    return false;
  };

  const signup = async (
    email: string, 
    pass: string, 
    ownerProfile: OwnerProfile, 
    initialPet: Omit<Pet, 'id'>
  ): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = usersDb.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) return false; // Account already exists

    const newPet: Pet = { ...initialPet, id: Date.now().toString() };
    const newUser: UserAccount = {
      email: cleanEmail,
      password: pass,
      owner: ownerProfile,
      pets: [newPet],
    };

    const updatedDb = [...usersDb, newUser];
    setUsersDb(updatedDb);
    setIsAuthenticated(true);
    setCurrentUserEmail(cleanEmail);
    setOwner(ownerProfile);
    setPets([newPet]);
    setShowWelcomeSplash(true); // Trigger welcome splash upon registration

    await persistSession(cleanEmail, updatedDb, lost);
    return true;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    setOwner(null);
    setPets([]);
    await AsyncStorage.removeItem('scanimals_active_session');
  };

  const updateOwnerProfile = async (profile: OwnerProfile) => {
    if (!currentUserEmail) return;
    setOwner(profile);

    const updatedDb = usersDb.map((u) => 
      u.email.toLowerCase() === currentUserEmail.toLowerCase() ? { ...u, owner: profile } : u
    );
    setUsersDb(updatedDb);
    await persistSession(currentUserEmail, updatedDb, lost);
  };

  const addPet = async (newPetData: Omit<Pet, 'id'>) => {
    if (!currentUserEmail) return;
    const created: Pet = { ...newPetData, id: Date.now().toString() };
    const updatedPets = [...pets, created];
    setPets(updatedPets);

    const updatedDb = usersDb.map((u) => 
      u.email.toLowerCase() === currentUserEmail.toLowerCase() ? { ...u, pets: updatedPets } : u
    );
    setUsersDb(updatedDb);
    await persistSession(currentUserEmail, updatedDb, lost);
  };

  const updatePet = async (updatedPet: Pet) => {
    if (!currentUserEmail) return;
    const updatedPets = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p));
    setPets(updatedPets);

    const updatedDb = usersDb.map((u) => 
      u.email.toLowerCase() === currentUserEmail.toLowerCase() ? { ...u, pets: updatedPets } : u
    );
    setUsersDb(updatedDb);
    await persistSession(currentUserEmail, updatedDb, lost);
  };

  const setLost = async (status: boolean) => {
    setLostState(status);
    if (currentUserEmail) {
      await persistSession(currentUserEmail, usersDb, status);
    }
  };

  const dismissSplash = () => {
    setShowWelcomeSplash(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUserEmail,
        owner,
        pets,
        activePet: pets[0] || null,
        lost,
        loading,
        showWelcomeSplash,
        login,
        signup,
        logout,
        updateOwnerProfile,
        addPet,
        updatePet,
        setLost,
        dismissSplash,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
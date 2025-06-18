import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { User } from './types'; // Make sure you have a types.ts file for the User interface

// Define the structure for our database file
interface Database {
  users: User[];
}

// --- WEB-SPECIFIC BACKEND using localStorage ---

const readUsersFromLocalStorage = async (): Promise<User[]> => {
    console.log("[Backend - Web] Reading users from localStorage.");
    try {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error("[Backend - Web] Failed to read from localStorage:", error);
        return [];
    }
};

const writeUsersToLocalStorage = async (users: User[]): Promise<void> => {
    console.log("[Backend - Web] Writing users to localStorage.");
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error("[Backend - Web] Failed to write to localStorage:", error);
    }
};


// --- NATIVE-SPECIFIC BACKEND using Expo File System ---

const dbUri = FileSystem.documentDirectory + 'db.json';

const ensureDbExists = async () => {
    const fileInfo = await FileSystem.getInfoAsync(dbUri);
    if (!fileInfo.exists) {
        console.log("[Backend - Native] Database file not found, creating new one at:", dbUri);
        await FileSystem.writeAsStringAsync(dbUri, JSON.stringify({ users: [] }, null, 2), {
            encoding: FileSystem.EncodingType.UTF8,
        });
    }
};

const readUsersFromFile = async (): Promise<User[]> => {
    await ensureDbExists();
    try {
        const fileContent = await FileSystem.readAsStringAsync(dbUri, { encoding: FileSystem.EncodingType.UTF8 });
        console.log("[Backend - Native] Successfully read db.json");
        const data: Database = JSON.parse(fileContent);
        return data.users || [];
    } catch (error) {
        console.error("[Backend - Native] Failed to read or parse user data:", error);
        return [];
    }
};

const writeUsersToFile = async (users: User[]) => {
    try {
        const data: Database = { users };
        await FileSystem.writeAsStringAsync(dbUri, JSON.stringify(data, null, 2), { encoding: FileSystem.EncodingType.UTF8 });
        console.log("[Backend - Native] Successfully wrote to db.json");
    } catch (error) {
        console.error("[Backend - Native] Failed to write user data:", error);
    }
};


// --- UNIFIED SERVICE FUNCTIONS ---

/**
 * Finds a user by their email address from the appropriate storage.
 */
export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  console.log(`[Backend] Attempting to find user on platform: ${Platform.OS}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  const users = Platform.OS === 'web' ? await readUsersFromLocalStorage() : await readUsersFromFile();
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    console.log("[Backend] Found user:", user.fullName);
  } else {
    console.log("[Backend] User not found.");
  }
  return user;
};

/**
 * Adds a new user to the appropriate storage.
 */
export const addUser = async (userData: Omit<User, 'id' | 'passwordHash'> & { password: string }): Promise<User> => {
    console.log(`[Backend] Attempting to add user on platform: ${Platform.OS}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = Platform.OS === 'web' ? await readUsersFromLocalStorage() : await readUsersFromFile();
    
    const newUser: User = {
        id: String(Date.now()),
        fullName: userData.fullName,
        email: userData.email,
        passwordHash: userData.password, // In a real app, you MUST hash the password
    };

    users.push(newUser);

    if (Platform.OS === 'web') {
        await writeUsersToLocalStorage(users);
    } else {
        await writeUsersToFile(users);
    }

    console.log("[Backend] User added successfully.");
    return newUser;
};

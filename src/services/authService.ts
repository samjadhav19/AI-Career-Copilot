import { AuthUser } from '../types';

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  targetRole: string;
  experienceLevel: string;
  createdAt: string;
}

const STORAGE_KEY = 'ai_copilot_registered_accounts';
const SESSION_BACKUP_KEY = 'ai_copilot_registered_accounts_session';

const SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'seed-alex',
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    targetRole: 'frontend-dev',
    experienceLevel: 'Intermediate',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-maya',
    name: 'Maya Patel',
    email: 'maya@example.com',
    password: 'password123',
    targetRole: 'data-analyst',
    experienceLevel: 'Intermediate',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-demo',
    name: 'Demo Candidate',
    email: 'demo@copilot.com',
    password: 'password123',
    targetRole: 'fullstack-dev',
    experienceLevel: 'Intermediate',
    createdAt: new Date().toISOString(),
  },
];

// In-memory cache ensures accounts persist within the JS runtime across all page events
let memoryAccounts: StoredAccount[] = [...SEED_ACCOUNTS];

export const authService = {
  /**
   * Retrieves all registered accounts, syncing memory, localStorage, and sessionStorage.
   */
  getAccounts(): StoredAccount[] {
    try {
      // 1. Try localStorage
      let accounts: StoredAccount[] | null = null;
      const localData = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            accounts = parsed;
          }
        } catch {
          // ignore parse error
        }
      }

      // 2. Try sessionStorage fallback
      if (!accounts && typeof window !== 'undefined') {
        const sessionData = sessionStorage.getItem(SESSION_BACKUP_KEY);
        if (sessionData) {
          try {
            const parsed = JSON.parse(sessionData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              accounts = parsed;
            }
          } catch {
            // ignore
          }
        }
      }

      // 3. If still nothing or memory has more recent custom registered accounts, merge with memory
      if (!accounts) {
        accounts = memoryAccounts.length > 0 ? memoryAccounts : SEED_ACCOUNTS;
      } else {
        // Ensure all memory accounts (e.g. newly registered in this session) are present
        const existingEmails = new Set(accounts.map((a) => a.email.toLowerCase()));
        memoryAccounts.forEach((ma) => {
          if (!existingEmails.has(ma.email.toLowerCase())) {
            accounts!.push(ma);
          }
        });
      }

      // Ensure SEED accounts are also included
      const currentEmailSet = new Set(accounts.map((a) => a.email.toLowerCase()));
      SEED_ACCOUNTS.forEach((seed) => {
        if (!currentEmailSet.has(seed.email.toLowerCase())) {
          accounts!.push(seed);
        }
      });

      memoryAccounts = accounts;
      this.saveAccounts(accounts);
      return accounts;
    } catch (e) {
      console.warn('Error reading registered accounts:', e);
      return memoryAccounts.length > 0 ? memoryAccounts : SEED_ACCOUNTS;
    }
  },

  /**
   * Saves updated accounts across memory, localStorage, and sessionStorage.
   */
  saveAccounts(accounts: StoredAccount[]): void {
    memoryAccounts = accounts;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
        sessionStorage.setItem(SESSION_BACKUP_KEY, JSON.stringify(accounts));
      }
    } catch (e) {
      console.error('Error saving registered accounts:', e);
    }
  },

  /**
   * Registers a new account with normalized email & trimmed password.
   */
  register(newAccount: {
    name: string;
    email: string;
    password: string;
    targetRole: string;
    experienceLevel: string;
  }): { success: boolean; user?: AuthUser; error?: string } {
    const cleanEmail = newAccount.email.trim().toLowerCase();
    const cleanPassword = newAccount.password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = this.getAccounts();

    // Check if email already registered
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: `An account with "${newAccount.email.trim()}" is already registered. Please sign in with your password.`,
      };
    }

    const stored: StoredAccount = {
      id: 'user-' + Date.now(),
      name: newAccount.name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      targetRole: newAccount.targetRole,
      experienceLevel: newAccount.experienceLevel,
      createdAt: new Date().toISOString(),
    };

    const updated = [stored, ...accounts];
    this.saveAccounts(updated);

    return {
      success: true,
      user: {
        id: stored.id,
        name: stored.name,
        email: stored.email,
        targetRole: stored.targetRole,
        experienceLevel: stored.experienceLevel,
      },
    };
  },

  /**
   * Authenticates email and password strictly against registered accounts.
   */
  login(
    email: string,
    password: string
  ): { success: boolean; user?: AuthUser; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    const accounts = this.getAccounts();

    // 1. Search for account by email (case-insensitive)
    const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      return {
        success: false,
        error: `Account not found. No account is registered under "${email.trim()}". Please verify your email or click Register to create this account.`,
      };
    }

    // 2. Strict password matching with trimming
    if (account.password.trim() !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. The password you entered does not match our records for this account.',
      };
    }

    return {
      success: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        targetRole: account.targetRole,
        experienceLevel: account.experienceLevel,
      },
    };
  },
};

import { type UserDocument, type UserRole } from '@/types/firestore';
import { isAllowedUserRole } from '@/lib/auth/role';

export interface DuplicateUserEntry {
  docId: string;
  uid: string | undefined;
  email: string | undefined;
  role: string | undefined;
  updatedAt: unknown;
}

export interface DuplicateUserReport {
  key: string;
  entries: DuplicateUserEntry[];
}

export function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function getUserDocumentIssues(user: UserDocument): string[] {
  const issues: string[] = [];

  if (!user.uid || typeof user.uid !== 'string' || user.uid.trim().length === 0) {
    issues.push('missingUid');
  }

  if (!user.role || !isAllowedUserRole(user.role)) {
    issues.push('missingOrInvalidRole');
  }

  return issues;
}

export function detectDuplicateUserDocuments(users: UserDocument[]): {
  emailDuplicates: DuplicateUserReport[];
  uidDuplicates: DuplicateUserReport[];
  missingUid: DuplicateUserEntry[];
  missingRole: DuplicateUserEntry[];
} {
  const emailMap = new Map<string, DuplicateUserEntry[]>();
  const uidMap = new Map<string, DuplicateUserEntry[]>();
  const missingUid: DuplicateUserEntry[] = [];
  const missingRole: DuplicateUserEntry[] = [];

  for (const user of users) {
    const docId = user.uid ?? 'unknown-doc';
    const uid = user.uid?.trim();
    const email = normalizeEmail(user.email);
    const entry: DuplicateUserEntry = {
      docId,
      uid,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
    };

    if (uid) {
      const existing = uidMap.get(uid) ?? [];
      existing.push(entry);
      uidMap.set(uid, existing);
    } else {
      missingUid.push(entry);
    }

    if (email) {
      const existing = emailMap.get(email) ?? [];
      existing.push(entry);
      emailMap.set(email, existing);
    }

    if (!user.role || !isAllowedUserRole(user.role)) {
      missingRole.push(entry);
    }
  }

  return {
    emailDuplicates: Array.from(emailMap.entries())
      .filter(([, entries]) => entries.length > 1)
      .map(([key, entries]) => ({ key, entries })),
    uidDuplicates: Array.from(uidMap.entries())
      .filter(([, entries]) => entries.length > 1)
      .map(([key, entries]) => ({ key, entries })),
    missingUid,
    missingRole,
  };
}

export function logUserAuditFindings(users: UserDocument[], context = 'user audit'): void {
  const findings = detectDuplicateUserDocuments(users);

  if (findings.emailDuplicates.length > 0) {
    console.warn(`[${context}] Duplicate email documents detected:`);
    for (const duplicate of findings.emailDuplicates) {
      console.warn(`  Email: ${duplicate.key}`);
      duplicate.entries.forEach((entry) => {
        console.warn(`    docId=${entry.docId}, uid=${entry.uid}, role=${entry.role}, updatedAt=${String(entry.updatedAt)}`);
      });
    }
  }

  if (findings.uidDuplicates.length > 0) {
    console.warn(`[${context}] Duplicate uid documents detected:`);
    for (const duplicate of findings.uidDuplicates) {
      console.warn(`  UID: ${duplicate.key}`);
      duplicate.entries.forEach((entry) => {
        console.warn(`    docId=${entry.docId}, email=${entry.email}, role=${entry.role}, updatedAt=${String(entry.updatedAt)}`);
      });
    }
  }

  if (findings.missingUid.length > 0) {
    console.warn(`[${context}] User documents missing uid:`);
    findings.missingUid.forEach((entry) => {
      console.warn(`  docId=${entry.docId}, email=${entry.email}, role=${entry.role}, updatedAt=${String(entry.updatedAt)}`);
    });
  }

  if (findings.missingRole.length > 0) {
    console.warn(`[${context}] User documents missing or invalid role:`);
    findings.missingRole.forEach((entry) => {
      console.warn(`  docId=${entry.docId}, uid=${entry.uid}, email=${entry.email}, role=${entry.role}, updatedAt=${String(entry.updatedAt)}`);
    });
  }
}

export function validateUserRole(role: unknown): UserRole | null {
  if (isAllowedUserRole(role)) {
    return role;
  }
  return null;
}

export function normalizeUserRole(role: unknown): UserRole {
  if (isAllowedUserRole(role)) {
    return role;
  }
  return 'student';
}

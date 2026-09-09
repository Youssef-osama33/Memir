import { db, withDbRetry } from "./db";

// Fallback in-memory profile store for preview or transient sessions
const memoryUserStore = new Map<string, { name?: string | null; phoneNumber?: string | null; email?: string | null }>();

export interface ProfileValidationResult {
  isValid: boolean;
  formattedNumber?: string;
  errorMessage?: string;
}

/**
 * Validates a WhatsApp phone number with dial code.
 * Ensures the phone number contains reasonable digit length (7 to 15 digits).
 */
export function validateWhatsAppNumber(dialCode: string, rawNumber: string): ProfileValidationResult {
  if (!rawNumber || !rawNumber.trim()) {
    return {
      isValid: false,
      errorMessage: "يرجى إدخال رقم هاتف واتساب للتواصل.",
    };
  }

  // Remove spaces, hyphens, parenthesis, leading zeroes
  const cleanedDigits = rawNumber.replace(/[\s\-\(\)\.]/g, "").replace(/^0+/, "");

  if (!/^\d+$/.test(cleanedDigits)) {
    return {
      isValid: false,
      errorMessage: "رقم الهاتف يجب أن يحتوي على أرقام فقط دون حروف أو رموز خاصة.",
    };
  }

  if (cleanedDigits.length < 7 || cleanedDigits.length > 15) {
    return {
      isValid: false,
      errorMessage: "رقم الهاتف غير صالح، يجب أن يتراوح بين 7 و 15 رقماً.",
    };
  }

  const cleanDialCode = dialCode.startsWith("+") ? dialCode : `+${dialCode.replace(/[^\d]/g, "")}`;
  const fullFormatted = `${cleanDialCode}${cleanedDigits}`;

  return {
    isValid: true,
    formattedNumber: fullFormatted,
  };
}

/**
 * Retrieves user profile (name, email, phoneNumber)
 */
export async function getUserProfile(userId: string, email?: string | null) {
  if (!userId && !email) return null;

  // 1. Try fetching from Prisma DB if configured
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const user = await withDbRetry(async (client) => {
        return client.user.findFirst({
          where: {
            OR: [
              ...(userId ? [{ id: userId }] : []),
              ...(email ? [{ email: email.toLowerCase().trim() }] : []),
            ],
          },
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            role: true,
          },
        });
      });

      if (user) {
        // Cache to memory
        memoryUserStore.set(user.id, {
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        });
        if (user.email) {
          memoryUserStore.set(user.email.toLowerCase(), {
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
          });
        }
        return user;
      }
    } catch (err) {
      console.warn("[USER_PROFILE_GET_DB_WARN]", err);
    }
  }

  // 2. Check memory store
  const cachedById = userId ? memoryUserStore.get(userId) : null;
  const cachedByEmail = email ? memoryUserStore.get(email.toLowerCase()) : null;
  const cached = cachedById || cachedByEmail;

  if (cached) {
    return {
      id: userId || "user",
      email: email || cached.email || "",
      name: cached.name || null,
      phoneNumber: cached.phoneNumber || null,
      role: "USER" as const,
    };
  }

  return null;
}

/**
 * Updates or sets user name and WhatsApp phone number.
 */
export async function saveUserProfile(
  userId: string,
  data: { name?: string | null; phoneNumber: string; email?: string | null }
) {
  const normalizedEmail = data.email ? data.email.toLowerCase().trim() : undefined;
  const cleanName = data.name?.trim() || null;
  const cleanPhone = data.phoneNumber.trim();

  // Save to memory store first for instant UI response in dev/preview
  if (userId) {
    memoryUserStore.set(userId, {
      name: cleanName,
      phoneNumber: cleanPhone,
      email: normalizedEmail,
    });
  }
  if (normalizedEmail) {
    memoryUserStore.set(normalizedEmail, {
      name: cleanName,
      phoneNumber: cleanPhone,
      email: normalizedEmail,
    });
  }

  // Persist to Prisma DB if database URL is available
  if ((process.env.DATABASE_URL || process.env.SQL_HOST)) {
    try {
      const result = await withDbRetry(async (client) => {
        // Find existing user by ID or Email
        const existing = await client.user.findFirst({
          where: {
            OR: [
              ...(userId ? [{ id: userId }] : []),
              ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
            ],
          },
        });

        if (existing) {
          const updated = await client.user.update({
            where: { id: existing.id },
            data: {
              phoneNumber: cleanPhone,
              ...(cleanName ? { name: cleanName } : {}),
            },
          });
          return updated;
        } else if (normalizedEmail) {
          // Create user if doesn't exist yet
          const created = await client.user.create({
            data: {
              id: userId || undefined,
              email: normalizedEmail,
              name: cleanName,
              phoneNumber: cleanPhone,
            },
          });
          return created;
        }
        return null;
      });

      if (result) return result;
    } catch (dbErr) {
      console.error("[SAVE_USER_PROFILE_DB_ERR]", dbErr);
    }
  }

  return {
    id: userId,
    email: normalizedEmail,
    name: cleanName,
    phoneNumber: cleanPhone,
  };
}

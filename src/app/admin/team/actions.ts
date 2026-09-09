"use server";

import { db } from "../../../lib/db";
import { auth } from "../../../lib/auth";
import { Role, Category } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Promote a USER to WRITER or update an existing staff member
export async function updateStaffMember(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;
  const title = formData.get("title") as string;
  const bio = formData.get("bio") as string;
  const authorSlug = formData.get("authorSlug") as string;
  const assignedCategories = formData.getAll("assignedCategories") as Category[];

  if (!email || !role) {
    throw new Error("Email and Role are required");
  }

  // Find user by email
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Update user role
  await db.user.update({
    where: { id: user.id },
    data: { role },
  });

  // If role is WRITER or ADMIN, update/create writer profile
  if (role === "WRITER" || role === "ADMIN") {
    await db.writerProfile.upsert({
      where: { userId: user.id },
      update: {
        title,
        bio,
        authorSlug: authorSlug || null,
        assignedCategories,
      },
      create: {
        userId: user.id,
        title,
        bio,
        authorSlug: authorSlug || null,
        assignedCategories,
      },
    });
  }

  revalidatePath("/admin/team");
  return { success: true };
}

// Demote a staff member to USER
export async function demoteToUser(userId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await db.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });

  revalidatePath("/admin/team");
  return { success: true };
}

import User, {IUser} from "../database/models/user.model";

/**
 * Create a new user in the database.
 * @param userData - The user data to create.
 * @returns The newly created user.
 */
export async function createUser(userData: IUser): Promise<IUser> {
  try {
    const newUser = await User.create(userData);
    return newUser.toObject();
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user");
  }
}

/**
 * Update an existing user in the database.
 * @param clerkId - The Clerk ID of the user to update.
 * @param updates - The fields to update.
 * @returns The updated user.
 */
export async function updateUser(
  clerkId: string,
  updates: Partial<Omit<IUser, "_id" | "clerkId">>
): Promise<IUser | null> {
  try {
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updates, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }

    return updatedUser.toObject();
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Unable to update user");
  }
}

/**
 * Delete a user from the database.
 * @param clerkId - The Clerk ID of the user to delete.
 * @returns The deleted user.
 */
export async function deleteUser(clerkId: string): Promise<IUser | null> {
  try {
    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }

    return deletedUser.toObject();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Unable to delete user");
  }
}

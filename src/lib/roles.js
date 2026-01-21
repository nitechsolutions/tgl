export function requireRole(user, roles = []) {
  if (!user) return false;
  return roles.includes(user.role);
}

export function requireOwnerOrAdmin(user, post) {
  if (user.role === "admin" || user.role === "writer") return true;
  return post.author.toString() === user.id;
}

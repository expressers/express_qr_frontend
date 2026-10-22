function userNameParts(name: string | null) {
  const nameParts = name ? name.split(" ") : ["Express", "QR"];
  const firstInitial = nameParts[0]?.[0] || "";
  const secondInitial = nameParts[1]?.[0] || "";
  const initials = `${firstInitial}${secondInitial}`.toUpperCase();

  return initials;
}

export { userNameParts };

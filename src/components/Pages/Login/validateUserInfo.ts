export const valideUserInfo = (
  email: string,
  password: string,
  name: string
): string | null => {
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    email
  );
  const isPasswordValid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);

  if (!isEmailValid) return "Email must contain @ and .com";
  if (!isPasswordValid)
    return "Password must contains Capital letter, numeric and symbols";
  if (name) console.log(name);

  return null;
};

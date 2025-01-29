// @ts-ignore
export const validatePassword = ({ password }, checkPassComplexity) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
  const containsLowercase = (ch: string) => /[a-z]/.test(ch);
  const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

  let countOfUpperCase = 0;
  let countOfLowerCase = 0;
  let countOfNumbers = 0;
  let countOfSpecialChar = 0;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i);
    if (!Number.isNaN(+ch)) countOfNumbers++;
    else if (containsUppercase(ch)) countOfUpperCase++;
    else if (containsLowercase(ch)) countOfLowerCase++;
    else if (containsSpecialChar(ch)) countOfSpecialChar++;
  }
  if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfSpecialChar < 1 || countOfNumbers < 1) {
    checkPassComplexity.addIssue({
      code: "custom",
      message: "password does not meet complexity requirements",
    });
  }
};

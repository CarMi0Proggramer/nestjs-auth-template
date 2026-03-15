export type GoogleProfile = {
  displayName: string;
  emails: { value: string; verified: boolean }[];
};

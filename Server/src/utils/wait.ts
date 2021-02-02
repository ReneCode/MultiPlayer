export const wait = (ms: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
};

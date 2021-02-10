export const createSocketMock = () => {
  const socketMock: any = {
    to: () => ({
      emit: (msg) => {},
    }),
  };
  return socketMock;
};

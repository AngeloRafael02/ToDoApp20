
export default async (req, res) => {
  const { reqHandler } = await import('../dist/ToDoApp20/server/server.mjs');
  return reqHandler(req, res);
};

import app from "./app.js";
import { createSocketServer } from "../socketes/socketIo.js";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = createSocketServer(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

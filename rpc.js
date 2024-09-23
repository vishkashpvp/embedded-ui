(function () {
  const RPC_SERVER_URL = "ws://10.0.2.15:8000/websocket";
  const JSON_RPC_TIMEOUT_MS = 5000;
  let rpc = null;
  let isRpcConnected = false;

  console.log("inside rpc.js file..........................");

  function jsonRpc({ onopen, onclose, onnotification }) {
    let rpcid = 0;
    const pending = {};
    const ws = new WebSocket(RPC_SERVER_URL);

    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log("WebSocket connection established.");
        isRpcConnected = true;
        if (onopen) onopen();

        resolve({
          close: () => ws.close(),
          call: (method, params) => {
            const id = rpcid++;
            const request = { id, method, params };
            ws.send(JSON.stringify(request));
            console.log("Sent:", request);

            return new Promise((resolve, reject) => {
              const timeoutId = setTimeout(() => {
                console.log("Timing out frame:", JSON.stringify(request));
                delete pending[id];
                reject(new Error("Request timed out."));
              }, JSON_RPC_TIMEOUT_MS);

              pending[id] = (response) => {
                clearTimeout(timeoutId);
                resolve(response);
              };
            });
          },
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(new Error("Failed to connect to WebSocket server."));
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
        isRpcConnected = false;
        if (onclose) onclose();
        reject(new Error("WebSocket connection closed."));
      };

      ws.onmessage = (ev) => {
        const frame = JSON.parse(ev.data);
        console.log("Frame received:", frame);
        console.log("Pending requests:", pending);

        if (frame.id !== undefined) {
          const resolve = pending[frame.id];
          if (resolve) {
            resolve(frame);
            delete pending[frame.id];
          }
        } else {
          if (onnotification) onnotification(frame);
        }
      };
    });
  }

  async function connectRpc() {
    console.log(`Connecting to RPC server at: ${RPC_SERVER_URL}`);
    try {
      rpc = await jsonRpc({
        onnotification: (msg) => console.log("Received notification:", JSON.stringify(msg)),
      });
      if (!rpc) {
        console.error("Failed to establish RPC connection.");
        return;
      }
      console.log("RPC connection established:", rpc);
    } catch (err) {
      console.error("RPC connection error:", err);
      window.location.href = "/error.html";
    }
  }

  function callRpcMethod(method, params) {
    if (!rpc) {
      console.error("RPC not connected yet.");
      return;
    }
    console.log(method, "-->", params);
    rpc
      .call(method, params)
      .then((result) => console.log("RPC call result:", result))
      .catch((error) => console.error("RPC call failed:", error));
  }

  // Expose globally
  window.jsonRpc = jsonRpc;
  window.connectRpc = connectRpc;
  window.callRpcMethod = callRpcMethod;
  window.isRpcConnected = () => isRpcConnected;
})();

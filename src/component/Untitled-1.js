const socket = new WebSocket('ws://localhost:8080/api/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (frame) {
  console.log('Connected: ' + frame);

  // Subscribe to a topic
  stompClient.subscribe('/topic/farmer/1', function (message) {
    console.log("Received notification:", message.body);
  });

  // Send a test message (optional)
  stompClient.send("/app/some-endpoint", {}, JSON.stringify({ message: "Test message" }));
});
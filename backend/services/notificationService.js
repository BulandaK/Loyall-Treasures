const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const USER_REGISTRATION_QUEUE = "user_registration_notifications";

let channel = null;

async function connectRabbitMQ() {
  try {
    if (channel) return channel;

    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Deklaracja kolejki (upewnienie się, że istnieje)
    // durable: true - kolejka przetrwa restart brokera
    await channel.assertQueue(USER_REGISTRATION_QUEUE, { durable: true });

    console.log("Successfully connected to RabbitMQ and ensured queue exists.");
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    // Możesz dodać logikę ponawiania połączenia lub rzucić błąd dalej
    throw error;
  }
}

async function sendUserRegistrationNotification(userData) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    // persistent: true - wiadomość przetrwa restart brokera (jeśli kolejka jest durable)
    channel.sendToQueue(
      USER_REGISTRATION_QUEUE,
      Buffer.from(JSON.stringify(userData)),
      { persistent: true }
    );
    console.log(
      `[x] Sent user registration notification for: ${userData.email}`
    );
  } catch (error) {
    console.error("Error sending notification to RabbitMQ:", error);
    // Tutaj można dodać logikę fallback lub ponownego wysłania
  }
}

// Inicjalizacja połączenia przy starcie aplikacji (opcjonalnie, ale zalecane)
connectRabbitMQ().catch(console.error);

module.exports = {
  connectRabbitMQ,
  sendUserRegistrationNotification,
  USER_REGISTRATION_QUEUE, // Eksportujemy nazwę kolejki, jeśli będzie potrzebna gdzie indziej
};

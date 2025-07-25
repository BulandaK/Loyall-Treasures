const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const USER_REGISTRATION_QUEUE = "user_registration_notifications";

let channel = null;

async function connectRabbitMQ() {
  try {
    if (channel) return channel;

    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(USER_REGISTRATION_QUEUE, { durable: true });

    console.log("Successfully connected to RabbitMQ and ensured queue exists.");
    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);

    throw error;
  }
}

async function sendUserRegistrationNotification(userData) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
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
  }
}

connectRabbitMQ().catch(console.error);

module.exports = {
  connectRabbitMQ,
  sendUserRegistrationNotification,
  USER_REGISTRATION_QUEUE,
};

require("dotenv").config({ path: "../.env" });
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const USER_REGISTRATION_QUEUE = "user_registration_notifications";

async function startWorker() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(USER_REGISTRATION_QUEUE, { durable: true });

    channel.prefetch(1);

    console.log(
      `[*] Worker waiting for messages in ${USER_REGISTRATION_QUEUE}. To exit press CTRL+C`
    );

    channel.consume(
      USER_REGISTRATION_QUEUE,
      async (msg) => {
        if (msg !== null) {
          const userData = JSON.parse(msg.content.toString());
          console.log(`[.] Received user registration data: ${userData.email}`);

          try {
            console.log(
              `Simulating sending welcome email to ${userData.email} for user ${userData.firstName}...`
            );
            // await sendEmail(userData.email, "Welcome to Loyall Treasures!", `Hello ${userData.firstName}, ...`);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(`[x] Processed notification for ${userData.email}`);
            channel.ack(msg);
          } catch (processingError) {
            console.error(
              `Error processing message for ${userData.email}:`,
              processingError
            );
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Worker failed to start or connect to RabbitMQ:", error);
    process.exit(1);
  }
}

startWorker();

require("dotenv").config({ path: "../.env" }); // Załaduj zmienne środowiskowe, jeśli worker jest w innym katalogu
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const USER_REGISTRATION_QUEUE = "user_registration_notifications";

async function startWorker() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(USER_REGISTRATION_QUEUE, { durable: true });

    // prefetch(1) - worker będzie pobierał tylko jedną wiadomość na raz
    // Dopóki nie potwierdzi przetworzenia, nie dostanie kolejnej.
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
            // Symulacja wysyłania emaila
            console.log(
              `Simulating sending welcome email to ${userData.email} for user ${userData.firstName}...`
            );
            // Tutaj umieściłbyś logikę wysyłania rzeczywistego emaila
            // np. używając nodemailer
            // await sendEmail(userData.email, "Welcome to Loyall Treasures!", `Hello ${userData.firstName}, ...`);

            // Symulacja czasu przetwarzania
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log(`[x] Processed notification for ${userData.email}`);
            channel.ack(msg); // Potwierdzenie przetworzenia wiadomości
          } catch (processingError) {
            console.error(
              `Error processing message for ${userData.email}:`,
              processingError
            );
            // Zdecydowanie, czy wiadomość powinna wrócić do kolejki (nack z requeue)
            // czy zostać odrzucona (nack bez requeue lub ack, jeśli nie da się jej przetworzyć)
            // Na przykład, jeśli błąd jest przejściowy:
            // channel.nack(msg, false, true);
            // Jeśli błąd jest permanentny (np. zły format danych):
            channel.nack(msg, false, false); // Wiadomość trafi do Dead Letter Exchange (jeśli skonfigurowano) lub zostanie odrzucona
          }
        }
      },
      { noAck: false } // noAck: false - ręczne potwierdzanie wiadomości
    );
  } catch (error) {
    console.error("Worker failed to start or connect to RabbitMQ:", error);
    process.exit(1); // Zakończ proces workera, jeśli nie może się połączyć
  }
}

startWorker();

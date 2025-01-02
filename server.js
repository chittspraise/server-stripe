const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

// Initialize Express app and Stripe with your secret key
const app = express();
const stripe = new Stripe('sk_test_51QWMaiC2SQuTnTNRnOSYSArT4j8NclUWd68HLC49bDrJDBDroTE8k9odficET3PKzB8CkVx9qYaECX8M2Ic0dMzF00Q5PidwMW'); // Replace with your actual Stripe secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the Stripe Payment Backend!');
});

// Route to create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents for USD)
      currency,
      payment_method_types: ['card'], // Accept card payments
    });

    // Send the client secret to the frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
const IP_ADDRESS = '192.168.0.161'; // Update with your local network IP address
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running at http://${IP_ADDRESS}:${PORT}`);
});

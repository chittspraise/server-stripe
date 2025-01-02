require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

// Initialize Express app and Stripe with your secret key
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Validate Stripe secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not defined in environment variables.');
  process.exit(1); // Exit the process if the key is missing
}

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Stripe Payment Backend!');
});

// Route to create a Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  // Input validation
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing "amount" in the request body.' });
  }

  if (!currency || typeof currency !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "currency" in the request body.' });
  }

  try {
    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is an integer
      currency: currency.toLowerCase(), // Ensure currency is lowercase
      payment_method_types: ['card'], // Specify payment methods
    });

    // Respond with the client secret
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Payment Intent. Please try again later.' });
  }
});

// Server listener
const PORT = process.env.PORT || 3001;
const IP_ADDRESS = process.env.IP_ADDRESS || '127.0.0.1'; // Update to localhost for local testing
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running at http://${IP_ADDRESS}:${PORT}`);
});

# Mossaic-eXsite
An all in one AI powered Agentic Shopping Tool for the AI age.

eXsite is a Chrome extension that makes online shopping less annoying.

Most of the time, buying something online means jumping between sites like Amazon and Flipkart, checking prices, looking for coupons, and then repeating the same process again.
This project tries to reduce that effort.

What it does
Price comparison on the spot

When you open a product on Amazon, the extension picks up the product details and checks if there’s a better deal on Flipkart.

If there is, it shows it right there.
No need to search again.

Search using normal language

There’s also a full-screen interface where you can type something like:

“laptop under 20k for coding”

It understands the request and shows relevant products instead of making you use filters.

Better decisions for multiple items

If you’re buying more than one thing, it doesn’t just list products.

It tries to find the cheapest combination:

maybe one item is cheaper on Amazon
another is cheaper on Flipkart

You’ll see:

best combined option
Amazon-only option
Flipkart-only option
Simulated checkout (Agent Pay)

Instead of going through each site manually, you can click “Agent Pay”.

It will:

simulate opening the site
add items to cart
go through checkout steps

At the end, you get a single summary showing everything you “bought”.
This is just a simulation for now, not real payments.

How it’s built
Chrome extension handles scraping and UI
Backend is built using Next.js
AI understanding is handled by Google Gemini
Data is stored in Supabase
What’s not perfect
Product matching is basic
Data is limited
Checkout is not real
Coupon support is minimal
Why this exists

Not because price comparison tools don’t exist.

But because the process still feels manual.
You still have to do everything yourself.

This project is more about exploring what happens if that process is handled for you instead.
Here is The Architecture Diagram

<img width="1248" height="1637" alt="ArchitectureDiagram" src="https://github.com/user-attachments/assets/39744a2e-9b5a-4a57-86b5-36296c724eaf" />

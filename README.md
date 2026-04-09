# 🛒 Exsite

Exsite is a Chrome extension that makes online shopping simpler and less repetitive.

Instead of jumping between sites like Amazon and Flipkart, comparing prices, and checking out separately, Exsite brings everything into one flow.

---

## 🧩 What it does

### 🔍 Price comparison on the spot
When you open a product page on Amazon, Exsite automatically checks if the same or similar product is available for a better price on Flipkart.

If it finds a better deal, it shows it instantly.  
No extra searching.

---

### 💬 Search the way you think
You can open the full interface and type something like:

> laptop under 20k for coding

The system understands the request and shows relevant products without needing filters.

---

### 🧠 Smarter choices for multiple items
If you’re buying more than one product, Exsite helps you figure out the cheapest way to buy them.

It gives you:
- Best combined option (mix of platforms)  
- Amazon-only option  
- Flipkart-only option  

---

### 🤖 Agent Pay (simulated checkout)
Instead of going through each site manually, you can use **Agent Pay**.

It simulates:
- Opening the platform  
- Adding items to cart  
- Going through checkout  

At the end, you get a single summary with all items and total cost.  
(This is simulated for now, no real payments.)

---

## 🏗️ How it’s built

- Chrome Extension → handles scraping and UI  
- Backend → built with Next.js  
- AI → powered by Google Gemini  
- Database → managed using Supabase  

---

## ⚙️ Tech stack

- Next.js  
- Chrome Extension APIs  
- Supabase  
- Google Gemini API  

---

## ⚠️ Current limitations

- Checkout is simulated  
- Product matching is basic  
- Limited product data  
- Coupon support is minimal  

---

## 🔮 Future improvements

- Real checkout integration  
- Better product matching  
- Live pricing APIs  
- Smarter recommendations  

---

## 💭 Why this project

Online shopping still feels manual.

This project explores what happens if a system can:
- understand what you want  
- compare options  
- and handle the process for you  

---

## 📌 Note

This was built as a hackathon project, so the focus is on the idea and flow rather than production-level accuracy.

This project is more about exploring what happens if that process is handled for you instead.
Here is The Architecture Diagram

<img width="1248" height="1637" alt="ArchitectureDiagram" src="https://github.com/user-attachments/assets/39744a2e-9b5a-4a57-86b5-36296c724eaf" />

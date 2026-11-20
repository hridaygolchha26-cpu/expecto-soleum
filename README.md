# ⚽ EXPECTO SOLEUM
### Find Your Perfect Fit. Own Your Game.

**Expecto Soleum** is a football footwear discovery and fit-matching platform designed to help players find football boots suited to their individual foot dimensions.

Choosing football boots is about more than brand names, professional endorsements or appearance. Foot length, width, boot construction and fit compatibility all influence the experience of wearing a pair of studs.

Expecto Soleum aims to bring these considerations together in one interactive platform, combining foot measurement, 3D visualisation, footwear recommendations and an integrated shopping experience.

**Live Website:** https://expecto-soleum.vercel.app

---

# 1. 🎯 The Problem We're Solving

Football boots are often purchased based on brand preference, design, price or recommendations from other players.

However, the same boot can feel very different on different feet.

Players may encounter difficulties such as:

- Finding boots that accommodate their foot width.
- Understanding which boot size is suitable for their measurements.
- Comparing different football boot models.
- Identifying footwear that offers a compatible fit.
- Making informed decisions without trying on multiple pairs.

The central idea behind Expecto Soleum is simple:

**Football footwear recommendations should consider the player's feet, not just the player's preferences.**

---

# 2. 💡 The Core Innovation — Measurement-Based Boot Discovery

The main feature of Expecto Soleum is its measurement-oriented footwear recommendation system.

Users can enter two important measurements:

- **Foot Length:** The heel-to-toe measurement, recorded in centimetres.
- **Foot Width:** The measurement across the widest part of the foot.

These measurements form the basis of the user's foot profile.

The platform then uses its fit-calculation logic to help identify suitable football boot options.

### The process

1. The user enters their foot dimensions.
2. The application processes the supplied measurements.
3. Available football boots are evaluated through the prototype's fit-calculation system.
4. Recommended footwear is presented with compatibility information.
5. The user can explore the recommended boots and proceed towards booking.

The objective is to make footwear discovery more informed, accessible and personalised.

---

# 3. 🦶 3D Foot Visualisation

Expecto Soleum incorporates a three-dimensional foot visualisation interface to make the measurement experience more interactive.

### Key elements

- A 3D representation of a foot wearing a football sock.
- Visual measurement indicators for foot length and width.
- Dynamic visualisation associated with the entered measurements.
- An interactive interface that connects measurement input with footwear discovery.

Rather than presenting users with a conventional measurement form alone, the 3D interface aims to make foot dimensions easier to understand visually.

The visualisation is part of the interactive prototype and does not independently perform a physical biometric scan.

---

# 4. ⚽ Football Studs Specialist Catalogue

Unlike a generic footwear shopping platform, Expecto Soleum is focused specifically on football boots and studs.

The catalogue is organised around football footwear, allowing users to explore different models and their available information.

### Catalogue information

Depending on the product entry, the application can present:

- Football boot model and product imagery.
- Available sizes.
- Footwear descriptions.
- Fit-related information.
- Compatibility recommendations.
- Product selection and booking options.

### Football Surface Compatibility

Football boots are designed for different playing surfaces. Understanding the distinction is important when choosing footwear.

| Surface | Description |
|---|---|
| FG — Firm Ground | Designed primarily for natural grass pitches with firm surfaces |
| SG — Soft Ground | Designed for softer, wetter natural grass |
| AG — Artificial Ground | Designed for artificial grass surfaces |
| TF — Turf | Designed for shorter, carpet-like artificial turf |

The long-term vision is to make surface suitability another useful dimension of footwear discovery.

---

# 5. 🧮 Fit Compatibility Engine

The fit calculator is one of the most important parts of the application.

The project includes a dedicated utility:

`src/utils/fitCalculator.js`

Its purpose is to support the application's measurement-based footwear matching process.

### What the system aims to achieve

- Use foot measurements as inputs.
- Evaluate available footwear against fit-related parameters.
- Present compatibility information.
- Help users compare potential footwear choices.

Compatibility percentages are prototype-generated indicators, not medically validated measurements or guarantees of comfort.

The long-term objective is to develop a more comprehensive fitting engine using reliable footwear specifications, manufacturer sizing information and real-world user feedback.

---

# 6. 🛒 Complete Shopping Experience

Expecto Soleum is designed around an end-to-end user journey rather than a standalone recommendation screen.

### A. Foot Measurement

Users enter their foot length and width to establish their foot profile.

### B. Matched Studs

The application presents football footwear options with fit compatibility information.

### C. Product Selection

Users can explore available boots and select a preferred product and size.

### D. Shopping Cart

Selected footwear can be added to the cart, where users can review their selection and order summary.

### E. Checkout

The checkout interface brings together the selected product, size, customer details and payment-method information.

### F. Booking Confirmation

Following the prototype booking flow, users can view their order confirmation and invoice information.

### G. Order Tracking

The tracking interface presents a booking reference, delivery information and a dispatch-status timeline.

**Note:** Checkout, payment and delivery tracking are demonstration features in the current prototype. They do not represent live payment processing or an operational delivery network.

---

# 7. 🎨 User Interface & Design Philosophy

The visual identity of Expecto Soleum is built around football, performance and precision.

The interface uses:

- A dark, charcoal-inspired visual foundation.
- Golden and yellow accent elements.
- High-contrast typography.
- Football footwear imagery.
- Dedicated product cards and recommendation sections.
- Interactive measurement and shopping interfaces.

The intention is to create an experience that feels like a specialised football footwear platform rather than a conventional online shopping catalogue.

The design prioritises clarity, visual distinction and a connected user journey.

---

# 8. 🛠️ Technology Stack

The project uses a modern web-development structure.

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development environment and build tooling |
| JavaScript | Application logic and interactivity |
| Three.js | 3D visualisation, where implemented |
| CSS / Tailwind CSS | Interface styling, as used in the project |

### Project Structure

The repository is organised into the following structure:

```text
expecto-soleum/
│
├── images/
│   ├── Product profile images
│   └── Football boot images
│
├── src/
│   ├── components/
│   │   ├── BookingStatusPage.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── CheckoutView.jsx
│   │   ├── Foot3DViewer.jsx
│   │   ├── MeasurementForm.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── ShoeCard.jsx
│   │   └── ShoeCatalog.jsx
│   │
│   ├── data/
│   │   └── shoes.js
│   │
│   ├── utils/
│   │   └── fitCalculator.js
│   │
│   └── App.jsx
│
├── index.html
├── package.json
├── .gitignore
└── README.md
```

### Architecture Overview

**Components:** Individual interface elements and application screens are organised into reusable React components.

**Data:** The `shoes.js` file contains the football footwear catalogue data.

**Utilities:** The `fitCalculator.js` file contains the application's fit-related calculation logic.

**Images:** The images directory stores product-related visual assets used throughout the interface.

**App.jsx:** Acts as the main application component connecting the different parts of the experience.

---

# 9. 🚀 Running the Project Locally

Want to explore the project or work on its development?

### Prerequisites

- Node.js
- npm
- A code editor such as Visual Studio Code

### Installation

Clone the repository:

```bash
git clone https://github.com/hridaygolchha26-cpu/expecto-soleum.git
```

Navigate into the project:

```bash
cd expecto-soleum
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local development address, usually:

```text
http://localhost:5173
```

### Production Build

To generate a production build:

```bash
npm run build
```

---

# 10. 🌐 Deployment

Expecto Soleum is deployed using **Vercel**.

The live application can be accessed here:

https://expecto-soleum.vercel.app

The project uses Vite's production build configuration for deployment.

---

# 11. 🔭 Future Development

Expecto Soleum is an evolving project. There are several possibilities for expanding its functionality.

### Improved Fit Intelligence
- More comprehensive foot-shape classification.
- Better integration of manufacturer sizing specifications.
- More detailed footwear compatibility calculations.
- Improved recommendations using real-world fitting feedback.

### Enhanced 3D Experience
- More detailed foot visualisation.
- Improved measurement visualisation.
- More interactive product and footwear previews.

### Expanded Football Catalogue
- More footwear brands and models.
- Detailed stud configurations.
- Surface-specific recommendations.
- Additional product specifications.

### Better Shopping Experience
- More comprehensive order management.
- Real payment integration.
- Reliable delivery tracking.
- User accounts and saved foot profiles.

### User-Centred Improvements
- Testing with actual football players.
- Collecting usability feedback.
- Identifying confusing interactions.
- Improving the platform through repeated testing.

These are future development goals, not claims about features already implemented.

---

# 12. 🧪 Current Development Status

**Status: Interactive Prototype — Live Deployment**

Expecto Soleum is currently being developed as an interactive prototype.

The current version demonstrates the central concept through foot measurement inputs, 3D visualisation, football boot recommendations, product selection, checkout and order tracking interfaces.

User testing is an important part of the next development stage. Feedback will help identify usability issues and determine which improvements should be prioritised.

---

# 13. 👨‍💻 Project Information

**Project Name:** Expecto Soleum

**Category:** Football Technology / Sports Technology / E-commerce

**Development Stage:** Interactive Prototype

**Programme:** YIIC

**Developer:** Hriday

**Live Website:** https://expecto-soleum.vercel.app

**GitHub Repository:** https://github.com/hridaygolchha26-cpu/expecto-soleum

---

### The Vision

Football is a game of precision, movement and individual performance.

Every player has different feet, yet footwear is often selected through a relatively generic shopping experience.

Expecto Soleum aims to bridge that gap by bringing foot measurements and football footwear discovery together.

**Because the right game starts with the right fit.**

⚽ **EXPECTO SOLEUM — FIND YOUR PERFECT FIT. OWN YOUR GAME.**

![Beavr Dam Logo](/public/images/logo.webp)

## About Us

Welcome to Beavr Dam, the ultimate flood-resistant barrier designed for windows and doors. Our product offers a reliable and adaptable solution for protecting your property from flooding. Key features include:

- **Versatile Design**: Our barrier can be easily installed in any opening frame using a vertically adjustable anchor with a user-friendly jacking system.
- **Water Impermeable Panels**: The flood gates securely attach to the anchors, offering lateral expansion and a tight seal with the sides and bottom of the opening.
- **Enhanced Peripheral Seal**: Minimizes the risk of leakage at the corners, ensuring comprehensive protection.
- **Modular Nature**: For wider openings, multiple flood gates can be assembled adjacent to each other.

Invest in peace of mind with Beavr Dam, where reliability meets adaptability.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- PNPM (v7 or higher)
- MySQL (or compatible database)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Soru321/beavr-dam.git
   cd beavr-dam
   ```

2. **Install Dependencies**

   Use PNPM to install the necessary packages:

   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add your environment variables. Refer to `.env.example` for guidance.

4. **Database Migration**

   Generate and apply database migrations:

   ```bash
   pnpm migrate
   ```

5. **Seed admin table**

   ```bash
   pnpm db:seed admin
   ```

6. **Seed countries table**

```bash
pnpm db:seed countries
```

### Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To build the project for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Technologies Used

- **Next.js** (v14.1.0)
- **TypeScript**
- **Tailwind CSS**
- **TRPC**
- **Drizzle ORM**
- **MySQL**
- **React Query**
- **Shadcn UI**
- **Next Auth**
- **Framer Motion**
- **Axios**
- **PayPal SDK**
- **Zod**
- **Zustand**

## Scripts

Here are some useful commands:

- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Start**: `pnpm start`
- **Lint**: `pnpm lint`
- **Database Migration**: `pnpm migrate`
- **Database Seed**: `pnpm db:seed`

# Afri Processors Website

A modern, responsive Next.js website for Afri Processors - a leading agricultural processing company in Africa.

## Features

- **Home Page**: Hero section with company overview and call-to-action
- **About Us**: Company story, mission, vision, and core values
- **Shop**: E-commerce functionality with product listings, cart management, and filtering
- **Product Catalog**: Comprehensive product browsing with advanced filtering and specifications
- **Contact**: Contact form, business information, and FAQ section

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.

### Installation

1. Navigate to the project directory:
```bash
cd afri-processors
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Build for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
afri-processors/
├── src/
│   ├── app/
│   │   ├── about/           # About Us page
│   │   ├── catalog/         # Product Catalog page
│   │   ├── contact/         # Contact page
│   │   ├── shop/            # Shop page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   └── components/
│       ├── Header.tsx       # Navigation header
│       └── Footer.tsx       # Footer component
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Pages Overview

### Home Page (`/`)
- Hero section with company introduction
- Key features and services
- Call-to-action buttons

### About Us (`/about`)
- Company history and story
- Mission and vision statements
- Core values and company statistics

### Shop (`/shop`)
- Product listings with shopping cart
- Category filtering
- Product ratings and reviews
- Add to cart functionality

### Product Catalog (`/catalog`)
- Advanced product filtering
- Grid and list view modes
- Detailed product specifications
- Price range filtering

### Contact (`/contact`)
- Contact form with validation
- Business contact information
- Interactive map placeholder
- FAQ section

## Customization

### Colors
The primary color scheme is defined in `tailwind.config.js`. You can customize the colors by modifying the `primary` color palette.

### Content
All text content and product information can be updated directly in the respective page components.

### Styling
The website uses Tailwind CSS for styling. You can modify existing styles or add new utility classes as needed.

## Deployment

This website can be deployed to various platforms including:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any platform supporting Node.js applications

## Notes

- The project includes TypeScript for better type safety
- All components are responsive and work on mobile, tablet, and desktop
- The shopping cart functionality is implemented with local state management
- Form submissions are simulated and would need backend integration for production use

## License

This project is proprietary and belongs to Afri Processors.

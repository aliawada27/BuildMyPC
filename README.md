# BuildMyPC - Custom PC Builder

A comprehensive web application that helps users design their ideal custom computer setup through an intelligent recommendation engine. The app guides users through their daily needs, work tasks, and usage scenarios, then recommends a complete list of compatible components tailored to their performance requirements and budget.

## 🚀 Features

### ✅ Core Functionality
- **Smart Questionnaire**: Analyzes user needs, budget, and preferences
- **Intelligent Recommendations**: AI-powered component matching
- **Compatibility Checking**: Ensures all components work together
- **Budget Optimization**: Maximizes performance within budget constraints
- **Multiple Build Variants**: Budget, balanced, and high-end options
- **Export Functionality**: Download parts lists with vendor links

### 🎯 Key Components
- **User Onboarding**: Step-by-step wizard for gathering preferences
- **Recommendation Engine**: Advanced algorithm for component selection
- **Component Database**: Comprehensive parts database with real specs
- **Build Display**: Detailed component breakdown with pros/cons
- **Compatibility Validator**: Real-time compatibility verification

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React hooks
- **Build Tool**: Next.js with Turbopack

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd buildmypc
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
buildmypc/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.tsx      # Button component
│   │   │   └── Card.tsx        # Card component
│   │   ├── Questionnaire.tsx   # User questionnaire
│   │   └── BuildDisplay.tsx    # Build results display
│   ├── data/                   # Static data
│   │   ├── components-database.ts  # PC components data
│   │   └── questionnaire.ts    # Questionnaire structure
│   ├── types/                  # TypeScript definitions
│   │   └── pc-components.ts    # Component interfaces
│   └── utils/                  # Utility functions
│       └── recommendation-engine.ts  # Core logic
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🎮 How to Use

1. **Start Building**: Click "Start Building My PC" on the homepage
2. **Answer Questions**: Complete the 4-step questionnaire about your needs
3. **Review Build**: See your customized PC build with detailed specifications
4. **Export List**: Download a parts list with vendor links for purchasing

## 🧠 Recommendation Engine

The intelligent recommendation system considers:

- **Usage Patterns**: Gaming, content creation, programming, office work
- **Performance Requirements**: Budget, balanced, or high-end
- **Budget Constraints**: Optimal component allocation within budget
- **Brand Preferences**: Intel vs AMD, NVIDIA vs AMD preferences
- **Compatibility**: Socket types, form factors, power requirements
- **Future-Proofing**: PCIe 5.0, DDR5 support based on priorities

## 🔧 Component Categories

The system recommends components across all categories:

- **CPU**: Processors from AMD and Intel
- **GPU**: Graphics cards from NVIDIA and AMD
- **Motherboard**: Compatible with selected CPU
- **Memory**: DDR4/DDR5 RAM with appropriate capacity
- **Storage**: NVMe SSDs and traditional storage
- **Power Supply**: Adequate wattage with efficiency ratings
- **Cooling**: CPU cooling solutions
- **Case**: Compatible with motherboard form factor

## 🎨 Design System

- **Colors**: Primary blue theme with secondary grays
- **Typography**: Inter font family
- **Components**: Consistent button, card, and form styling
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and loading states

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All major browsers

## 🚀 Deployment

To build for production:

```bash
npm run build
npm start
```

The application can be deployed to any platform supporting Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Google Cloud Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🔮 Future Enhancements

- **User Accounts**: Save and manage multiple builds
- **Live Pricing**: Real-time pricing from multiple vendors
- **Community Features**: Share builds and rate components
- **Advanced Filters**: More detailed component filtering
- **Performance Benchmarks**: Expected gaming/workload performance
- **Power Calculators**: Detailed PSU requirement calculations
- **RGB Lighting**: Aesthetic customization options

---

**Built with ❤️ for PC enthusiasts and builders** 
# BuildMyPC - Smart PC Configuration App

**Intelligent PC Builder with AI-powered recommendation engine and real-time compatibility checking.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square&logo=tailwindcss)

## Project Overview

BuildMyPC simplifies PC building for non-experts by providing **intelligent component recommendations** based on user needs, budget, and usage patterns. The application features an advanced compatibility checker and generates optimized builds through smart algorithms.

### Key Features

- **AI Recommendation Engine**: Multi-criteria scoring algorithm (performance/price/compatibility)
- **Real-time Compatibility Checking**: Automatic validation of CPU sockets, RAM types, PSU power, case form factors
- **Adaptive Questionnaire**: Dynamic form with 10+ usage scenarios (Gaming, Video Editing, AI/ML, etc.)
- **Budget Optimization**: Smart component allocation across performance tiers
- **Multilingual Support**: French/English with browser language detection
- **Interactive Results**: Detailed component specs, vendor links, export options
- **Multiple Export Formats**: TXT, CSV, JSON, HTML build lists

## Architecture & Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with modern hooks and Context API
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Lucide React** for icons

### Backend & Data
- **Next.js API Routes** for component data serving
- **JSON Database** with 1000+ PC components
- **File System API** for local data management

### Core Modules
- `SmartBuildGenerator.ts` - AI recommendation engine
- `CompatibilityChecker.ts` - Hardware compatibility validation
- `ModernRecommendationEngine.ts` - Build generation algorithms
- Context API for global state management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aliawada27/BuildMyPC.git
cd BuildMyPC
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

## Usage

1. **Start the questionnaire** - Answer questions about your PC usage, budget, and preferences
2. **Get AI recommendations** - The system generates optimized builds based on your inputs
3. **Review compatibility** - Automatic checks ensure all components work together
4. **Export your build** - Download your parts list in multiple formats

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/components/     # Component data API
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── ModernQuestionnaire.tsx
│   ├── ModernComponentCard.tsx
│   └── EnhancedBuildResults.tsx
├── contexts/              # React Context providers
│   ├── ComponentsContext.tsx
│   └── LanguageContext.tsx
├── data/                  # Static data and configurations
│   ├── pc_parts_full_database.json
│   └── modern-questionnaire.ts
├── services/              # Business logic
│   ├── SmartBuildGenerator.ts
│   └── CompatibilityChecker.ts
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── locales/              # Internationalization files
```

## Algorithm Highlights

### Smart Recommendation Engine
- **Multi-criteria scoring**: Performance, price, compatibility weighted by user preferences
- **Budget allocation**: Optimal distribution across component categories
- **Performance tier matching**: Budget/Mid/High/Enthusiast level components
- **Alternative generation**: Multiple build variants (budget/balanced/performance)

### Compatibility Validation
- CPU socket ↔ Motherboard compatibility
- RAM type and capacity limits
- PSU power requirements with 20% safety margin
- Case form factor and motherboard size matching
- Cooling TDP ratings vs CPU requirements

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## Performance & Scale

- **Database**: 1000+ PC components with detailed specifications
- **Response time**: <2s build generation
- **Compatibility checks**: Real-time validation across 8 component categories
- **Export options**: 4 different formats (TXT, CSV, JSON, HTML)

## Future Enhancements

- [ ] Price tracking and alerts
- [ ] User accounts and saved builds
- [ ] Community build sharing
- [ ] Extended compatibility rules
- [ ] Mobile app version
- [ ] Integration with retailer APIs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Ali Awada** - *Full Stack Developer*
- GitHub: [@aliawada27](https://github.com/aliawada27)
- LinkedIn: [Ali Awada](https://www.linkedin.com/in/ali-awada27/)

---

*Built with ❤️ and modern web technologies* 